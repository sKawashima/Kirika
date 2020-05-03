import setupData from './setupData'
import dataToBurden from './dataToBurden'

const makeReimbursementData = async () => {
  const data = await setupData()
  const reimbursementPrice =
    (dataToBurden(data.sKData) - dataToBurden(data.ryuData)) / 2 +
    dataToBurden(data.sKFixedData)
}

makeReimbursementData()
