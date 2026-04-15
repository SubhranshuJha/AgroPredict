import React from 'react'

function PredictionTable({ predictions = [], currentPrice = '' }) {

  // prepare table data with change logic
  const tableData = predictions.map((item, index) => {
    const prev = predictions[index - 1]

    let change = null
    let changePercent = null

    if (prev) {
      change = item.predicted_price - prev.predicted_price
      changePercent = ((change / prev.predicted_price) * 100).toFixed(2)
    } 
    else if (currentPrice) {
      change = item.predicted_price - currentPrice
      changePercent = ((change / item.predicted_price) * 100).toFixed(2)
    }

    return {
      date: item.date,
      price: item.predicted_price,
      change,
      changePercent
    }
  })

  return (
    <div
      className="
        p-5 rounded-2xl border
        bg-white text-black border-gray-200
        dark:bg-[#111827] dark:text-white dark:border-white/10
      "
    >

      {/* HEADER */}
      <h3 className="text-lg font-semibold mb-4">
        7-Day Prediction
      </h3>

      {/* TABLE */}
      {tableData.length > 0 ? (
        <div className="overflow-x-auto">

          <table className="w-full text-sm text-left">

            {/* TABLE HEAD */}
            <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Price</th>
                <th className="py-2">Change</th>
                <th className="py-2">% Change</th>
                <th className="py-2">Trend</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {tableData.map((item, index) => {

                const isUp = item.change > 0
                const isDown = item.change < 0

                return (
                  <tr
                    key={index}
                    className="
                      border-b border-gray-100 dark:border-white/5
                      hover:bg-gray-100 dark:hover:bg-white/5
                      transition text-[15px]
                    "
                  >

                    {/* DATE */}
                    <td className="py-2">
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </td>

                    {/* PRICE */}
                    <td className="py-2 font-medium">
                      ₹{item.price.toFixed(2)}
                    </td>

                    {/* CHANGE */}
                    <td
                      className={`py-2 ${
                        isUp ? "text-green-500 dark:text-green-400" :
                        isDown ? "text-red-500 dark:text-red-400" : ""
                      }`}
                    >
                      {item.change != null
                        ? `${isUp ? "+" : ""}${item.change.toFixed(2)}`
                        : "-"}
                    </td>

                    {/* % CHANGE */}
                    <td
                      className={`py-2 ${
                        isUp ? "text-green-500 dark:text-green-400" :
                        isDown ? "text-red-500 dark:text-red-400" : ""
                      }`}
                    >
                      {item.changePercent != null
                        ? `${item.changePercent}%`
                        : "-"}
                    </td>

                    {/* TREND */}
                    <td
                      className={`py-2 ${
                        isUp ? "text-green-500 dark:text-green-400" :
                        isDown ? "text-red-500 dark:text-red-400" :
                        "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isUp ? "📈" : isDown ? "📉" : "—"}
                    </td>

                  </tr>
                )
              })}
            </tbody>

          </table>

        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No prediction data available
        </p>
      )}
    </div>
  )
}

export default PredictionTable