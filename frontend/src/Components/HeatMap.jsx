import { useFetchData } from '../contexts/Data';


const HeatMap = () => {

  // fetch data and shorting it
  const { data: x, loading } = useFetchData();
  const data = x?.historical || [];
  const dates = [...new Set(data.map(d => d.date))].sort((a, b) => new Date(b) - new Date(a));

  const todayDate = dates[0];
  const yesterdayDate = dates[1];

  // filter data for today and yesterday and sort it based on price
  const todayData = data.filter(d => d.date === todayDate).sort((a, b) => b.avg_price - a.avg_price);
  const yesterdayData = data.filter(d => d.date === yesterdayDate);

  // data for heatmap
  const formattedData = todayData.map((todayItem) => {
    const yesterdayItem = yesterdayData.find(
      y => y.commodity === todayItem.commodity
    );

    // skip if no yesterday data or price available for comparison
    if (!yesterdayItem) return null;

    // choose today and yesterday price
    const todayPrice = todayItem.avg_price;
    const yesterdayPrice = yesterdayItem.avg_price;

    if (!yesterdayPrice) return null;

    const diff = todayPrice - yesterdayPrice;
    const percent = ((diff / yesterdayPrice) * 100).toFixed(2);

    // choose color based on price
    let bgColor = "bg-slate-500 dark:bg-slate-700";
    if (diff > 0) bgColor = "bg-green-500 dark:bg-green-600";
    if (diff < 0) bgColor = "bg-red-500 dark:bg-red-600";

    return {
      name: todayItem.commodity,
      price: Math.round(todayPrice),
      percent: `${percent > 0 ? '+' : ''}${percent}%`,
      bgColor
    };
  }).filter(Boolean);

  return (
    <div className="w-full flex justify-center items-center py-8 bg-white dark:bg-[#0b0e14] rounded-3xl shadow shadow-taupe-600 transition-colors duration-300">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl px-4">
        {/* Render the heatmap cards */}
        {formattedData.length > 0 ?
          (formattedData?.map(
            (item, index) => (
              <div
                key={index}
                className={`${item.bgColor} h-32 rounded-2xl p-4 flex flex-col justify-between shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-default`}
              >
                {/* Top Left */}
                <span className="text-white font-bold text-sm truncate">
                  {item.name}
                </span>

                {/* Bottom Right */}
                <div className="text-right">
                  <span className="text-white block text-xl font-black tracking-tight">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-white text-xs font-bold opacity-90">
                    {item.percent}
                  </span>
                </div>
              </div>
            )
          )) : (loading ? "" : "Data not found")
        }
      </div>
    </div>
  );
};

export default HeatMap;