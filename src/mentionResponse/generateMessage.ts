import Anthropic from '@anthropic-ai/sdk'
import { OpenAI } from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY']
})

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
})

const ANTHROPIC_MODEL = 'claude-sonnet-4-6'
const ANTHROPIC_MAX_TOKENS = 64000 // Sonnet 4.6 同期 Messages API の出力上限
const OPENAI_MODEL = 'gpt-4o'

// サーバーサイド Web 検索ツール。検索は Anthropic 側で実行され、Claude が
// 必要と判断したときだけ自動で使う（こちらで検索 API を実装する必要はない）。
const WEB_SEARCH_TOOL: Anthropic.Messages.WebSearchTool20250305 = {
  type: 'web_search_20250305',
  name: 'web_search',
  max_uses: 5 // 1 リクエストあたりの検索回数上限（コスト・レイテンシ抑制）
}

// pause_turn による継続リクエストの上限（初回 + 継続を含む。無限ループ防止）
const MAX_TURNS = 5

// Anthropic 側のサーバーエラー（5xx / 接続・タイムアウト）のときだけ true。
// 4xx・認証・レート制限などリクエスト起因のエラーではフォールバックしない。
const isAnthropicServerError = (error: unknown): boolean => {
  if (error instanceof Anthropic.APIConnectionError) return true
  if (error instanceof Anthropic.APIError && typeof error.status === 'number') {
    return error.status >= 500
  }
  return false
}

const SYSTEM_PROMPT = `
You are an assistant that takes markdown text, summarizes the content, and answers questions about that content.

## If the user provided only a URL in the last message, or if the user requested a summary in the last message, provide a summary of the content according to the format:
*3行まとめ*
<short and simple three-sentence summary (break line after each sentence)>

*内容*
<detailed summary (as much detail as possible)>

## If the user asks a question, first try to answer it based on ArticleContents.
The format is free.

## Only if the user's additional question cannot be answered from ArticleContents and requires looking up other documents or up-to-date external information, you may use the web_search tool to research it.
Do not use web_search just to summarize the article, nor for questions that can already be answered from ArticleContents.
The format is free.

## If the answer still cannot be found even after that, please answer, "There is no information in the article," and provide no further information.
The format is free.

## Communication Guidelines
Answer in Japanese unless otherwise instructed by the user.
Please use the ですます調 in Japanese.
`

const GENERAL_SYSTEM_PROMPT = `
You are an excellent assistant.

Please limit your response to 5 sentences or less, unless the user instructs you to "elaborate" or otherwise.
Use the web_search tool only when answering requires up-to-date information or external facts you are not confident about; otherwise answer directly without searching.
Please use the ですます調 in Japanese.
When answering in Japanese, please use "アタシ" in the first person.
You will answer in Japanese unless otherwise instructed by the user.
`

// メッセージの content ブロックから本文テキストと出典を取り出し、集約先に追記する。
// finalText() は citation を捨てるため、content ブロックを直接走査する。
// pause_turn による複数ターンに跨る応答もここで蓄積できる。
const collectContent = (
  message: Anthropic.Messages.Message,
  textParts: string[],
  sources: Map<string, string> // url -> title（重複排除）
): void => {
  for (const block of message.content) {
    if (block.type !== 'text') continue
    textParts.push(block.text)
    for (const citation of block.citations ?? []) {
      if (citation.type === 'web_search_result_location') {
        sources.set(citation.url, citation.title ?? citation.url)
      }
    }
  }
}

// 蓄積した本文と出典から最終的な応答文字列を組み立てる。
// 検索が使われた場合だけ末尾に出典 URL を付ける。
const buildResult = (
  textParts: string[],
  sources: Map<string, string>
): string => {
  // finalText() と同じく text block を join(' ') で連結する
  let result = textParts.join(' ').trim()
  if (sources.size > 0) {
    const lines = Array.from(
      sources,
      ([url, title]) => `• <${url}|${title}>`
    )
    result += `\n\n*出典*\n${lines.join('\n')}`
  }
  return result
}

// Anthropic を主に応答を生成し、Anthropic 側のサーバーエラー時のみ OpenAI にフォールバックする。
const generate = async (
  systemPrompt: string,
  text: string
): Promise<string> => {
  try {
    const messages: Anthropic.Messages.MessageParam[] = [
      { role: 'user', content: text }
    ]
    const textParts: string[] = []
    const sources = new Map<string, string>()
    // Web 検索などサーバーツール使用時、長いターンは stop_reason='pause_turn' で
    // 中断されることがある。その場合はアシスタントの途中経過を積み増してターンを
    // 継続する（無限ループ防止のため MAX_TURNS で上限を設ける）。
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      // max_tokens が大きい（=API上限）と SDK は非ストリーミングを拒否するため
      // ストリーミングで実行し、完了したメッセージ全体を受け取る（応答が短ければ即返る）。
      // tools に Web 検索を渡すと、Claude が必要と判断したときだけ自動で検索する。
      const stream = anthropic.messages.stream({
        model: ANTHROPIC_MODEL,
        max_tokens: ANTHROPIC_MAX_TOKENS,
        system: systemPrompt,
        messages,
        tools: [WEB_SEARCH_TOOL],
        temperature: 0
      })
      const message = await stream.finalMessage()
      collectContent(message, textParts, sources)
      // pause_turn 以外（end_turn 等）で完了。pause_turn のときだけ継続する。
      if (message.stop_reason !== 'pause_turn') break
      messages.push({ role: 'assistant', content: message.content })
    }
    // 本文を組み立て、検索が使われていれば出典 URL も付加する
    return buildResult(textParts, sources)
  } catch (error) {
    if (!isAnthropicServerError(error)) {
      return `エラーが発生しました。: ${error}`
    }
    // Anthropic がサーバーエラー → OpenAI にフォールバック
    try {
      const res = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0
      })
      return res.choices[0].message.content ?? ''
    } catch (fallbackError) {
      return `エラーが発生しました。: ${fallbackError}`
    }
  }
}

const URL_FALLBACK_SYSTEM_PROMPT = `
You are an assistant that summarizes web pages.
The user will provide URLs that could not be fetched directly.
Please use the web_search tool to look up the content of each URL and provide a summary:

*3行まとめ*
<short and simple three-sentence summary (break line after each sentence)>

*内容*
<detailed summary (as much detail as possible)>

Answer in Japanese unless otherwise instructed by the user.
Please use the ですます調 in Japanese.
`

export const generateSummaryMessage = (text: string) =>
  generate(SYSTEM_PROMPT, text)

export const generateSummaryMessageFromUrls = (
  urls: string[],
  conversationContext?: string
) => {
  const input = conversationContext
    ? `URLs:\n${urls.join('\n')}\n\n---\nPast Conversations:\n${conversationContext}`
    : urls.join('\n')
  return generate(URL_FALLBACK_SYSTEM_PROMPT, input)
}

export const generateMessage = (text: string) =>
  generate(GENERAL_SYSTEM_PROMPT, text)
