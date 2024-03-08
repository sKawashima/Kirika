export const getUrl = (text: string) => {
  const urlPattern = /<(https?:\/\/[^\s]+)>/g
  const matches = text.match(urlPattern) || []
  return matches.map((url: string) => url.slice(1, -1))
}
