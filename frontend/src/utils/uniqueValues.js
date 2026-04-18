export const getUniqueValues = (data, key) => {
  return [...new Set(data.map(item => item[key]))];
};
