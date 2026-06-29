import textTable from 'text-table'

// biome-ignore lint/suspicious/noExplicitAny: 既存コードの型定義
const dataToTextTable = (data: any[]) => {
  if (data.length === 0) return
  const table = textTable(
    data
      .filter((data) => data.text !== '')
      .map((data) => [data.text, data.amount]),
  )
  if (table === '') return '<no data>'
  else return table
}

export default dataToTextTable
