import app from './initBolt'

const getUrl = (text: string) => {
  const urlPattern = /<(https?:\/\/[^\s]+)>/g
  const urls = text.match(urlPattern) || []
  return urls
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
      say({
        text: `見つかったURL: ${urls.join(', ')}`,
        thread_ts
      })
    } else {
      const replies = await client.conversations.replies({
        token: context.botToken,
        channel: event.channel,
        ts: thread_ts
      })

      const urlInReplies = replies.messages
        .map(m => getUrl(m.text))
        .flat()
        .filter(u => u)

      if (!replies.messages || replies.messages.length === 1) {
        return
      }

      console.log(replies.messages.map(m => m.text).join('\n---\n'))
      console.log(urlInReplies)

      say({
        text: 'URLは見つかりませんでした',
        thread_ts
      })
    }
  })
}

export default initEvents
