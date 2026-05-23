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

## If the user asks a question, please answer it based on ArticleContents.
The format is free.

## If there is a question that is not in the article, please answer, "There is no information in the article," and provide no further information.
The format is free.

## Communication Guidelines
Answer in Japanese unless otherwise instructed by the user.
Please use the ですます調 in Japanese.
`

const GENERAL_SYSTEM_PROMPT = `
You are an excellent assistant.

Please limit your response to 5 sentences or less, unless the user instructs you to "elaborate" or otherwise.
Please use the ですます調 in Japanese.
When answering in Japanese, please use "アタシ" in the first person.
You will answer in Japanese unless otherwise instructed by the user.
`

// Anthropic を主に応答を生成し、Anthropic 側のサーバーエラー時のみ OpenAI にフォールバックする。
const generate = async (
  systemPrompt: string,
  text: string
): Promise<string> => {
  try {
    // max_tokens が大きい（=API上限）と SDK は非ストリーミングを拒否するため
    // ストリーミングで実行し、完了したメッセージ全体を受け取る（応答が短ければ即返る）。
    const stream = anthropic.messages.stream({
      model: ANTHROPIC_MODEL,
      max_tokens: ANTHROPIC_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: text }],
      temperature: 0
    })
    // 複数 text block も SDK と同じ join(' ') で連結する標準ヘルパーを使う
    return await stream.finalText()
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

export const generateSummaryMessage = (text: string) =>
  generate(SYSTEM_PROMPT, text)

export const generateMessage = (text: string) =>
  generate(GENERAL_SYSTEM_PROMPT, text)
