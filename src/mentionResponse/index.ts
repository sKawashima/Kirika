import { AppMentionEvent, Context, SayFn } from '@slack/bolt'
import { fetchTextFromUrls } from './fetchText'
import { generateMessage, generateSummaryMessage } from './generateMessage'
import { getUrl } from './getUrl'
import { StringIndexed } from '@slack/bolt/dist/types/helpers'
import { WebClient } from '@slack/web-api'

export const mentionResponse = async ({
  say,
  event,
  context,
  client
}: {
  say: SayFn
  event: AppMentionEvent
  context: Context & StringIndexed
  client: WebClient
}) => {
  const thread_ts = event.thread_ts || event.ts

  const urls = getUrl(event.text)

  if (urls.length > 0) {
    const fetchedMarkdowns = await fetchTextFromUrls(urls)
    if (!fetchedMarkdowns) {
      say({
        text: 'エラー：URLのサーバーに弾かれたためページを取得できませんでした',
        thread_ts
      })
      return
    }

    const message = await generateSummaryMessage(fetchedMarkdowns)

    say({
      text: message,
      thread_ts
    })
  } else {
    const replies = await client.conversations.replies({
      token: context.botToken,
      channel: event.channel,
      ts: thread_ts
    })

    const urlInReplies = Array.from(
      new Set(
        replies.messages
          .map(m => getUrl(m.text))
          .flat()
          .filter(u => u)
      )
    )

    if (urlInReplies.length === 0) {
      const message = await generateMessage(
        replies.messages
          .map(m => `${m.display_as_bot ? 'bot' : 'user'}: ${m.text}`)
          .join('\n---\n')
      )
      const desuReplacement = () => Math.random() < 0.8 ? ' :desu: ' : ':de-su: ';
      const modifiedMessage = `${message.replace(/です/g, desuReplacement)}`;
      say({ text: modifiedMessage.endsWith('。') ? text.slice(0, -1) + desuReplacement() : text + desuReplacement(), thread_ts });
      return
    }

    const fetchedMarkdowns = await fetchTextFromUrls(urlInReplies)
    if (!fetchedMarkdowns) {
      say({
        text: 'エラー：URLのサーバーに弾かれたためページを取得できませんでした',
        thread_ts
      })
      return
    }

    const message = await generateSummaryMessage(`
ArticleContents:
${fetchedMarkdowns}

---
Past Conversations:
${replies.messages
  .map(m => `${m.display_as_bot ? 'bot' : 'user'}: ${m.text}`)
  .join('\n---\n')}
`)

    say({
      text: message,
      thread_ts
    })
  }
}
