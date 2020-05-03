import setupData from './setupData'
import dataToBurden from './dataToBurden'
import dataToTextTable from './dataToTextTable'

const equalizer = async () => {
  const data = await setupData()
  const reimbursementPrice =
    (dataToBurden(data.sKData) - dataToBurden(data.ryuData)) / 2 +
    dataToBurden(data.sKFixedData)

  const message = `現在入力されているデータでの精算情報:de-su:
データ置き場
https://github.com/skryu-studio/equalizer

ryu_g → sK 固定費
${dataToTextTable(data.sKFixedData)}
合計: ${dataToBurden(data.sKFixedData)} 円

sK負担分
${dataToTextTable(data.sKData)}
合計: ${dataToBurden(data.sKData)} 円

ryu_g負担分
${dataToTextTable(data.ryuData)}
合計: ${dataToBurden(data.ryuData)} 円

ryu_g → sK 精算額
${(dataToBurden(data.sKData) - dataToBurden(data.ryuData)) / 2 +
  dataToBurden(data.sKFixedData)} 円
`
  return message
}

export default equalizer
