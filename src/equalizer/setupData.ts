import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import * as dotenv from 'dotenv'

import getDataFromGitHub from './getDataFromGitHub'
import convertDataStringToObject from './convertDataStringToObject'
import formatSpritingBillsData from './formatSpritingBillsData'
import formatNotEqualData from './formatNotEqualData'

const setupData = async () => {
  dotenv.config()

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  })
  const now = new Date()
  const year = `${now.getFullYear()}`
  const month = `0${now.getMonth() + 1}`.slice(-2)
  const yearMonth = `${year}/${month}`

  const notEqualStringData = await getDataFromGitHub(
    `${yearMonth}/not-equal(sK ryu-g).txt`,
    octokit
  )
  const sKStringData = await getDataFromGitHub(`${yearMonth}/sK.txt`, octokit)
  const ryuStringData = await getDataFromGitHub(
    `${yearMonth}/ryu_g.txt`,
    octokit
  )

  const notEqualData = formatNotEqualData(
    convertDataStringToObject(notEqualStringData)
  )
  const sKData = formatSpritingBillsData(
    convertDataStringToObject(sKStringData)
  )
  const ryuData = formatSpritingBillsData(
    convertDataStringToObject(ryuStringData)
  )

  return {
    notEqualData: notEqualData,
    sKData: sKData,
    ryuData: ryuData
  }
}

export default setupData
