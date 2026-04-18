import { useFetchData } from "../contexts/Data";
import { useMemo } from "react";
import { filterData, sortData, processData } from '../utils'

export const useCommodityStats = (commodityType, commodityName, selectedDays = 7) => {
  const { data: allData } = useFetchData()
  const data = allData[commodityType]

  const stats = useMemo(() => {

    const rawHistorical = (data?.historical || [])
      .filter(item => item.commodity.trim() === commodityName.trim())
      .map(item => ({ ...item, dateObj: new Date(item.date) }))
      .sort((a, b) => a.dateObj - b.dateObj)
      .slice(-selectedDays)

    // just uncomment below code
    // const rawPredictions = processData({
    //   data: data?.predictions || [],
    //   filters: { commodity: commodityName.trim() },
    //   sortBy: 'date',
    //   order: 1
    // })

    const rawPredictions = (data?.predictions || [])
      .filter(item => item.commodity.trim() === commodityName.trim())
      .map(item => ({ ...item, dateObj: new Date(item.date) }))
      .sort((a, b) => a.dateObj - b.dateObj)


    if (rawHistorical.length === 0) {
      return {
        currentPrice: 0,
        prevPrice: 0,
        change: 0,
        changePercent: 0,
        predict: null,
        volatility: null,
        rawPredictions: []
      }
    }


    const prices = rawHistorical.map(item => item.avg_price)
    const highestPrice = Math.max(...prices)
    const lowestPrice = Math.min(...prices)

    // ===== CURRENT & PREVIOUS =====
    const latest = rawHistorical[rawHistorical.length - 1]
    // const previous = rawHistorical[rawHistorical.length - 2]
    // safety if selected days=1
    const previous = rawHistorical.length > 1 ? rawHistorical[rawHistorical.length - 2] : null;

    const currentPrice = latest?.avg_price || 0
    const prevPrice = previous?.avg_price || 0


    const change = currentPrice - prevPrice
    const changePercent = prevPrice
      ? ((change / prevPrice) * 100).toFixed(2)
      : 0

    // ===== PREDICTION (NEXT DAY) =====
    const predict = rawPredictions.length > 0
      ? rawPredictions[0]   // next immediate day
      : null

    // ===== VOLATILITY =====

    let volatility = null
    let mean = 0

    if (prices.length > 1) {
      mean =
        prices.reduce((sum, p) => sum + p, 0) / prices.length

      const variance =
        prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / (prices.length - 1)

      const stdDev = Math.sqrt(variance)

      volatility = mean
        ? ((stdDev / mean) * 100).toFixed(2)
        : 0
    }

    return {
      currentPrice,
      prevPrice,
      change,
      changePercent,
      predict,
      volatility,
      rawPredictions,
      mean,
      highestPrice,
      lowestPrice
    }
  }, [data, commodityName, selectedDays])

  return stats;
}