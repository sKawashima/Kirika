import app from './initBolt'
import { lgtmList } from './imageList'

const initMessages = () => {
  app.message('デス', async ({ say }) => {
    say(':de-su:')
  })

  app.message(/(LGTM|lgtm)/, async ({ say }) => {
    const lgtmImageURL = lgtmList[Math.floor(Math.random() * lgtmList.length)]
    say(lgtmImageURL)
  })
}

export default initMessages
