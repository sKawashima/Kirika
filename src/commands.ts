import app from './initBolt'
import { getChannelsList } from './functions'

const initCommands = () => {
  app.command('/kirika-say', async ({ command, ack, say }) => {
    ack()
    say(`${command.text}:de-su:`)
  })

  app.command('/kirika-channel-list', async ({ ack, say, context }) => {
    ack()
    const channelsListText = await getChannelsList({
      token: context.botToken
    })
    say(channelsListText)
  })

  app.command('/kirika-mahjong', async ({ command, ack, context, say }) => {
    ack()

    try {
      const postMessageResponce = await app.client.chat.postMessage({
        token: context.botToken,
        channel: '帝国麻雀部',
        text: `@here ${command.text}:de-su:\nhttps://hama-empire.slack.com/files/UECKGJR0B/F011XMYCK6C/pic-mj1.png`,
        link_names: true
      })
    } catch (err) {
      console.log(err)
    }

    say(':desu:')
  })
}

export default initCommands
