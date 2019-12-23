export default class Movies {
  constructor() {
    this._movies = [];
  }

  getMovies() {
    return this._movies;
  }

  setMovies(films) {
    this._movies = Array.from(films);
  }

  updateMovie(id, film) {

  }
}
