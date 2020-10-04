import { kantoStations } from './kantoStations'

export const getRandomKantoStation = () => {
  return kantoStations[Math.round(Math.random() * kantoStations.length)]
}
