import { AppMentionEvent, Context, SayFn } from '@slack/bolt'
import { fetchTextFromUrls } from './fetchText'
import { generateSummaryMessage } from './generateMessage'
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
        text: 'エラー：ページを取得できませんでした',
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
      say({
        text: 'エラー：URLが見つかりませんでした',
        thread_ts
      })
      return
    }

    if (!replies.messages || replies.messages.length === 1) {
      return
    }

    const fetchedMarkdowns = await fetchTextFromUrls(urlInReplies)
    if (!fetchedMarkdowns) {
      say({
        text: 'エラー：ページを取得できませんでした',
        thread_ts
      })
      return
    }

    const message = await generateSummaryMessage(`
ArticleContents:
${fetchedMarkdowns}

---
Past Conversations:
${replies.messages.map(m => m.text).join('\n---\n')}
`)

    say({
      text: message,
      thread_ts
    })
  }
}
