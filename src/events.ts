import app from './initBolt'
import { getTalkResponce } from './talk'

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

  app.event('app_mention', async ({ say, event, context }) => {
    const reply = await getTalkResponce(
      event.text.replace(`<@${context.botUserId}>`, '')
    )
    await say(
      `${reply.replace(/(です|ですよ|ですよね)$/u, '')}:de-su:`.replace(
        /(ですか?:de-su:)$/u,
        ':desu:か?:'
      )
    )
  })
}

export default initEvents
