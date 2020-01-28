import {FilterType} from "../const.js";
import {getWatchlistMovies, getHistoryMovies, getFavoriteMovies} from './movie.js';

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
