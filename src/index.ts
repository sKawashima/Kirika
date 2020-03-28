import app from './initBolt'
;(async () => {
  await app.start(process.env.PORT || 3000)
  console.log('⚡️ Bolt app is running')
})()

app.command('/say-kirika', async ({ command, ack, say }) => {
  ack()

  say(`${command.text}:desu:`)
})

app.event('app_home_opened', async ({ event, say }) => {
  say(':de-su:')
})

app.event('channel_created', async ({event, context}) => {
  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      channel: 'general',
      text: `新チャンネルが作られた:de-su::eyes:\n#${event.channel.name}`,
      link_names: true
    })
  } catch (err) {
    console.log(err)
  }
})

app.message('デス', async ({ message, say }) => {
  say(':de-su:')
})
