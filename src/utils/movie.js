import moment from 'moment';

export const getWatchlistMovies = (films) => films.filter((film) => film.isNeedWatch);
export const getHistoryMovies = (films) => films.filter((film) => film.isWatch);
export const getFavoriteMovies = (films) => films.filter((film) => film.isFavorite);

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
