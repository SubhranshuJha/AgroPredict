// export const sortData = (...) => { ... };

export const sortData = (data, sortBy, order = 1) => {
  return [...data].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // Handle Date
    if (sortBy === "date") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    // Handle string
    if (typeof valA === "string") {
      return order === 1
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    // Handle number
    return order === 1 ? valA - valB : valB - valA;
  });
};