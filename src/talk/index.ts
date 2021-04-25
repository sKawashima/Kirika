import * as dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

export const getTalkResponce = async (message: string) => {
  const params = new URLSearchParams()
  params.append('apikey', process.env.TALK_API_KEY)
  params.append('query', message)
  return await axios
    .post('https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk', params)
    .then(res => {
      if (res.data.message === 'empty reply') return ''
      return res.data.results[0].reply
    })
    .catch(e => {
      console.log(e)
      return 'error'
    })
}
