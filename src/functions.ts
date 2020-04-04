
import app from "./initBolt";

export const getChannelsList = async ({ token }) => {
  try {
    const getChannelsListResponce = await app.client.channels.list({
      token: token
    });

    getChannelsListResponce.channels.sort((a, b) => {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    });

    let channelsListText = "";
    getChannelsListResponce.channels.forEach(channel => {
      if (!channel.is_archived)
        channelsListText += `<#${channel.id}|${channel.name}> ${channel.topic.value} (${channel.members.length} members)\n`;
    });

    return `チャンネル一覧 :de-su:\n\n${channelsListText}`;
  } catch (err) {
    return err;
  }
};
