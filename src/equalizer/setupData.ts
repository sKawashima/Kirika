import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import * as dotenv from 'dotenv'

import getDataFromGitHub from './getDataFromGitHub'
import formatSpritingBillsData from './formatSpritingBillsData'

const setupData = async (yearMonth: string) => {
  dotenv.config()

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  })

  const sKFixedStringData = await getDataFromGitHub(
    `${yearMonth}/sK_fixed.txt`,
    octokit
  )
  const sKStringData = await getDataFromGitHub(`${yearMonth}/sK.txt`, octokit)
  const ryuStringData = await getDataFromGitHub(
    `${yearMonth}/ryu_g.txt`,
    octokit
  )

  const sKFixedData = formatSpritingBillsData(sKFixedStringData)
  const sKData = formatSpritingBillsData(sKStringData)
  const ryuData = formatSpritingBillsData(ryuStringData)

  return {
    sKFixedData: sKFixedData,
    sKData: sKData,
    ryuData: ryuData
  }
}

export default setupData
