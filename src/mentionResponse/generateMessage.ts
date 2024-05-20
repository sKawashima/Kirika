import { OpenAI } from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
})

const SYSTEM_PROMPT = `
You are an assistant that takes markdown text, summarizes the content, and answers questions about that content.

If the user only gives you a URL, please give a summary of the contents.
When summarizing, please follow the format below:
"""
ざっくりまとめ:de-su:
<short three-sentence summary>

SUMMARY
<detailed summary>
"""

If the user asks a question, please answer it based on ArticleContents.
If there is a question that is not in the article, please answer, "There is no information in the article," and provide no further information.

Answer in Japanese unless otherwise instructed by the user.
Answer in plain text, without markdown notation.
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
