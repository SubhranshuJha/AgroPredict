import Card from "../Components/Card.jsx";
import CardUiAnimation from "../Components/CardUiAnimation.jsx";
import iconMap from '../assets/map.json'
import { useFetchData } from "../contexts/Data.jsx";
import { useEffect, useState, useMemo } from "react";

function Home() {
  const { data, loading, fetchData } = useFetchData();
  const sortOptions = ["highestAvgPrice", "lowestAvgPrice", "name(asc)", "name(desc)"]
  const filterOptions = ["predictionAvailable", "predictionUnavailable"]
  const [sortBy, setSortBy] = useState("lowestAvgPrice")
  const [filterBy, setFilterBy] = useState(null);

  const todayDate = new Date().toLocaleDateString('en-CA')


  const historicalData = data?.historical?.filter(commodity => commodity.date === todayDate) || []
  const predictedData = data?.predictions || []

  const sortedData = useMemo(() => {
    if (!historicalData.length) return [];

    let filtered = [...historicalData];
    if (filterBy === 'predictionAvailable') {
      filtered = filtered.filter(item =>
        predictedData.some(p => p.commodity === item.commodity)
      )
    }
    if (filterBy === 'predictionUnavailable') {
      filtered = filtered.filter(item =>
        !predictedData.some(p => p.commodity === item.commodity)
      )
    }
    return filtered.sort((a, b) => {

      switch (sortBy) {
        case "highestAvgPrice":
          return b.avg_price - a.avg_price

        case "lowestAvgPrice":
          return a.avg_price - b.avg_price

        case "name(asc)":
          return a.commodity.localeCompare(b.commodity);

        case "name(desc)":
          return b.commodity.localeCompare(a.commodity)

        default:
          return 0;
      }
    });
  }, [historicalData, sortBy, filterBy])



  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* buttons and select */}
      <div className="flex m-3 gap-4 max-h-fit w-full items-center justify-center">
        <button
          className="border max-w-fit border-amber-400 p-3 rounded-2xl bg-blue-500/50"
          onClick={fetchData}
        >
          Refresh Data
        </button>
        <select
          className="w-30 p-3 border max-h-fit bg-black min-w-fit"
          value={sortBy}
          // defaultValue={"none"}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map((sortBy, index) =>
            <option key={index} value={sortBy}>
              {sortBy}
            </option>
          )}
        </select>
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() =>
              setFilterBy(prev => (prev === option ? null : option))
            }
            // onClick={() => setFilterBy(option)}
            className={`px-4 py-2 rounded-xl border 
        ${filterBy === option ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}
      `}
          >
            {option}
          </button>
        ))}
      </div>

      {/* actual data rendering of cards */}
      <div className="py-5 w-11/12 mx-auto min-h-11/12">
        <div className=" mt-2 p-5 min-h-screen rounded-3xl shadow shadow-taupe-600 ">

          {/* <div className="flex flex-wrap "> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
            {
              loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <CardUiAnimation key={index} />
                ))
              ) : (
                //  card loop rendering
                sortedData?.length > 0 ? (
                  sortedData.map((entity) => (
                    // one card rendering 
                    <Card
                      key={entity.commodity}
                      historicalData={entity}
                      predictedData={
                        predictedData?.filter(
                          item => item.commodity === entity.commodity
                        )
                      }
                      icon={`/icons/${iconMap[entity.commodity.trim()]}.png`}
                    />
                  ))
                ) : (<h1>Data not found</h1>)
              )

            }

          </div>
        </div>

      </div>
    </div>
  )
}

export default Home
