const formatSpritingBillsData = (data: string[][]) => {
  return data.map(value => {
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
