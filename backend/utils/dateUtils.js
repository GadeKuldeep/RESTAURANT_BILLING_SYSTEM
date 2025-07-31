export const getFormattedDate = () => {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
};

export const getCurrentTime = () => {
  return new Date().toTimeString().split(" ")[0]; // HH:MM:SS
};
