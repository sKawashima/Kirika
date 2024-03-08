import axios from 'axios'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'

export const fetchText = async (url: string) => {
  try {
    const { data: html } = await axios.get(url)
    // JSDOMでHTMLを解析
    const dom = new JSDOM(html)
    const { document } = dom.window
    const bodyHtml = document.querySelector('body').innerHTML

    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(bodyHtml)

    return markdown
  } catch (error) {
    console.error('エラーが発生しました:', error)
    return null
  }
}
