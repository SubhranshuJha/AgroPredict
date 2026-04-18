// export const groupBy = (...) => { ... };

export const groupBy = (data, key) => {
  return data.reduce((acc, item) => {
    const groupKey = item[key];

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }

    acc[groupKey].push(item);
    return acc;
  }, {});
};


// Usage: 1.  groupBy(data, "commodity");
//        2.  groupBy(data, "date");

