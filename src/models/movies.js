import {FilterType} from "../const.js";
import {getMovieByFilter} from "../utils/filter.js";

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = FilterType.ALL;

    this._filterChangeHandlers = [];
  }

  getAllMovies() {
    return this._movies;
  }

  getMovies() {
    return getMovieByFilter(this._movies, this._activeFilterType);
  }

  setMovies(films) {
    this._movies = Array.from(films);
  }

  updateMovie(id, film) {

  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
