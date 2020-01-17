export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  updateMovie(id, movie) {
    this._api.updateMovie(id, movie);
  }

  getMovies() {
    this._api.getMovies();
  }

  getComments(movieId) {
    this._api.getComments(movieId);
  }

  addComment(movieId, comment) {
    this._api.addComment(movieId, comment);
  }

  deleteComment(id) {
    this._api.deleteComment(id);
  }
}
