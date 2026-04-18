import React from "react";
import { BackBtn, CardRenderer, GlobalLoader } from "../Components";
import { useFetchData } from "../contexts/Data";


function Dashboard() {
  const { data, alerts, dataLoading, alertsLoading, fetchData, fetchAlerts } = useFetchData();
  const allHistorical = [
    ...(data.cereals?.historical || []),
    ...(data.vegetables?.historical || []),
    ...(data.fruits?.historical || [])
  ];

  const allPredictions = [
    ...(data.cereals?.predictions || []),
    ...(data.vegetables?.predictions || []),
    ...(data.fruits?.predictions || [])
  ];
  const today = new Date().toLocaleDateString('en-CA');

  const previousDate = new Date(
    new Date(today).getTime() - 86400000
  ).toLocaleDateString('en-CA');

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

  if (avgVolatility > 10) {
    marketStatus = "Highly Volatile";
  } else if (avgVolatility > 5) {
    marketStatus = "Volatile";
  }
  let statusColor = "text-green-400";

  if (marketStatus === "Volatile") {
    statusColor = "text-yellow-400";
  }
  if (marketStatus === "Highly Volatile") {
    statusColor = "text-red-400";
  }
  const formattedTodayDate = new Date().toLocaleDateString('en-CA')
  const lastUpdatedDate = data["cereals"]?.historical?.reduce(
    (max, item) => {
      return item.date > max ? item.date : max;
    }, data["cereals"]?.historical?.[0].date
  )
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


  const totalCommodities = todayData.length || 0;
  const avgMarketPrice = todayData.length
    ? (
      todayData.reduce((sum, item) => sum + item.avg_price, 0) /
      todayData.length
    ).toFixed(2)
    : 0;


  return (
    <>
      <BackBtn />
      <div className="text-gray-200 min-h-screen px-6 md:px-16 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">

          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Market Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Real-time prices and <span className="text-cyan-400">AI</span> predictions • AGMARKNET data
            </p>
          </div>

        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
            <p className="text-gray-400 text-sm mb-1">COMMODITIES</p>
            <h2 className="text-2xl font-semibold text-white">95+</h2>
            <p className="text-gray-500 text-xs mt-1">total commodities tracked</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
            <p className="text-gray-400 text-sm mb-1">RISING TODAY</p>
            <h2 className="text-2xl font-semibold text-green-400">{rising}</h2>
            <p className="text-gray-500 text-xs mt-1">
              Price increasing vs yesterday
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
            <p className="text-gray-400 text-sm mb-1">FALLING TODAY</p>
            <h2 className="text-2xl font-semibold text-red-400">{falling}</h2>
            <p className="text-gray-500 text-xs mt-1">
              Price decreasing vs yesterday
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
            <p className="text-gray-400 text-sm mb-1">AVG MARKET PRICE</p>
            <h2 className="text-2xl font-semibold text-yellow-400">₹{avgMarketPrice}</h2>
            <p className={`text-gray-500 text-xs mt-1 ${statusColor}`}>Status: {marketStatus} ({avgVolatility}%) </p>
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-3 rounded-2xl">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 h-full">

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                  🔔 Market Alerts
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
                    {alerts?.length || 0}
                  </span>
                </h3>

                <button
                  className="border border-white/20 px-4 py-1 rounded-lg hover:bg-white/10 transition flex items-center gap-2 disabled:opacity-50 text-sm"
                  onClick={fetchAlerts}
                  disabled={alertsLoading}
                >
                  Refresh
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 ${alertsLoading ? "animate-spin" : ""}`}
                  >
                    <path d="M23 4v6h-6"></path>
                    <path d="M1 20v-6h6"></path>
                    <path d="M3.51 9a9 9 0 0114.13-3.36L23 10"></path>
                    <path d="M20.49 15a9 9 0 01-14.13 3.36L1 14"></path>
                  </svg>
                </button>
              </div>

              {/* Alerts List */}
              <div className="space-y-3 h-100 overflow-y-auto pr-2">

                {alertsLoading ? (
                  <GlobalLoader />
                ) : alerts?.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`border rounded-xl p-4 flex justify-between items-start backdrop-blur-sm
                ${alert.type === "danger"
                          ? "border-red-500/20 bg-red-500/10"
                          : alert.type === "warning"
                            ? "border-yellow-500/20 bg-yellow-500/10"
                            : "border-white/10 bg-white/5"
                        }`}
                    >
                      <div>
                        <p className="font-medium text-white">
                          {alert.title}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {alert.detail}
                        </p>
                      </div>


                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4 flex flex-col items-center justify-between gap-1">
                        {alert.generated_at}
                        <span className="border text-sm rounded-md min-w-fit px-3 h-fit border-white/40 text-cyan-500/70 whitespace-nowrap">
                          {alert.type}
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No alerts available</p>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 h-full flex flex-col justify-evenly">

            <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
            <hr className="mb-4 border-white/10" />

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-400">Total Commodities</span>
                <span className="text-white">95+</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Model Accuracy</span>
                <span className="text-green-400">84.2%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Active Predictions</span>
                <span className="text-white">75+</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Market Status</span>
                <span className="text-red-400">{marketStatus}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Data Source</span>
                <span className="text-white">AGMARKNET</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Refresh</span>
                <span className="text-white">Daily</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Data upto</span>
                <span className="text-white">{lastUpdatedDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Today</span>
                <span className="text-white">{formattedTodayDate}</span>
              </div>

            </div>

            {lastUpdatedDate === formattedTodayDate && (
              <div className="mt-6 border rounded-lg p-3 font-bold  text-white bg-green-300/10 text-center">
                Data is current — updated today
              </div>
            )}

          </div>
        </div>

      </div>
      {/* below cards section */}
      <CardRenderer />
    </>
  )

}

export default Dashboard;
