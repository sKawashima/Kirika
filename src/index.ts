import app from './initBolt'

(async () => {
  await app.start(process.env.PORT || 3000)
  console.log('⚡️ Bolt app is running')
})()

app.event("app_home_opened", async ({ event, say }) => {
  say("ﾃﾞｰｽ!");
});

app.message("デス", async ({ message, say }) => {
  say("デース！");
});

app.command("/say", async ({ command, ack, say }) => {
  ack();

  say(`${command.text}`);
});
