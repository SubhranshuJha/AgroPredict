import React from 'react'

function MarketInsights({ stats, changeValue, selectedDays }) {

    const Insight = ({ label, value, green, red }) => {
        return (
            <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">
                    {label}
                </span>

                <span
                    className={`
                        font-semibold
                        ${green ? "text-green-500 dark:text-green-400" : ""}
                        ${red ? "text-red-500 dark:text-red-400" : ""}
                        ${!green && !red ? "text-gray-800 dark:text-gray-200" : ""}
                    `}
                >
                    {value}
                </span>
            </div>
        )
    }
    
    return (
        <div className="w-full">

            <div
                className="
                    p-5 rounded-2xl border
                    bg-white text-black border-gray-200
                    dark:bg-[#111827] dark:text-white dark:border-white/10
                "
            >
                {/* HEADER */}
                <h3 className="text-lg font-semibold mb-4">
                    Market Insights
                </h3>

                {/* CONTENT */}
                <div className="space-y-4 text-sm">

                    <Insight
                        label="Current Price"
                        value={`₹${stats?.currentPrice
                                ? stats.currentPrice.toFixed(2)
                                : 0
                            }`}
                    />

                    <Insight
                        label="24H Change"
                        value={changeValue}
                        green={stats?.change > 0}
                        red={stats?.change < 0}
                    />

                    <Insight
                        label="Predicted Price"
                        value={
                            stats?.predict?.predicted_price
                                ? `₹${stats.predict.predicted_price.toFixed(2)}`
                                : "-"
                        }
                    />

                    <Insight
                        label={`${selectedDays} Days Average`}
                        value={
                            stats?.mean !== undefined
                                ? `₹${stats.mean.toFixed(2)}`
                                : "-"
                        }
                    />
                    <Insight
                        label="Highest Price"
                        value={`₹${stats?.highestPrice?.toFixed(2)}`}
                    />
                    <Insight
                        label="Lowest Price"
                        value={`₹${stats?.lowestPrice?.toFixed(2)}`}
                    />
                    {/* PRICE RANGE BAR */}
                    {/* PRICE RANGE BAR */}
<div className="pt-4">

  {stats?.lowestPrice !== undefined &&
   stats?.highestPrice !== undefined &&
   stats?.currentPrice !== undefined && (() => {

    const min = stats.lowestPrice
    const max = stats.highestPrice
    const current = stats.currentPrice

    const percentage = max !== min
      ? ((current - min) / (max - min)) * 100
      : 0

    return (
      <div className="space-y-2">

        {/* LABELS */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>₹{min.toFixed(2)}</span>
          <span>₹{max.toFixed(2)}</span>
        </div>

        {/* BAR BACKGROUND */}
        <div className="relative w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full">

          {/* FILLED PART ONLY */}
          <div
            className="h-2 rounded-full bg-linear-to-r from-red-400 via-yellow-400 to-green-400"
            style={{ width: `${percentage}%` }}
          />

          

        </div>

        {/* CURRENT PRICE */}
        <div className="text-xs text-center text-gray-600 dark:text-gray-300">
          Current: ₹{current.toFixed(2)}
        </div>

      </div>
    )
  })()}

</div>

                </div>
            </div>

        </div>
    )
}

export default MarketInsights