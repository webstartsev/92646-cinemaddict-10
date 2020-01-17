import Movie from '../models/movie.js';
import nanoid from 'nanoid';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  updateMovie(id, movie) {
    const store = this._store.getAll();

    if (this._isOnLine()) {
      return this._api.updateMovie(id, movie)
        .then((newMovie) => {
          const rawMovie = {[newMovie.id]: newMovie.toRAW()};
          this._store.setItem(`movies`, Object.assign({}, store.movies, rawMovie));

          return newMovie;
        });
    }

    const fakeUpdateMovie = Movie.parseMovie(Object.assign({}, movie.toRAW(), {id}));
    store.movies[id] = Object.assign({}, fakeUpdateMovie.toRAW(), {offline: true});
    this._store.setItem(`movies`, store.movies);

    return Promise.resolve(fakeUpdateMovie);
  }

  getMovies() {
    if (this._isOnLine()) {
      return this._api.getMovies()
        .then((movies) => {
          const rawMovies = movies.map((movie) => movie.toRAW());
          this._store.setItem(`movies`, Object.assign({}, rawMovies));

          return movies;
        });
    }
    const store = this._store.getAll();
    const movies = Object.values(store.movies);

    return Promise.resolve(Movie.parseMovies(movies));
  }

  getComments(movieId) {
    const store = this._store.getAll();
    if (this._isOnLine()) {
      return this._api.getComments(movieId)
        .then((comments) => {
          const movieCommments = {[movieId]: comments};
          this._store.setItem(`comments`, Object.assign({}, store.comments, movieCommments));

          return comments;
        });
    }

    return Promise.resolve(store.comments[movieId]);
  }

  addComment(movieId, comment) {
    const store = this._store.getAll();

    if (this._isOnLine()) {
      return this._api.addComment(movieId, comment)
        .then((newComment) => {
          store.comments[movieId] = Object.assign({}, newComment.comments);
          this._store.setItem(`comments`, store.comments);

          return newComment;
        });
    }
    const fakeNewCommentId = nanoid();
    const fakeNewComment = Object.assign({}, comment, {id: fakeNewCommentId, offline: true});

    const comments = [...store.comments[movieId], fakeNewComment];
    this._store.setItem(`comments`, Object.assign({}, store.comments, {[movieId]: comments}));

    return Promise.resolve({movie: store.movies[movieId], comments});
  }

  deleteComment(id) {
    console.log('id: ', id);
    if (this._isOnLine()) {
      return this._api.deleteComment(id)
        .then(() => {
          this._store.removeItem(id);
        });
    }

    const store = this._store.getAll();

    console.log(store.comments);

  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
