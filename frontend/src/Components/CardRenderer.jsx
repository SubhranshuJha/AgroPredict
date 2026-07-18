import React from 'react'
import { Card, CardUiAnimation } from "../Components";
import iconMap from '../assets/map.json'
import { useFetchData } from "../contexts/data/useFetchData";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from './';

function CardRenderer() {
  let totalAvailableCommodities = 0;
  const { data, dataLoading, fetchData } = useFetchData();
  const [search, setSearch] = useState("");
  const sortOptions = ["highestAvgPrice", "lowestAvgPrice", "name(asc)", "name(desc)"]
  const filterOptions = ["predictionAvailable", "predictionUnavailable"]
  const [selectedType, setSelectedType] = useState("cereals");
  const [sortBy, setSortBy] = useState("")
  const [filterBy, setFilterBy] = useState(null);
  const [trend, setTrend] = useState("all");
  const today = new Date().toLocaleDateString('en-CA');
  const [selectedDate, setSelectedDate] = useState(today);
  // const todayDate = selectedDate
  const previousDate = new Date(new Date(selectedDate).getTime() - 86400000).toLocaleDateString('en-CA')

  // const historicalData = data[selectedType]?.historical?.filter(commodity => commodity.date === "2026-04-17") || []

  const { historicalData, yesterdayData, predictedData } = useMemo(
    () => {
      const historicalData = data[selectedType]?.historical?.filter(commodity => commodity.date === selectedDate) || []
      const yesterdayData = data[selectedType]?.historical?.filter(commodity => commodity.date === previousDate) || []
      const predictedData = data[selectedType]?.predictions || [];
      return {
        historicalData,
        yesterdayData,
        predictedData
      }
    }
    , [data, selectedType, selectedDate, previousDate]);

  totalAvailableCommodities = historicalData?.length || 0

  const sortedData = useMemo(() => {
    if (!historicalData.length) return [];
    let filtered = [...historicalData];

    // filter with search bar input value
    if (search?.trim()) {
      filtered = filtered.filter(item =>
        item.commodity.toLowerCase().includes(search.trim().toLowerCase())
      )
    }

    // filter with btns
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
    // 📈 Trend filter (today vs yesterday)
    if (trend !== "all") {
      filtered = filtered.filter(item => {
        const yesterday = yesterdayData.find(
          y => y.commodity === item.commodity
        );

        if (!yesterday) return false;

        const diff = (item.avg_price - yesterday.avg_price) / yesterday.avg_price * 100;

        if (trend === "rising") return diff > 3;
        if (trend === "falling") return diff < -3;
        if (trend === "stable") return Math.abs(diff) <= 3;

        return true;
      });
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
  }, [historicalData, sortBy, filterBy, search, trend, yesterdayData, predictedData])




  return (
    <div className="w-full min-h-screen flex flex-col items-center">

      {/* Top controls */}


      {/* Main container */}

      <div className="py-5 w-[95%] sm:w-11/12 mx-auto min-h-11/12 ">

        <div className="mt-2 p-3 sm:p-5 min-h-screen rounded-3xl shadow shadow-taupe-600 dark:bg-green-900/5">
       
          <SearchBar
            search={search}
            sortBy={sortBy}
            sortOptions={sortOptions}
            filterBy={filterBy}
            filterOptions={filterOptions}
            totalAvailableCommodities={totalAvailableCommodities}
            trend={trend}
            selectedDate={selectedDate}
            today={today}
            selectedType={selectedType}
            setSelectedDate={setSelectedDate}
            setSelectedType={setSelectedType}
            setTrend={setTrend}
            setSearch={setSearch}
            setSortBy={setSortBy}
            setFilterBy={setFilterBy}
            dataLoading={dataLoading}
            fetchData={fetchData}
          />

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">

            {
              dataLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <CardUiAnimation key={index} />
                ))
              ) : (
                sortedData?.length > 0 ? (
                  sortedData.map((entity) => (
                    <Link
                      key={entity.commodity}
                      to={`/commodityInformation/${encodeURIComponent(selectedType)}/${encodeURIComponent(entity.commodity)}`}
                      className="block"
                    >
                      <Card
                        historicalData={entity}
                        icon={`/icons/${iconMap[entity.commodity.trim()]}.png`}
                      />
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">

                    {/* Icon */}
                    <div className="text-5xl mb-4">
                      {trend === "rising" && "📈"}
                      {trend === "falling" && "📉"}
                      {trend === "stable" && "〰️"}
                      {trend === "all" && "📦"}
                    </div>

                    {/* Title */}
                    <h1 className="text-xl font-semibold mb-2">
                      {totalAvailableCommodities > 0
                        ? `No ${trend} commodities found on ${selectedDate}`
                        : "No Data Available"}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-500 max-w-md">
                      {totalAvailableCommodities > 0
                        ? "Try changing filters, search, or trend selection."
                        : "Please refresh or check back later."}
                    </p>

                  </div>
                )
              )
            }

          </div>

        </div>
      </div>
    </div>
  )
}

export default CardRenderer