import React, { useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  ReferenceLine
} from 'recharts';
import { useFetchData } from '../contexts/Data';

const PriceGraph = ({ commodityType, commodityName = "Wheat" }) => {
  const { data: allData, dataLoading } = useFetchData();
  const [selectedDays, setSelectedDays] = useState(7);
  const data = allData[commodityType]
  // filter historical data
  const rawHistorical = (data?.historical || [])
    .filter(item => item.commodity.trim() === commodityName.trim())
    .map(item => ({ ...item, dateObj: new Date(item.date) }))
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(-selectedDays);

  // filter prediction data 
  const rawPredictions = (data?.predictions || [])
    .filter(item => item.commodity.trim() === commodityName.trim())
    .map(item => ({ ...item, dateObj: new Date(item.date) }))
    .sort((a, b) => a.dateObj - b.dateObj)

  // color chose for historical data
  let trendColor = "#64748b";
  if (rawHistorical.length >= 2) {
    const startPrice = rawHistorical[0].avg_price;
    const endPrice = rawHistorical[rawHistorical.length - 1].avg_price;

    if (endPrice > startPrice) trendColor = "#10b981";
    else if (endPrice < startPrice) trendColor = "#ef4444";
  }

  // color chose for prediction data
  let predictTrendColor = "#94a3b8";
  if (rawPredictions.length >= 2) {
    const startPred = rawPredictions[0].predicted_price;
    const endPred = rawPredictions[rawPredictions.length - 1].predicted_price;

    if (endPred > startPred) predictTrendColor = "#34d399";
    else if (endPred < startPred) predictTrendColor = "#f87171";
  }
  // combine historical and prediction data 
  const chartData = [
    ...rawHistorical.map((item, index) => {
      const isLastHistorical = index === rawHistorical.length - 1;
      const dateLabel = new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

      return {
        date: dateLabel,
        price: item.avg_price,
        prediction: isLastHistorical ? item.avg_price : null,
        isBridge: isLastHistorical,
        type: 'Historical'
      };
    }),

    ...rawPredictions.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      prediction: item.predicted_price,
      isBridge: false,
      type: 'predictions'
    }))
  ];


  const hasPrediction = rawPredictions.length > 0;

  return (
    <div className="w-full p-6 bg-white dark:bg-[#0b0e14] rounded-3xl shadow shadow-taupe-600 border border-gray-200 dark:border-white/10 transition-all duration-300">

      {dataLoading ? ("loader") : (
        chartData.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                  {commodityName} <span style={{ color: trendColor }} className="text-lg font-bold">Trend & Prediction</span>
                </h3>
              </div>

              <div className="flex items-center gap-4">

                {hasPrediction ? (<div className="flex items-center gap-2 relative group cursor-pointer">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: predictTrendColor }}
                  ></span>

                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    7D Forecast
                  </span>

                  <div className="absolute text-[14px] top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap z-50">
                    <div className="flex items-center gap-2 ">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span> Increase
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span> Decrease
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span> Stable
                    </div>
                  </div>
                </div>) :
                  (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Prediction Not Available
                    </span>
                  )}
                <div className="relative">
                  <select
                    value={selectedDays}
                    onChange={(e) => setSelectedDays(Number(e.target.value))}
                    className="appearance-none bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 py-2 px-4 pr-10 rounded-xl font-bold text-sm border border-transparent focus:border-emerald-500 outline-none cursor-pointer transition-all"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="15">Last 15 days</option>
                    <option value="30">Last 30 days</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                  <ReferenceLine
                    x={chartData[rawHistorical.length - 1]?.date}
                    stroke="#ffffff"
                    strokeDasharray="4 4"
                    strokeOpacity={0.5}
                  />
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={trendColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888888', fontSize: 11, fontWeight: 'bold' }}
                    dy={15}
                    label={{
                      value: "Date",
                      position: "bottom",
                      offset: 20,
                      style: { fill: '#888888', fontSize: 12, fontWeight: 'bold' }
                    }}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888888', fontSize: 11, fontWeight: 'bold' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(2)}k`}
                    label={{
                      value: "Price",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: '#888888', fontSize: 12, fontWeight: 'bold' }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#fff',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value, name, props) => {
                      const { price } = props.payload;
                      if (name === "prediction" && price !== undefined) return [null];
                      return [`₹${Number(value).toFixed(2)}`, name === "price" ? "Actual Price" : "Predicted Price"];
                    }}
                  />
                  {/* HISTORICAL AREA */}
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={trendColor}
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    animationDuration={1000}
                    connectNulls
                  />
                  {/* PREDICTED DASHED LINE */}
                  <Area
                    type="monotone"
                    dataKey="prediction"
                    stroke={predictTrendColor}
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    fill="transparent"
                    dot={(props) => {
                      const { payload, cx, cy } = props;
                      if (payload.isBridge || payload.prediction === null || payload.prediction === undefined) {
                        return null;
                      }
                      return (
                        <circle cx={cx} cy={cy} r={4} fill={predictTrendColor} strokeWidth={2} />
                      );
                    }}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : ("Data not found")
      )}
    </div>
  );
};

export default PriceGraph;