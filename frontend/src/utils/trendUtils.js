export const getTrend = (current, previous) => {
  if (previous == null) return "unknown";

  const diff = current - previous;

  if (diff > 0) return "rising";
  if (diff < 0) return "falling";
  return "stable";
};

export const getTrendWithPercent = (current, previous) => {
  if (!previous) return null;

  const diff = current - previous;
  const percent = (diff / previous) * 100;

  return {
    diff,
    percent,
    trend: getTrend(current, previous),
  };
};