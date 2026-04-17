import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import PriceGraph from '../Components/PriceGraph'
import iconMap from '../assets/map.json'
import { useFetchData } from '../contexts/Data'
import { useCommodityStats } from '../contexts/commodityUtils'
import PredictionTable from '../Components/PredictionTable'
import MarketInsights from '../Components/MarketInsights'

function CommodityInfo() {

  const { commodityId } = useParams()
  const commodityName = decodeURIComponent(commodityId)

  const [selectedDays, setSelectedDays] = useState(7)

  const { data, dataLoading } = useFetchData()


  const stats = useCommodityStats(commodityName, selectedDays)

  const iconName = iconMap[commodityName?.trim()] || "default"

  // format change value (+/-)
  const changeValue = stats
    ? `${stats.change > 0 ? "+" : ""}${stats.changePercent}%`
    : "0%"

  const Card = ({ title, value, green, red }) => {
    return (
      <div
        className="
          p-5 rounded-2xl border
          bg-white text-black border-gray-200
          dark:bg-[#111827] dark:text-white dark:border-white/10
        "
      >
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {title}
        </p>

        <h2
          className={`
            text-2xl font-bold mt-2
            ${green ? "text-green-500 dark:text-green-400" : ""}
            ${red ? "text-red-500 dark:text-red-400" : ""}
            ${!green && !red ? "text-gray-900 dark:text-white" : ""}
          `}
        >
          {value}
        </h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0b0e14] dark:text-white p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-4">
          <img
            src={`/icons/${iconName}.png`}
            alt={commodityName}
            className="w-12 h-12 object-contain"
          />

          <div>
            <h1 className="text-3xl md:text-4xl font-black">
              {commodityName}
            </h1>
          </div>
        </div>

      </div>

      {/* LOADING */}
      {dataLoading ? (
        <div className="text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      ) : (
        <>
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <Card
              title="Current Price"
              value={`₹${stats?.currentPrice
                ? stats.currentPrice.toFixed(2)
                : 0
                }`}
            />

            <Card
              title="24H Change"
              value={changeValue}
              green={stats?.change > 0}
              red={stats?.change < 0}
            />

            <Card
              title="Predicted Price"
              value={
                stats?.predict?.predicted_price
                  ? `₹${stats.predict.predicted_price.toFixed(2)}`
                  : "-"
              }
            />

            <Card
              title="Volatility"
              value={
                stats?.volatility !== null
                  ? `${stats.volatility}%`
                  : "-"
              }
            />

          </div>

          {/* MAIN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* GRAPH */}
            <div className="lg:col-span-2 space-y-6">

              <PriceGraph
                commodityName={commodityName}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
              />

              <PredictionTable
                predictions={stats?.rawPredictions}
                currentPrice={stats?.currentPrice}
              />

            </div>

            {/* MARKET INSIGHTS */}
            <div className="w-full">
              <MarketInsights
                stats={stats}
                changeValue={changeValue}
                selectedDays={selectedDays}
              />
            </div>

          </div>
        </>
      )}
    </div>
  )
}

export default CommodityInfo