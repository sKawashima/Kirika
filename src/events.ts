import app from './initBolt'
import { fetchTextFromUrls } from './summarizer/fetchText'
import { generateMessage } from './summarizer/generateMessage'

const getUrl = (text: string) => {
  const urlPattern = /<(https?:\/\/[^\s]+)>/g
  const matches = text.match(urlPattern) || []
  return matches.map((url: string) => url.slice(1, -1))
}

const initEvents = () => {
  app.event('channel_created', async ({ event, context }) => {
    try {
      await app.client.chat.postMessage({
        token: context.botToken,
        channel: 'general',
        text: `新しいチャンネル :de-su: :eyes:\n#${event.channel.name}`,
        link_names: true
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.event('app_mention', async ({ say, event, context, client }) => {
    const thread_ts = event.thread_ts || event.ts

    const urls = getUrl(event.text)

    if (urls.length > 0) {
      const fetchedMarkdowns = await fetchTextFromUrls(urls)
      if (!fetchedMarkdowns) {
        say({
          text: 'エラー：ページを取得できませんでした',
          thread_ts
        })
        return
      }

      const message = await generateMessage(fetchedMarkdowns)

      say({
        text: message,
        thread_ts
      })
    } else {
      const replies = await client.conversations.replies({
        token: context.botToken,
        channel: event.channel,
        ts: thread_ts
      })

      const urlInReplies = Array.from(
        new Set(
          replies.messages
            .map(m => getUrl(m.text))
            .flat()
            .filter(u => u)
        )
      )

      if (urlInReplies.length === 0) {
        say({
          text: 'エラー：URLが見つかりませんでした',
          thread_ts
        })
        return
      }

      if (!replies.messages || replies.messages.length === 1) {
        return
      }

      const fetchedMarkdowns = await fetchTextFromUrls(urlInReplies)
      if (!fetchedMarkdowns) {
        say({
          text: 'エラー：ページを取得できませんでした',
          thread_ts
        })
        return
      }

      const message = await generateMessage(`
ArticleContents:
${fetchedMarkdowns}

---
Past Conversations:
${replies.messages.map(m => m.text).join('\n---\n')}
`)

      say({
        text: message,
        thread_ts
      })
    }
  })
}

export default initEvents
