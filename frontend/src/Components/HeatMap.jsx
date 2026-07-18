import { useFetchData } from '../contexts/data/useFetchData';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const HeatMap = () => {

  const [selectedType, setSelectedType] = useState('cereals');
  // fetch data and shorting it
  const { data: allData, dataLoading } = useFetchData();
  const x = allData[selectedType]
  const data = x?.historical || [];
  // const dates = [...new Set(data.map(d => d.date))].sort((a, b) => new Date(b) - new Date(a));

  const [showAll, setShowAll] = useState(false);
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.commodity]) {
      acc[item.commodity] = [];
    }
    acc[item.commodity].push(item);
    return acc;
  }, {});


  // state for sorting
  const [sorted, setSorted] = useState('desc-percent');

  // data for heatmap
  const formattedData = Object.entries(grouped).map(([commodity, records]) => {

    // sort by date desc
    const sorted = records.sort((a, b) => new Date(b.date) - new Date(a.date));

    const todayItem = sorted[0];
    const yesterdayItem = sorted[1];

    if (!todayItem || !yesterdayItem) return null;

    const todayPrice = todayItem.avg_price;
    const yesterdayPrice = yesterdayItem.avg_price;

    const diff = todayPrice - yesterdayPrice;
    const percent = ((diff / yesterdayPrice) * 100);

    let bgColor = "bg-slate-400 dark:bg-slate-700";

    if (diff > 0) bgColor = "bg-green-400 dark:bg-green-600";
    if (diff < 0) bgColor = "bg-red-400 dark:bg-red-600";

    return {
      name: commodity,
      price: Math.round(todayPrice),
      percentNum: percent,
      percent: `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`,
      bgColor,
      formattedDate: new Date(todayItem.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
      })
    };

  }).filter(Boolean);



  const sortedData = [...formattedData].sort((a, b) => {
    switch (sorted) {
      case 'asc-alpha':
        return a.name.localeCompare(b.name);
      case 'desc-alpha':
        return b.name.localeCompare(a.name);
      case 'asc-percent':
        return b.percentNum - a.percentNum;
      case 'desc-percent':
        return a.percentNum - b.percentNum;
      default:
        return 0;
    }
  })

  const visibleData = showAll ? sortedData : sortedData.slice(0, 12);

  return (
    <div className="w-full flex flex-col gap-8 py-10 bg-[#eceae6] dark:bg-[#0b0e14] rounded-3xl shadow-md border border-[#d6d3cd] dark:border-white/5 transition-all">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-10 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white tracking-tight italic">
            MARKET <span className="text-emerald-500 uppercase">Intensity</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
            Live Heatmap Overview
          </p>
        </div>
        {/* top btns and sortings */}
        <div className="relative w-full md:w-auto md:min-w-50 flex flex-wrap justify-center gap-2">
          {/* filter by type */}
          {["cereals", "vegetables", "fruits"]
            .map(
              (type) =>
              (
                <button
                  key={type}
                  className={
                    `px-3 py-2 md:py-0 dark:text-indigo-200/90 font-semibold border border-cyan-600 rounded-md
                    ${type === selectedType ? "bg-[#74166e]" : "dark:bg-black"}
                    `}
                  onClick={() => { setSelectedType(type); setShowAll(false); }}
                >
                  {type}
                </button>)
            )
          }
          {/* dropdown button for sorting*/}
          <div className="relative w-full sm:w-auto">
            <select
              value={sorted}
              onChange={(e) => setSorted(e.target.value)}
              className="w-full appearance-none bg-[#e5e3df] dark:bg-slate-800 text-gray-700 dark:text-gray-200 py-3 px-6 pr-12 rounded-2xl font-black text-xs uppercase tracking-widest border border-[#d6d3cd] dark:border-transparent focus:border-emerald-500 outline-none cursor-pointer transition-all shadow-sm"
            >
              <option value="asc-percent">Percent: High to Low</option>
              <option value="desc-percent">Percent: Low to High</option>
              <option value="asc-alpha">Ascending alphabetical</option>
              <option value="desc-alpha">Descending alphabetical</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-500">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* GRID FIXED */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10">

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${!showAll ? "max-h-130 overflow-hidden" : ""
            }`}
        >
          {formattedData.length > 0 ? (
            visibleData.map((item, index) => (
              <Link
                key={index}
                to={`/commodityInformation/${encodeURIComponent(selectedType)}/${encodeURIComponent(item.name)}`}
                className="block"
              >
                <div
                  className={`${item.bgColor} h-36 rounded-3xl p-6 flex flex-col justify-between shadow-lg transition-all hover:scale-[1.03] hover:brightness-110 active:scale-95 cursor-pointer relative overflow-hidden group`}
                >
                  <span className="text-white font-black text-sm uppercase tracking-tight opacity-90 group-hover:opacity-100">
                    {item.name}
                  </span>

                  <div className="text-right">
                    <span className="text-white block text-2xl font-black tracking-tighter">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-black bg-black/20 text-white px-2 py-1 rounded-lg inline-block mt-2">
                      {item.percent}
                    </span>
                    <span className="text-[15px] text-white/80 block mt-1">
                      {item.formattedDate}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
              {dataLoading ? "Analyzing Market Data..." : "Data not found"}
            </div>
          )}
        </div>

        {/* VIEW MORE */}
        {!showAll && sortedData.length > 12 && (
          <div className="absolute bottom-0 left-0 w-full h-10 flex items-end justify-center pointer-events-none">

            <div className="absolute inset-0 bg-linear-to-t from-white dark:from-[#0b0e14] to-transparent "></div>

            {/* view more Button (clickable) */}
            <button
              onClick={() => {
                setShowAll(true);
                //  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="relative mb-4 px-6 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all pointer-events-auto shadow-lg"
            >
              View More
            </button>
          </div>
        )}
        {/* view less btn */}
        {showAll && sortedData.length > 12 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                setShowAll(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-6 py-2 rounded-xl bg-transparent border border-emerald-500 text-emerald-500 font-bold hover:bg-emerald-500 hover:text-white transition-all"
            >
              View Less
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default HeatMap;