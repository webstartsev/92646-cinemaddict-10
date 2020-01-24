import {FilterType} from "../const.js";
import {getMovieByFilter} from "../utils/filter.js";

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = FilterType.ALL;

    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  getAllMovies() {
    return this._movies;
  }

  getMovies() {
    return getMovieByFilter(this._movies, this._activeFilterType);
  }

  setMovies(films) {
    this._movies = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateMovie(id, film) {
    const index = this._getIndexMovieById(id);

    if (index === -1) {
      return false;
    }

    this._movies = [...this._movies.slice(0, index), film, ...this._movies.slice(index + 1)];
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  _getIndexMovieById(id) {
    return this._movies.findIndex((movie) => movie.id === id);
  }
}
