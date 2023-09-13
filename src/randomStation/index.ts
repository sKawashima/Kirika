import { kantoStations } from './kantoStations'

export const getRandomKantoStation = async () => {
  return kantoStations[Math.round(Math.random() * kantoStations.length)]
}
