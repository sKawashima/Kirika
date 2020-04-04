import app from "./initBolt";

const initEvents = () => {

  app.event("channel_created", async ({ event, context }) => {
    try {
      const postMessageResponce = await app.client.chat.postMessage({
        token: context.botToken,
        channel: "general",
        text: `新しいチャンネル :de-su: :eyes:\n#${event.channel.name}`,
        link_names: true
      });
    } catch (err) {
      console.log(err);
    }
  });

}

export default initEvents
