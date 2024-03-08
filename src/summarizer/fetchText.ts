import axios from 'axios'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'

const turndownService = new TurndownService()
turndownService.addRule('ignoreScriptStyleSvg', {
  filter: function (node) {
    return (
      node.nodeName === 'SCRIPT' ||
      node.nodeName === 'STYLE' ||
      node.nodeName === 'SVG' ||
      node.nodeName === 'IMG' ||
      node.nodeName === 'IFRAME' ||
      node.nodeName === 'VIDEO' ||
      node.nodeName === 'AUDIO' ||
      node.nodeName === 'CANVAS' ||
      node.nodeName === 'EMBED' ||
      node.nodeName === 'OBJECT' ||
      node.nodeName === 'INPUT' ||
      node.nodeName === 'TEXTAREA' ||
      node.nodeName === 'SELECT' ||
      node.nodeName === 'OPTION' ||
      node.nodeName === 'BUTTON' ||
      node.nodeName === 'HEADER' ||
      node.nodeName === 'FOOTER' ||
      node.nodeName === 'NAV' ||
      node.textContent === ''
    )
  },
  replacement: function () {
    return '' // 空文字を返して、これらの要素をマークダウン出力から除去
  }
})

export const fetchText = async (url: string) => {
  try {
    const { data: html } = await axios.get(url)
    const markdown = parseHTMLToMarkdown(html)

    return markdown
  } catch (error) {
    console.error('エラーが発生しました:', error)
    return null
  }
}

const parseHTMLToMarkdown = (html: string) => {
  const dom = new JSDOM(html)
  const { document } = dom.window

  const styles = document.querySelectorAll('style')
  styles.forEach(style => style.remove())

  const scripts = document.querySelectorAll('script')
  scripts.forEach(script => script.remove())

  const bodyHtml = document.querySelector('body').innerHTML

  const markdown = turndownService.turndown(bodyHtml)

  return markdown
}
