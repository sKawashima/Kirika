import app from './initBolt'

export const getChannelsList = async ({ token }) => {
  try {
    const getChannelsListResponce: any = await app.client.conversations.list({
      token: token
    })

    getChannelsListResponce.channels.sort((a, b) => {
      if (a.name < b.name) return -1
      else if (a.name > b.name) return 1
      else return 0
    })

    let channelsListText = ''
    getChannelsListResponce.channels.forEach(channel => {
      if (!channel.is_archived)
        channelsListText += `<#${channel.id}|${channel.name}> ${channel.purpose.value}\n`
    })

    return `チャンネル一覧 :de-su:\n\n${channelsListText}`
  } catch (err) {
    return err
  }
}

export const diceroll = (command: string) => {
  const numbers = command.match(/(\d+)d(\d+)/)
  const diceResult = [...Array(Number(numbers[1]))].map(() =>
    Math.floor(Math.random() * Number(numbers[2]) + 1)
  )
  const message = `${numbers[0]}:de-su

${diceResult.map(number => `${number}`).reduce((pre, crr) => `${pre}\n${crr}`)}
合計: ${diceResult.reduce((pre, cur) => pre + cur)}
  `
  return message
}
