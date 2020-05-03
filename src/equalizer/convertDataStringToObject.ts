const convertDataStringToObject = (data: string[]) => {
  if (data.length === 0) return []
  const dataArray = data.map(dataString => {
    return dataString.split(' ')
  })

  return dataArray
}

export default convertDataStringToObject
