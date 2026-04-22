import axios from 'axios';

const backEndUrl = import.meta.env.VITE_BACKEND_URL;

export const fetchAllDataAPI = async () => {
    const types = ["cereals", "vegetables", "fruits"];

    const responses = await Promise.all(
        types.map(type => axios.get(`${backEndUrl}/api/predict/${type}`))
    );

    return {
        cereals: responses[0].data,
        vegetables: responses[1].data,
        fruits: responses[2].data
    };
};

export const fetchAlertsAPI = async () => {
    const res = await axios.get(`${backEndUrl}/api/alerts`);
    return res.data;
};