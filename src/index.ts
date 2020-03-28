import app from './initBolt'
;(async () => {
  await app.start(process.env.PORT || 3000)
  console.log('⚡️ Bolt app is running')
})()

app.command("/say-kirika", async ({ command, ack, say }) => {
  ack();

  say(`${command.text}:desu:`);
});


app.event('app_home_opened', async ({ event, say }) => {
  say(':de-su:')
})

app.event("channel_joined", async ({ event, say }) => {
  say("よろしく:de-su:！");
});

app.message('デス', async ({ message, say }) => {
  say(':de-su:')
})
