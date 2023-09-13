const getDataFromGitHub = async (path: string, octokit) => {
  const buffer = await octokit.repos.getContent({
    owner: 'skryu-studio',
    repo: 'equalizer',
    ref: 'heads/master',
    path: path
  })

  if (Array.isArray(buffer.data)) return

  return Buffer.from(buffer.data.content, 'base64')
    .toString()
    .split('\n')
}

export default getDataFromGitHub
