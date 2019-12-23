import {FilterType} from "../const.js";

const getWatchlistMovies = (films) => films.filter((film) => film.isNeedWatch);

const getHistoryMovies = (films) => films.filter((film) => film.isWatch);

const getFavoriteMovies = (films) => films.filter((film) => film.isFavorite);

export const getMovieByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return getWatchlistMovies(films);
    case FilterType.HISTORY:
      return getHistoryMovies(films);
    case FilterType.FAVORITES:
      return getFavoriteMovies(films);
    case FilterType.ALL:
    default:
      return films;
  }
};
