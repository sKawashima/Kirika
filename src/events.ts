import app from './initBolt'
import { mentionResponse } from './mentionResponse'

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
    mentionResponse({ say, event, context, client })
  })
}

export default initEvents
