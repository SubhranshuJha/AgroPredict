export const getCommodityStats = (data, commodityName, selectedDays = 7) => {

  const rawHistorical = (data?.historical || [])
    .filter(item => item.commodity.trim() === commodityName.trim())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-selectedDays) 

  const rawPredictions = (data?.predictions || [])
    .filter(item => item.commodity.trim() === commodityName.trim())
    .sort((a, b) => new Date(a.date) - new Date(b.date))

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

  const hightestPrice = [...rawHistorical].sort((a,b) => b.avg_price - a.avg_price)[0].avg_price
  const lowestPrice = [...rawHistorical].sort((a,b) => b.avg_price - a.avg_price)[rawHistorical.length - 1].avg_price



  // ===== CURRENT & PREVIOUS =====
  const latest = rawHistorical[rawHistorical.length - 1]
  const previous = rawHistorical[rawHistorical.length - 2]

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
  const prices = rawHistorical.map(item => item.avg_price)

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
    hightestPrice,
    lowestPrice
  }
}