// export const filterData = (...) => { ... };
// export const filterByRange = (...) => { ... };

export const filterData = (data, filters) => {
  return data.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === "") return true;
      return String(item[key])
        .toLowerCase()
        .includes(String(value).toLowerCase());
    });
  });
};


export const filterByRange = (data, key, min, max) => {
  return data.filter((item) => {
    const value = item[key];

    if (min != null && value < min) return false;
    if (max != null && value > max) return false;

    return true;
  });
};

// Usage: 1.  filterData(data, { commodity: "onion" });
//        2.  filterData(data, { date: "2026-03-20", commodity: "mint" });