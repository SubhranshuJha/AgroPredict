import React from 'react'
import Card from "../Components/Card.jsx";
import CardUiAnimation from "../Components/CardUiAnimation.jsx";
import iconMap from '../assets/map.json'
import { useFetchData } from "../contexts/Data.jsx";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

function CardRenderer() {
  let totalAvailableCommodities = 0;
  const { data, dataLoading, fetchData } = useFetchData();
  const [search, setSearch] = useState("");
  const sortOptions = ["highestAvgPrice", "lowestAvgPrice", "name(asc)", "name(desc)"]
  const filterOptions = ["predictionAvailable", "predictionUnavailable"]
  const [sortBy, setSortBy] = useState("")
  const [filterBy, setFilterBy] = useState(null);
  const [trend, setTrend] = useState("all");
  const today = new Date().toLocaleDateString('en-CA');
  const [selectedDate, setSelectedDate] = useState(today);

  // const todayDate = selectedDate
  const previousDate = new Date(new Date(selectedDate).getTime() - 86400000).toLocaleDateString('en-CA')

  const historicalData = data?.historical?.filter(commodity => commodity.date === selectedDate) || []
  // const historicalData = data?.historical?.filter(commodity => commodity.date === '2026-04-13') || []
  const yesterdayData = data?.historical?.filter(
    commodity => commodity.date === previousDate
  ) || []
  const predictedData = data?.predictions || []
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

        const diff = item.avg_price - yesterday.avg_price;

        if (trend === "rising") return diff > 0;
        if (trend === "falling") return diff < 0;
        if (trend === "stable") return Math.abs(diff) < 1;

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

      <div className="py-5 w-11/12 mx-auto min-h-11/12 ">

        <div className="mt-2 p-5 min-h-screen rounded-3xl shadow shadow-taupe-600 dark:bg-green-900/5">

          {/* 🔍 Search + Filters */}
          <div className="w-full mb-4 flex items-center gap-3 border p-3 rounded-xl flex-wrap">

            {/* Search */}
            <div className="relative flex-1 min-w-50">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.85-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search commodities..."
                className="p-2 pl-10 rounded-xl w-full border"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 rounded-xl border dark:bg-black"
            >
              <option value="">Sort</option>
              {sortOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>

            {/* Filter */}
            <select
              value={filterBy || ""}
              onChange={(e) => setFilterBy(e.target.value || null)}
              className="p-2 rounded-xl border dark:bg-black"
            >
              <option value="">Filter</option>
              {filterOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>

            {/* Trend Buttons */}
            {[
              { key: "all", label: `All (${totalAvailableCommodities})`, icon: "📦" },
              {
                key: "rising",
                label: "Rising",
                icon: (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 7-7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 8h4v4" />
                  </svg>
                )
              },
              {
                key: "falling",
                label: "Falling",
                icon: (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6 6 4-4 7 7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 16h4v-4" />
                  </svg>
                )
              },
              {
                key: "stable",
                label: "Stable",
                icon: (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12c2-4 4 4 6 0s4-4 6 0 4 4 6 0" />
                  </svg>
                )
              },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTrend(t.key)}
                className={`px-3 py-2 rounded-xl border flex items-center gap-1 whitespace-nowrap
        ${trend === t.key
                    ? "bg-blue-500/70"
                    : "dark:bg-black"
                  }
      `}
              >
                <span className="flex items-center">{t.icon}</span>
                {t.label}
              </button>
            ))}
            {/* refresh btn */}
        <button
          className="border px-2 py-2 rounded-lg hover:bg-white/10 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={fetchData}
          disabled={dataLoading}
        >
          Refresh
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${dataLoading ? "animate-spin" : ""}`}
          >
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0114.13-3.36L23 10"></path>
            <path d="M20.49 15a9 9 0 01-14.13 3.36L1 14"></path>
          </svg>
        </button>
            <div className="w-full mt-3 flex justify-start">
              <div className="relative">

                {/* Icon */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  📅
                </span>

                {/* Date Input */}
                <input
                  type="date"
                  value={selectedDate}
                  max={today}
                  onChange={(e) => {
                    if (!e.target.value) return setSelectedDate(today);
                    setSelectedDate(e.target.value)
                  }}
                  onKeyDown={(e) => e.preventDefault()}
                  // onMouseDown={(e) => e.preventDefault()}
                  onFocus={(e) => e.target.showPicker?.()}
                  className="pl-10 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-cyan-300/60 dark:text-black "
                />
                <button
                  onClick={() => { setSelectedDate(today) }}
                  className="px-3 mx-3 py-2 rounded-xl border dark:bg-cyan-300/60 dark:text-black/90 transition transform whitespace-nowrap hover:scale-105 active:scale-95 duration-150 dark:hover:ring-1 dark:hover:ring-white"
                >
                  Today
                </button>
                
                {/* </div> */}
              </div>
            </div>

          </div>

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
                      to={`/commodityInformation/${encodeURIComponent(entity.commodity)}`}
                      className="block"
                    >
                      <Card
                        historicalData={entity}
                        predictedData={
                          predictedData?.filter(
                            item => item.commodity === entity.commodity
                          )
                        }
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