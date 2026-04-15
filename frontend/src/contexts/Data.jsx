import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios';

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [alerts, setAlerts] = useState();
    const [dataLoading, setDataLoading] = useState(false);
    const [alertsLoading, setAlertsLoading] = useState(false);


    const backEndUrl = import.meta.env.VITE_BACKEND_URL;
    // const API_URL = `${backEndUrl}/`;
    const FETCH_DATA_API_URL = `${backEndUrl}/api/predict`;
    const FETCH_ALERTS_API_URL = `${backEndUrl}/api/alerts`;

    // 3 routes
    // GET /
    // GET /api/predict
    // GET /api/alerts

    const fetchData = useCallback(async () => {
        try {
            setDataLoading(true);
            const startTime = performance.now()
            const response = await axios.get(FETCH_DATA_API_URL)
            if (response.data?.success) {
                setData(response.data)
                const endTime = performance.now()
                console.log("Time(data fetch):", (endTime - startTime) / 1000, "s");
            } else {
                console.error("ERROR :: data not available from backend");
                setData(null);
            }
        } catch (error) {
            console.error("Data fetching error:", error);
            setData(null);
        } finally {
            setDataLoading(false)
        }
    }, [])

    const fetchAlerts = useCallback(async () => {
        try {
            setAlertsLoading(true);
            const startTime = performance.now()
            const response = await axios.get(FETCH_ALERTS_API_URL)
            if (response.data?.success) {
                setAlerts(response.data.alerts || [])
                const endTime = performance.now()
                console.log("Time(alerts fetch):", (endTime - startTime) / 1000, "s");
            } else {
                console.error("ERROR :: data(alerts) not available from backend");
                setAlerts(null);
            }
        } catch (error) {
            console.error("Data fetching error:", error);
            setAlerts(null);
        } finally {
            setAlertsLoading(false)
        }
    }, [])

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        const initFetch = async () => {
            await Promise.all([
                fetchData(),
                fetchAlerts()
            ]);
        };

        initFetch();
        hasFetched.current = true;
    }, [fetchData, fetchAlerts]);

    return (
        <DataContext.Provider
            value={{
                data,
                alerts,
                dataLoading,
                alertsLoading,
                fetchData,
                fetchAlerts
            }}
        >
            {children}
        </DataContext.Provider>
    )

}

export const useFetchData = () => {
    return useContext(DataContext);
}

export default DataProvider
