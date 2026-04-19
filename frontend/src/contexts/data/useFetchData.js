import { useContext } from 'react';
import { DataContext } from './dataContext';

export const useFetchData = () => {
    return useContext(DataContext);
};