# Kirila

Community "Hama Empire" Slack BOT

## Setup

Add env file

```env
SLACK_BOT_TOKEN # from OAuth & Permissions
SLACK_SIGNING_SECRET # from  Basic Information
```

```bash
# Install dependencies
npm i

# Run the bot
npm run dev
```

## Usage

- connect to slack
  - ngrok http 3000
  - Replace: Slack API Event Subscriptions -> Request URL (add `/slack/events`)
