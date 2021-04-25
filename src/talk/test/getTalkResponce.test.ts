import { getTalkResponce } from '../'

const test = async () => {
  console.log(await getTalkResponce('こんにちは'))
  console.log(await getTalkResponce('なまこおいしい？'))
  console.log(await getTalkResponce('めう…'))
  console.log(await getTalkResponce(' 最初に空白入っても良い？'))
}

test()
