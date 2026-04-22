import React, { useMemo } from 'react';
import { BackBtn, GlobalLoader, HeatMap } from '../Components';
import { useFetchData } from '../contexts/data/useFetchData';
import { processData } from '../utils/processData';

const GainerIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 16L10 10L14 14L20 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 8H20V14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LoserIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 8L10 14L14 10L20 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 16H20V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Reusable Card Component
const ChangeCard = ({ title, data, type }) => {
  const isGainer = type === "gainer";

  return (
    <div className="flex-1 border border-blue-300/20 rounded-2xl p-4 shadow-sm dark:bg-[#0b0e14]">
      <div className="mb-3 flex gap-1">
        {isGainer?<GainerIcon className='text-green-400 animate-bounce'/>:<LoserIcon className='text-red-400 animate-bounce'/>}
      <h2 className="font-semibold ">{title}</h2>
      </div>

      {data.length === 0 ? (
        <p className="text-sm opacity-60">No data available</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((item, index) => (
            <div
              key={item.commodity}
              className={`flex justify-between p-3 rounded-lg transition ${isGainer ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'
                }`}
            >
              <div>
                <p className="font-medium text-yellow-100/90">{item.commodity}</p>
                <p className="text-sm opacity-70">
                  ₹{Math.round(item.yesterdayPrice)} → ₹{Math.round(item.todayPrice)}
                  {" "}
                  ({isGainer ? '+' : '-'}₹{Math.abs(Math.round(item.difference))})
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`font-medium ${isGainer ? 'text-green-400' : 'text-red-400'
                    }`}
                >
                  {isGainer ? '+' : ''}
                  {item.percentDifference}%
                </p>
                <p className="text-xs opacity-60">#{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function OverView() {
  const { data, dataLoading } = useFetchData();

  const { gainersData, losersData } = useMemo(() => {
    if (!data) return { gainersData: [], losersData: [] };

    const allHistorical = [
      ...(data?.cereals?.historical || []),
      ...(data?.vegetables?.historical || []),
      ...(data?.fruits?.historical || [])
    ];

    const todayObj = new Date();
    const yesterdayObj = new Date();
    yesterdayObj.setDate(todayObj.getDate() - 1);

    const format = (d) => d.toISOString().split("T")[0];

    const today = format(todayObj);
    const yesterday = format(yesterdayObj);

    const todayData = allHistorical.filter(i => i.date === today);
    const yesterdayMap = new Map(
      allHistorical
        .filter(i => i.date === yesterday)
        .map(i => [i.commodity, i])
    );

    const computed = todayData
      .map(item => {
        const y = yesterdayMap.get(item.commodity);
        if (!y) return null;

        const diff = item.avg_price - y.avg_price;
        const percent = ((diff / y.avg_price) * 100);

        return {
          commodity: item.commodity,
          todayPrice: item.avg_price,
          yesterdayPrice: y.avg_price,
          difference: diff,
          percentDifference: Number(percent.toFixed(2))
        };
      })
      .filter(Boolean);

    const sorted = processData({
      data: computed,
      sortBy: "percentDifference",
      order: -1
    });

    return {
      gainersData: sorted.slice(0, 5),
      losersData: sorted.slice(-5).reverse()
    };
  }, [data]);

  return (
    <div className="m-3">
      <BackBtn />

      <div className="w-11/12 mx-auto my-5 min-h-[50vh] ">
        {dataLoading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <GlobalLoader />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <ChangeCard title="Top Gainers" data={gainersData} type="gainer" />
            <ChangeCard title="Top Losers" data={losersData} type="loser" />
          </div>
        )}
      </div>

      <HeatMap />
    </div>
  );
}

export default OverView;