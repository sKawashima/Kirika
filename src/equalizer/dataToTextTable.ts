import textTable from 'text-table'

const dataToTextTable = (data: any[]) => {
  if (data.length === 0) return
  const table = textTable(
    data.filter(data => data.text !== '').map(data => [data.text, data.amount])
  )
  if (table === '') return '<no data>'
  else return table
}

export default dataToTextTable
