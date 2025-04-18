const timeAgo = (utcDateString) => {
  const now = new Date();
  const utcDate = new Date(utcDateString);
  
  // Shift to IST (+5:30 = 330 minutes)
  const istOffset = 330;
  const istDate = new Date(utcDate.getTime() + istOffset * 60000);

  const diff = Math.floor((now - istDate) / 1000);

  if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  if (diff < 3600)
    return `${Math.floor(diff / 60)} minute${
      Math.floor(diff / 60) !== 1 ? "s" : ""
    } ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${
      Math.floor(diff / 3600) !== 1 ? "s" : ""
    } ago`;
  if (diff < 604800)
    return `${Math.floor(diff / 86400)} day${
      Math.floor(diff / 86400) !== 1 ? "s" : ""
    } ago`;

  return istDate.toLocaleDateString("en-IN"); // fallback to date in Indian format
};

export const formatToIST = (utcDate) => {
  return new Date(utcDate).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export default timeAgo;
