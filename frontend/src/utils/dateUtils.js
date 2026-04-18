export const formatDate = (date, format = "short") => {
  const d = new Date(date);

  if (format === "short") {
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  if (format === "full") {
    return d.toLocaleDateString("en-IN");
  }

  return d.toISOString().split("T")[0];
};