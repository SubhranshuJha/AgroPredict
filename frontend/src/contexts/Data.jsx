import React, {createContext, useContext, useState } from 'react'
import axios from 'axios';

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);


    const backEndUrl = import.meta.env.VITE_BACKEND_URL;
    console.log(backEndUrl);
    // const API_URL = `${backEndUrl}/`;
    const API_URL = `${backEndUrl}/api/predict`;
    // 2 routes
    // GET /
    // GET /api/predict
    const fetchData = async () => {
        try {
            setLoading(true);
            console.log("started loading");
            const response = await axios.get(API_URL)

            if (response?.success) {
                setData(response)
            } else {
                console.error("data not available from backend");
                setData(null);
            }
        } catch (error) {
            console.error("Data fetching error");
            setData(null);
        } finally {
            setLoading(false)
        }
    }
    fetchData();
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
