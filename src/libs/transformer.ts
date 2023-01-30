import dayjs from 'dayjs';

export const StringToDate = (date: string): Date => {
  return new Date(dayjs(date).format('YYYY-MM-DD'));
};

export const StringToDateTime = (date: string): Date => {
  return date ? new Date(dayjs(date).format('YYYY-MM-DD hh:mm')) : null;
};

export const GetAge = (birthdate: Date): Number => {
  const today = new Date();
  const yearDiff = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  const dateDiff = today.getDate() - birthdate.getDate();

  const isBeforeBirthDay = monthDiff < 0 || (monthDiff === 0 && dateDiff < 0);

  return yearDiff + (isBeforeBirthDay ? -1 : 0);
};
