import moment from 'moment';

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomFloatNumber = (min, max) => {
  return (Math.random() * (max - min) + min).toFixed(1);
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm A`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const isSubmitPressed = (evt) => {
  return evt.ctrlKey && (evt.key === `Enter` || evt.key === `Ent`);
};
