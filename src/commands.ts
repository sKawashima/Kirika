import app from "./initBolt";
import { getChannelsList } from "./functions";

const initCommands = () => {

  app.command("/kirika-say", async ({ command, ack, say }) => {
    ack();
    say(`${command.text}:desu:`);
  });

  app.command("/kirika-channel-list", async ({ command, ack, say, context }) => {
      ack();
      const channelsListText = await getChannelsList({
        token: context.botToken
      });
      say(channelsListText);
    }
  );

}

export default initCommands
