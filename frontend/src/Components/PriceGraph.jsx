import React, { useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useFetchData } from '../contexts/Data';
// import response from '../response_1775565278673.json';

const PriceGraph = ({ commodityName = "Wheat" }) => {
  const { data, loading } = useFetchData();
  const [selectedDays, setSelectedDays] = useState(7);

  // take data from context and filter it and sort based on date and slice it based on selected days
  const rawData = (data?.historical || [])
    .filter(item => item.commodity.trim() === commodityName.trim())
    .sort((a, b) => new Date(a.date) - new Date(b.date)) 
    .slice(-selectedDays);

  // determine color based on price diffrence today and last day available in graph
  let trendColor = "#64748b"; 
  if (rawData.length >= 2) {
    const startPrice = rawData[0].avg_price;
    const endPrice = rawData[rawData.length - 1].avg_price;

    // green if price increase , red for price decrease and gray for no change
    if (endPrice > startPrice) trendColor = "#10b981"; 
    else if (endPrice < startPrice) trendColor = "#ef4444"; 
  }

  // format data for recharts
  const chartData = rawData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    price: item.avg_price
  }));

  return (
    <div className="w-full p-6 bg-white dark:bg-[#0b0e14] rounded-3xl shadow shadow-taupe-600 border border-gray-200 dark:border-white/10 transition-all duration-300">

      {loading ? ("loader") : (

        chartData.length > 0 ? (
          <>
            {/* header with dropdown */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                  {commodityName} <span style={{ color: trendColor }} className="text-lg font-bold">Trend</span>
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Market movement overview</p>

              {/* select dropdown and choose how many days you want to view */}
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
                {/* Custom Arrow for the select */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* CHART SECTION */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      {/* Using trendColor for the gradient fill */}
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
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888888', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#fff',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: trendColor, fontWeight: 'bold' }}
                    formatter={(value) => [`₹${value}`, 'Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={trendColor} // Stroke changes color based on price trend
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    animationDuration={1000}
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