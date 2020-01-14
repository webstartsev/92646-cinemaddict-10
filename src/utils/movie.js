import moment from 'moment';

export const getYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const getDuration = (time) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  return {
    hours,
    minutes
  };
};
