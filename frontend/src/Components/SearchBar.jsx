import React from 'react'

function SearchBar({
    search = "",
    setSearch = () => { },
    sortOptions = [],
    sortBy = "",
    setSortBy = () => { },
    filterOptions = [],
    filterBy = "",
    setFilterBy = () => { },
    totalAvailableCommodities = 0,
    trend,
    setTrend = () => { },
    selectedDate,
    setSelectedDate = () => { },
    selectedType,
    setSelectedType = () => { },
    today,
    fetchData = () => { },
    dataLoading,
}
) {


    return (
        //  🔍 Search + Filters (searchBar area) 
        <div className="w-full mb-4 flex items-center gap-3 border p-3 rounded-xl flex-wrap">

            {/* Search */}
            <div className="relative flex-1 min-w-50">
                {/* svg (search) */}
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
                <option value="">Sort by</option>
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
                <option value="">Filter by</option>
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
                    label: "Stable ( ±3% )",
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
            {/* <div className="w-full mt-3 flex justify-start"> */}

            {/* date selection menu */}
            <div className='relative'>
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
            </div>
            {/* today date set btn */}
            <button
                onClick={() => { setSelectedDate(today) }}
                className="px-3 py-2 rounded-xl border dark:bg-cyan-300/60 dark:text-black/90 transition transform whitespace-nowrap hover:scale-105 active:scale-95 duration-150 dark:hover:ring-1 dark:hover:ring-white"
            >
                Today
            </button>
            {["cereals", "fruits", "vegetables"].map((type) => (
                <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-2 rounded-xl border flex items-center gap-1 whitespace-nowrap
                  ${type === selectedType
                            ? "bg-green-500/50"
                            : "dark:bg-black"
                        }
                `}
                >
                    {type}
                </button>
            ))}

        </div>
    )
}

export default SearchBar