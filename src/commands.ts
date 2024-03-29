import app from './initBolt'
import { getChannelsList } from './functions'
import equalizer, { preEqualizer } from './equalizer'

const initCommands = () => {
  app.command('/kirika-say', async ({ ack, command, say, context }) => {
    await ack()
    await app.client.conversations.join({
      token: context.botToken,
      channel: command.channel_id
    })
    await say(`${command.text}:de-su:`)
  })

  app.command(
    '/kirika-channel-list',
    async ({ ack, command, context, say }) => {
      await ack()
      await app.client.conversations.join({
        token: context.botToken,
        channel: command.channel_id
      })
      const channelsListText = await getChannelsList({
        token: context.botToken
      })
      await say(channelsListText)
    }
  )

  app.command('/kirika-mahjong', async ({ ack, command, context }) => {
    await ack()

    const userId = command.user_id
    try {
      const notificationMessage = `@here ${
        command.text !== '' ? `${command.text}:de-su:` : ''
      }\n\n*from:* <@${userId}>\nhttps://gyazo.com/cbdba92f976bd79da6c7accc51891b69`
      await app.client.chat.postMessage({
        token: context.botToken,
        channel: '帝国麻雀部',
        text: notificationMessage,
        link_names: true
      })

      const urlMessage = `:one: https://tenhou.net/0/?L4545\n:two: https://tenhou.net/0/?L1919\n:three: https://tenhou.net/0/?L${`0000${Math.round(
        Math.random() * 10000
      )}`.slice(-4)}`
      await app.client.chat.postMessage({
        token: context.botToken,
        channel: '帝国麻雀部',
        text: urlMessage,
        link_names: true
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.command('/equalizer', async ({ ack, command, say }) => {
    await ack()
    const userId = command.user_id
    const message = await equalizer()
    await say(`${message}\n\n*from:* <@${userId}>`)
  })

  app.command('/preequalizer', async ({ ack, command, say }) => {
    await ack()
    const userId = command.user_id
    const message = await preEqualizer()
    await say(`${message}\n\n*from:* <@${userId}>`)
  })
}

export default initCommands
