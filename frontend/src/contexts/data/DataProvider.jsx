import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DataContext } from './dataContext';
import { fetchAllDataAPI, fetchAlertsAPI } from './dataAxiosService';

const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        cereals: [],
        vegetables: [],
        fruits: []
    });
    const [alerts, setAlerts] = useState();
    const [dataLoading, setDataLoading] = useState(false);
    const [alertsLoading, setAlertsLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setDataLoading(true);
            const startTime = performance.now();
            const result = await fetchAllDataAPI();

            if (result.cereals?.success && result.vegetables?.success && result.fruits?.success) {
                setData(result);
                const endTime = performance.now();
                console.log("Time(data fetch):", (endTime - startTime) / 1000, "s");
            } else {
                setData(
                    {
                        cereals: [],
                        vegetables: [],
                        fruits: []
                    }
                );
            }
        } catch (error) {
            console.error(error);
            setData(
                {
                    cereals: [],
                    vegetables: [],
                    fruits: []
                }
            );
        } finally {
            setDataLoading(false);
        }
    }, []);

    const fetchAlerts = useCallback(async () => {
        try {
            setAlertsLoading(true);
            const startTime = performance.now();
            const result = await fetchAlertsAPI();

            if (result?.success) {
                setAlerts(result.alerts || []);
                const endTime = performance.now();
                console.log("Time(alerts fetch):", (endTime - startTime) / 1000, "s");
            } else {
                setAlerts(null);
            }
        } catch (error) {
            console.error(error);
            setAlerts(null);
        } finally {
            setAlertsLoading(false);
        }
    }, []);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;

        Promise.all([fetchData(), fetchAlerts()]);
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
    );
};

export default DataProvider;

