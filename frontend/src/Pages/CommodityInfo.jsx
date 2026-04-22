import { useState } from 'react'
import { useParams } from 'react-router-dom'
import iconMap from '../assets/map.json'
import { useFetchData } from '../contexts/data/useFetchData'
import { useCommodityStats } from '../hooks/commodityUtils'
import { PriceGraph, PredictionTable, MarketInsights, BackBtn } from '../Components'
function CommodityInfo() {

  const { commodity_Type, commodityId } = useParams()
  const commodityType = commodity_Type ? decodeURIComponent(commodity_Type) : "";
  const commodityName = commodityId ? decodeURIComponent(commodityId) : ""

  const [selectedDays, setSelectedDays] = useState(7)

  const { dataLoading } = useFetchData()

  const stats = useCommodityStats(commodityType, commodityName, selectedDays)

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
          bg-white text-gray-800 border-[#d6d3cd]
          dark:bg-[#111827] dark:text-white dark:border-white/10
          shadow-sm hover:shadow-md transition
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
    <div className="min-h-screen bg-[#f1f1f0] dark:bg-black py-8">
      <BackBtn />
      <div className="max-w-[90vw] mx-auto px-6 md:px-10 
                    bg-[#f8f7f4] dark:bg-[#0f172a] 
                      rounded-3xl shadow-md border border-[#d6d3cd] dark:border-white/10 
                      p-6 md:p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* GRAPH */}
              <div className="lg:col-span-2 space-y-8">

                <PriceGraph
                  commodityType={commodityType}
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


    </div>
  )
}

export default CommodityInfo