import React from "react";
import { BackBtn, CardRenderer, GlobalLoader } from "../Components";
import { useFetchData } from "../contexts/data/useFetchData";

function Dashboard() {
  const { data, alerts, alertsLoading, fetchAlerts } = useFetchData();

  const allHistorical = [
    ...(data.cereals?.historical || []),
    ...(data.vegetables?.historical || []),
    ...(data.fruits?.historical || [])
  ];

  const today = new Date().toLocaleDateString("en-CA");
  const previousDate = new Date(
    new Date(today).getTime() - 86400000
  ).toLocaleDateString("en-CA");

  const todayData = allHistorical.filter(i => i.date === today);
  const yesterdayData = allHistorical.filter(i => i.date === previousDate);

  const prices = todayData.map(item => item.avg_price);

  const mean = prices.length
    ? prices.reduce((sum, p) => sum + p, 0) / prices.length
    : 0;

  const variance = prices.length
    ? prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length
    : 0;

  const stdDev = Math.sqrt(variance);

  const avgVolatility = mean
    ? ((stdDev / mean) * 100).toFixed(2)
    : 0;

  let marketStatus = "Stable";
  if (avgVolatility > 10) marketStatus = "Highly Volatile";
  else if (avgVolatility > 5) marketStatus = "Volatile";

  let statusColor = "text-green-400";
  if (marketStatus === "Volatile") statusColor = "text-yellow-400";
  if (marketStatus === "Highly Volatile") statusColor = "text-red-400";

  let rising = 0;
  let falling = 0;

  todayData.forEach(item => {
    const yesterday = yesterdayData.find(
      y => y.commodity === item.commodity
    );
    if (!yesterday) return;

    const diff = item.avg_price - yesterday.avg_price;
    if (diff > 0) rising++;
    else if (diff < 0) falling++;
  });

  const totalCommodities = Math.floor(todayData.length / 5) * 5 || 0;

  const avgMarketPrice = todayData.length
    ? (
        todayData.reduce((sum, item) => sum + item.avg_price, 0) /
        todayData.length
      ).toFixed(2)
    : 0;

  const lastUpdatedDate =
    data["cereals"]?.historical?.length > 0
      ? data["cereals"].historical.reduce(
          (max, item) => (item.date > max ? item.date : max),
          data["cereals"].historical[0].date
        )
      : null;

  const formattedTodayDate = today;

  return (
    <div className="bg-[#B4EBE6]/20 text-black 
      dark:bg-[#020617] dark:text-white transition-all duration-300">
      <BackBtn />

      <div className="min-h-screen px-4 sm:px-8 lg:px-16 pt-16 sm:pt-10 pb-10 
       transition-all duration-300">

        {/* HEADER */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Market Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Real-time prices and <span className="text-cyan-500">AI</span> predictions
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">

          {[
            { title: "COMMODITIES", value: "95+", sub: "total tracked" },
            { title: "LIVE TRACKED", value: `${totalCommodities}+`, sub: "live data" },
            { title: "RISING", value: rising, sub: "vs yesterday", color: "text-green-500" },
            { title: "FALLING", value: falling, sub: "vs yesterday", color: "text-red-500" },
            {
              title: "AVG PRICE",
              value: `₹${avgMarketPrice}`,
              sub: `${marketStatus} (${avgVolatility}%)`,
              color: statusColor
            }
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 border 
              bg-white/50 border-gray-200
              dark:bg-[#111827] dark:border-white/10 
              hover:scale-[1.02] transition shadow-lg hover:shadow-xl"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.title}
              </p>
              <h2 className={`text-2xl font-bold ${card.color || ""}`}>
                {card.value}
              </h2>
              <p className="text-xs text-gray-400">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ALERTS */}
          <div className="lg:col-span-3 rounded-2xl">
            <div className="rounded-2xl p-5 border 
            bg-white/50 border-gray-200
            dark:bg-[#111827] dark:border-white/10 h-full shadow-lg">

              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  🔔 Market Alerts ({alerts?.length || 0})
                </h3>

                <button
                  onClick={fetchAlerts}
                  disabled={alertsLoading}
                  className="text-sm px-3 py-1 border rounded-lg 
                  hover:bg-gray-200 dark:hover:bg-white/10 transition"
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-3 max-h-100 overflow-y-auto">

                {alertsLoading ? (
                  <GlobalLoader />
                ) : alerts?.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border text-sm
                      ${
                        alert.type === "danger"
                          ? "bg-red-100 border-red-300 dark:bg-red-500/10 dark:border-red-500/30"
                          : alert.type === "warn"
                          ? "bg-yellow-100 border-yellow-300 dark:bg-yellow-500/10 dark:border-yellow-500/30"
                          : "bg-gray-100 border-gray-200 dark:bg-white/5 dark:border-white/10"
                      }`}
                    >
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                        {alert.detail}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No alerts available</p>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="rounded-2xl p-5 border 
          bg-white/50 border-gray-200
          dark:bg-[#111827] dark:border-white/10 shadow-lg">

            <h3 className="font-semibold mb-4">Quick Stats</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total</span>
                <span>95+</span>
              </div>
              <div className="flex justify-between">
                <span>Model Accuracy</span>
                <span className="text-green-400">84%</span>
              </div>
              <div className="flex justify-between">
                <span>Predictions</span>
                <span>75+</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className={statusColor}>{marketStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>{lastUpdatedDate}</span>
              </div>
            </div>

            {lastUpdatedDate === formattedTodayDate && (
              <div className="mt-5 text-center p-2 rounded-lg 
              bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400">
                Data is current
              </div>
            )}
          </div>
        </div>
      </div>

      <CardRenderer />
    </div>
  );
}

export default Dashboard;