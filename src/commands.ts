import app from './initBolt'
import { getChannelsList } from './functions'
import equalizer from './equalizer'

const initCommands = () => {
  app.command('/kirika-say', async ({ ack, command, say }) => {
    ack()
    say(`${command.text}:de-su:`)
  })

  app.command('/kirika-channel-list', async ({ ack, context, say }) => {
    ack()
    const channelsListText = await getChannelsList({
      token: context.botToken
    })
    say(channelsListText)
  })

  app.command('/kirika-mahjong', async ({ ack, command, context }) => {
    ack()
    const userName = command.user_name
    try {
      const postMessageResponce = await app.client.chat.postMessage({
        token: context.botToken,
        channel: '帝国麻雀部',
        text: `@here ${
          command.text !== '' ? `${command.text}:de-su:` : ''
        }\n\n*from:* @${userName}\nhttps://hama-empire.slack.com/files/UECKGJR0B/F011XMYCK6C/pic-mj1.png`,
        link_names: true
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.command('/equalizer', async ({ ack, command, say }) => {
    ack()
    const userName = command.user_name
    const message = await equalizer()
    say(`${message}\n\n*from:* @${userName}`)
  })
}

export default initCommands
