const formatNotEqualData = (data: string[][]) => {
  return data.map(value => {
    const text = value.reduce((acc, str, i) => {
      if (i === 1) return ``
      else return `${acc}${str}`
    })
    return {
      sKAmount: Number(value[0]),
      ryuAmount: Number(value[1]),
      text: text
    }
  })
}

export default formatNotEqualData
