export const zeroPadding = (number: number, length: number): string => {
  return (Array(length).join('0') + number).slice(-length);
};

export const getDayFormat = (date = new Date()): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

export const getTimeFormat = (hour: number, minute: number): string => {
  return `${zeroPadding(hour, 2)}:${zeroPadding(minute, 2)}`;
};

export const getDateFormat = (date = new Date()): string => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${getDayFormat(date)} ${getTimeFormat(hour, minute)}`;
};
