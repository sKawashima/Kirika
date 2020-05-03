const formatSpritingBillsData = (data: string[]) => {
  if (data.length === 0) return []

  return data
    .map(dataString => {
      return dataString.split(' ')
    })
    .map(value => {
      const text = value.reduce((acc, str, i) => {
        if (i === 1) return `${str}`
        else return `${acc}${str}`
      })
      return {
        amount: Number(value[0]),
        text: text
      }
    })
}

export default formatSpritingBillsData
