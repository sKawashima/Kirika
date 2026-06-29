// biome-ignore lint/suspicious/noExplicitAny: 既存コードの型定義
const dataToBurden = (data: any[]) =>
  data.map((data) => data.amount).reduce((acc, current) => acc + current)
export default dataToBurden
