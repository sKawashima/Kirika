import app from './initBolt'
import { lgtmList } from './imageList'
import { getRandomKantoStation } from './randomStation'
import { diceroll } from './functions'

const initMessages = () => {
  app.message(
    /(でーす|デス|デース|desu|de-su|:dededede-su:)/,
    async ({ say }) => {
      const messages = [
        ':de-su:',
        ':de-su:',
        ':de-su:',
        ':de-su:',
        ':de-su:',
        ':desu:',
        ':desu::desu::de-su:',
        ':dededede-su:',
        'https://lohas.nicoseiga.jp/thumb/5661682i',
        'https://pbs.twimg.com/media/Dal0dcJV4AEaY0p.jpg'
      ]
      await say(messages[Math.floor(Math.random() * messages.length)])
    }
  )

  app.message(/(LGTM|lgtm)/, async ({ say }) => {
    const lgtmImageURL = lgtmList[Math.floor(Math.random() * lgtmList.length)]
    await say(lgtmImageURL)
  })

  app.message(/(疲れた|つかれた|しごおわ|退勤|退社)/, async ({ say }) => {
    const messages = [
      'おつかれさま:desu::+1:',
      'おつかれさま:desu::+1:',
      'おつかれさま:desu::+1:',
      'おつかれさま:desu::+1:',
      'おつかれさま:de-su::clap::tada:'
    ]
    await say(messages[Math.floor(Math.random() * messages.length)])
  })

  app.message(/(てま|tema)/, async ({ message, context }) => {
    try {
      await app.client.reactions.add({
        token: context.botToken,
        name: 'tema',
        channel: message.channel,
        timestamp: message.ts
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.message(/(二度手間|db5ce7cab50b.png)/, async ({ message, context }) => {
    try {
      await app.client.reactions.add({
        token: context.botToken,
        name: 'nidodema',
        channel: message.channel,
        timestamp: message.ts
      })
    } catch (err) {
      console.log(err)
    }
  })

  app.message(/(関東駅ガチャ|kantoekigacha)/, async ({ say }) => {
    const randomKantoStation = await getRandomKantoStation()
    await say(
      `${randomKantoStation}:de-su:\nhttps://www.google.co.jp/maps/search/${randomKantoStation}駅`
    )
  })
  app.message(/^\d+d\d+/, async ({ say, message }) => {
    // @ts-ignore
    const result = await diceroll(message.text)
    await say(result)
  })
}

export default initMessages
