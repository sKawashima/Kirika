const dataToBurden = (data: any[]) =>
  data.map(data => data.amount).reduce((acc, current) => acc + current)
export default dataToBurden
