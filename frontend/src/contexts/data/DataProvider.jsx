import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DataContext } from './dataContext';
import { fetchAllDataAPI, fetchAlertsAPI } from './dataAxiosService';



const DATA_KEY = "market_data";
const ALERTS_KEY = "market_alerts";
const CACHE_TIME = 1000 * 60 * 30;   // 30 min
const EMPTY_DATA = {
    cereals: [],
    vegetables: [],
    fruits: [],
};
const DataProvider = ({ children }) => {
    const [data, setData] = useState(() => {
        const cached = localStorage.getItem(DATA_KEY);

       if (!cached) {
        return {
            cereals: [],
            vegetables: [],
            fruits: [],
        };
    }

    try {
        const parsed = JSON.parse(cached);

        const isExpired =
            Date.now() - parsed.timestamp > CACHE_TIME;

        if (isExpired) {
            localStorage.removeItem(DATA_KEY);

            return {
                cereals: [],
                vegetables: [],
                fruits: [],
            };
        }

        return parsed.data;
    } catch (err) {
        localStorage.removeItem(DATA_KEY);
        console.log("ERROR::DataProvider.jsx::",err)
        return {
            cereals: [],
            vegetables: [],
            fruits: [],
        };
    }
    });
  const [alerts, setAlerts] = useState(() => {
    const cached = localStorage.getItem(ALERTS_KEY);

    if (!cached) return [];

    try {
        const parsed = JSON.parse(cached);

        if (Date.now() - parsed.timestamp > CACHE_TIME) {
            localStorage.removeItem(ALERTS_KEY);
            return [];
        }

        return parsed.data;
    } catch {
        localStorage.removeItem(ALERTS_KEY);
        return [];
    }
});
    const [dataLoading, setDataLoading] = useState(false);
    const [alertsLoading, setAlertsLoading] = useState(false);

   const fetchData = useCallback(async () => {
    try {
        setDataLoading(true);

        const result = await fetchAllDataAPI();

        if (
            result.cereals?.success &&
            result.vegetables?.success &&
            result.fruits?.success
        ) {
            setData(result);

            localStorage.setItem(
                DATA_KEY,
                JSON.stringify({
                    timestamp: Date.now(),
                    data: result,
                })
            );
        } else {
            setData(EMPTY_DATA);
        }
    } catch (err) {
        console.error(err);
        setData(EMPTY_DATA);
    } finally {
        setDataLoading(false);
    }
}, []);
 const fetchAlerts = useCallback(async () => {
    try {
        setAlertsLoading(true);

        const result = await fetchAlertsAPI();

        if (result?.success) {
            const alerts = result.alerts || [];

            setAlerts(alerts);

            localStorage.setItem(
                ALERTS_KEY,
                JSON.stringify({
                    timestamp: Date.now(),
                    data: alerts,
                })
            );
        } else {
            setAlerts([]);
        }
    } catch (err) {
        console.error(err);
        setAlerts([]);
    } finally {
        setAlertsLoading(false);
    }
}, []);

    const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    if (!localStorage.getItem(DATA_KEY)) {
        fetchData();
    }

    if (!localStorage.getItem(ALERTS_KEY)) {
        fetchAlerts();
    }
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

