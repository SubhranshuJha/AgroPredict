import { filterData } from "./filter";
import { sortData } from "./sort";

export const processData = (
    {
        data = [],
        filters = {},
        sortBy,
        order = 1,
    }
) => {
    let result = Array.isArray(data) ? [...data] : [];

    // filter
    result = filterData(result, filters);

    // sort
    if (sortBy) {
        result = sortData(result, sortBy, order);
    }

    return result;
};



//  data,
// filters = {},
// sortBy,
// order = 1,
// const rawPredictions = filterData(data?.predictions || [], { commodity: commodityName.trim() })
// const rawPredictions = processData(data?.predictions||[],{commodity: commodityName.trim()},date,1)