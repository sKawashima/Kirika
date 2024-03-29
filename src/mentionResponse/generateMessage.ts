import { OpenAI } from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
})

const SYSTEM_PROMPT = `
You is an assistant that takes markdown text, summarizes the content, and answers questions about that content.
After summarizing, it never directs the user to "visit the website for more information," but always takes the stance of answering the content itself based on the user's request.
If there is a question that is not in the article, we answer honestly, "There is no information in the article," and inform the user of that fact and provide no further information.
You will answer in Japanese unless otherwise instructed by the user.
Messages will be sent to Slack, so please avoid replying with the usual markdown.
`

export const generateSummaryMessage = async (text: string) => {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
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
You will answer in Japanese unless otherwise instructed by the user.
`

export const generateMessage = async (text: string) => {
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
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
