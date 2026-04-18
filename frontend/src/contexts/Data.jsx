import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios';

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        cereals: [],
        vegetables: [],
        fruits: []
    });
    // const [data_cereals, setData_cereals] = useState([]);
    // const [data_vegetables, setData_vegetables] = useState([])
    // const [data_fruits, setData_fruits] = useState([])
    const [alerts, setAlerts] = useState();
    const [dataLoading, setDataLoading] = useState(false);
    const [alertsLoading, setAlertsLoading] = useState(false);


    const backEndUrl = import.meta.env.VITE_BACKEND_URL;
    const type = useRef(["cereals", "vegetables", "fruits"]).current;
    // const type = ["cereals", "vegetables", 'fruits']
    // const API_URL = `${backEndUrl}/`;
    const FETCH_DATA_API_URL = `${backEndUrl}/api/predict`;
    const FETCH_ALERTS_API_URL = `${backEndUrl}/api/alerts`;

    // 3 routes
    // GET /
    // GET /api/predict/cereals
    // GET /api/predict/vegetables
    // GET /api/predict/fruits
    // GET /api/alerts

    const fetchData = useCallback(async () => {
        try {
            setDataLoading(true);
            const startTime = performance.now()
            // const response = await axios.get(`${FETCH_DATA_API_URL}/${type[0]}`)
            // const response_Cereals = await axios.get(`${FETCH_DATA_API_URL}/${type[0]}`)
            // const response_Vegetables = await axios.get(`${FETCH_DATA_API_URL}/${type[1]}`)
            // const response_Fruits = await axios.get(`${FETCH_DATA_API_URL}/${type[2]}`)
            const [response_Cereals, response_Vegetables, response_Fruits] = await Promise.all([
                axios.get(`${FETCH_DATA_API_URL}/${type[0]}`),
                axios.get(`${FETCH_DATA_API_URL}/${type[1]}`),
                axios.get(`${FETCH_DATA_API_URL}/${type[2]}`)
            ]);
            // console.log(response_Cereals.data);
            // console.log(response_Vegetables.data);
            // console.log(response_Fruits.data);
            if (response_Cereals.data?.success && response_Vegetables.data?.success && response_Fruits.data?.success) {
                // setData_cereals(response_Cereals.data)
                // setData_vegetables(response_Vegetables.data)
                // setData_fruits(response_Fruits.data)
                setData({
                    cereals: response_Cereals.data,
                    vegetables: response_Vegetables.data,
                    fruits: response_Fruits.data
                })
                const endTime = performance.now()
                console.log("Time(data fetch):", (endTime - startTime) / 1000, "s");
            } else {
                console.error("ERROR :: data not available from backend");
                // setData(null);
                setData({
                    cereals: null,
                    vegetables: null,
                    fruits: null
                });
            }
        } catch (error) {
            console.error("Data fetching error:", error);
            // setData(null);
            setData({
                cereals: null,
                vegetables: null,
                fruits: null
            });
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
