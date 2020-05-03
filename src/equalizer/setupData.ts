import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'

import getDataFromGitHub from './getDataFromGitHub'
import convertDataStringToObject from './convertDataStringToObject'
import formatSpritingBillsData from './formatSpritingBillsData'
import formatNotEqualData from './formatNotEqualData'

const setupData = async () => {
  const octokit = new Octokit({
    auth: '85db0c09e289ab880736d310bd59a8200c2534d9'
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
