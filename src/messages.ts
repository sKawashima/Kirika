import app from './initBolt'

const initMessages = () => {
  app.message('デス', async ({ message, say }) => {
    say(':de-su:')
  })
}

export default initMessages
