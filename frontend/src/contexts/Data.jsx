import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
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
            const response = await axios.get(API_URL)
            if (response.data?.success) {
                setData(response.data)
            } else {
                console.error("ERROR :: data not available from backend");
                setData(null);
            }
        } catch (error) {
            console.error("Data fetching error");
            setData(null);
        } finally {
            setLoading(false)
        }
    }, [API_URL])

    // fetchData();
    useEffect(() => {
        fetchData();
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
