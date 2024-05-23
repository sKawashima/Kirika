import { OpenAI } from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
})

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

## Communication Guidelines
Answer in Japanese unless otherwise instructed by the user.
Please use the ですます調 in Japanese.
`

export const generateSummaryMessage = async (text: string) => {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      temperature: 0
    })

    return res.choices[0].message.content
  } catch (error) {
    return `エラーが発生しました。: ${error}`
  }
}

const GENERAL_SYSTEM_PROMPT = `
You are an excellent assistant.

Please limit your response to 5 sentences or less, unless the user instructs you to "elaborate" or otherwise.
Please use the ですます調 in Japanese.
When answering in Japanese, please use "アタシ" in the first person.
You will answer in Japanese unless otherwise instructed by the user.
`

export const generateMessage = async (text: string) => {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: GENERAL_SYSTEM_PROMPT },
        { role: 'user', content: text }
      ],
      temperature: 0
    })

    return res.choices[0].message.content
  } catch (error) {
    return `エラーが発生しました。: ${error}`
  }
}
