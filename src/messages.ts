import app from './initBolt'
import { lgtmList } from './imageList'

const initMessages = () => {
  app.message(/(でーす|デス|デース|desu|de-su|:dededede-su:)/, ({ say }) => {
    const messages = [
      ':de-su:',
      ':de-su:',
      ':de-su:',
      ':de-su:',
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
    say(messages[Math.floor(Math.random() * messages.length)])
  })

  app.message(/(LGTM|lgtm)/, async ({ say }) => {
    const lgtmImageURL = lgtmList[Math.floor(Math.random() * lgtmList.length)]
    say(lgtmImageURL)
  })

  app.message(/(疲れた|つかれた|しごおわ|おわり|終わり|終わった|おわった)/, ({say}) => {
    const messages = [
      'おつかれさま:desu:',
      'おつかれさま:de-su:',
      ':+1:'
    ]
    say(messages[Math.floor(Math.random() * messages.length)])
  })
}

export default initMessages
