import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react'
import axios from 'axios';

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);


    const backEndUrl = import.meta.env.VITE_BACKEND_URL;
    // const API_URL = `${backEndUrl}/`;
    const API_URL = `${backEndUrl}/api/predict`;
    // 2 routes
    // GET /
    // GET /api/predict
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const startTime = performance.now()
            const response = await axios.get(API_URL)
            if (response.data?.success) {
                setData(response.data)
                const endTime = performance.now()
                console.log("total Time:", (endTime - startTime) / 1000, "s");
            } else {
                console.error("ERROR :: data not available from backend");
                setData(null);
            }
        } catch (error) {
            console.error("Data fetching error:", error);
            setData(null);
        } finally {
            setLoading(false)
        }
    }, [])
    const hasFetched = useRef(false);

    
    useEffect(() => {
        // fetchData();
        if (!hasFetched.current) {
            fetchData();
            hasFetched.current = true;
        }
    }, [fetchData])

    return (
        <DataContext.Provider
            value={{
                data,
                loading,
                fetchData,
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
