import app from './initBolt'
import initCommands from "./commands"
import initEvents from './events'
import initMessages from './messages'

;(async () => {
  await app.start(process.env.PORT || 3000)
  console.log('⚡️ Bolt app is running')
})()

initCommands()
initEvents()
initMessages()
