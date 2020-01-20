import Movie from '../models/movie.js';
import nanoid from 'nanoid';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
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
    this._isSynchronized = false;

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
    this._isSynchronized = false;

    const store = this._store.getAll();
    const movies = Object.values(store.movies);

    return Promise.resolve(Movie.parseMovies(movies));
  }

  getComments(movieId) {
    if (this._isOnLine()) {
      return this._api.getComments(movieId)
        .then((comments) => {
          const store = this._store.getAll();
          const movieCommments = {[movieId]: comments};
          this._store.setItem(`comments`, Object.assign({}, store.comments, movieCommments));

          return comments;
        });
    }
    this._isSynchronized = false;

    const store = this._store.getAll();
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
    this._isSynchronized = false;

    const fakeNewCommentId = nanoid();
    const fakeNewComment = Object.assign({}, comment, {id: fakeNewCommentId, offline: true});

    const comments = [...store.comments[movieId], fakeNewComment];
    this._store.setItem(`comments`, Object.assign({}, store.comments, {[movieId]: comments}));

    return Promise.resolve({movie: store.movies[movieId], comments});
  }

  deleteComment(id) {
    const store = this._store.getAll();
    let indexComment = null;
    let indexMovie = null;

    for (const key in store.comments) {
      if (store.comments[key]) {
        indexMovie = key;
        indexComment = store.comments[key].findIndex((comment) => comment.id === id);
        if (indexComment !== -1) {
          break;
        }
      }
    }

    if (indexComment === null) {
      return Promise.reject();
    }

    if (this._isOnLine()) {
      return this._api.deleteComment(id)
        .then(() => {
          this._store.removeItem(`comments`, indexMovie, indexComment);
        });
    }
    this._isSynchronized = false;

    this._store.removeItem(`comments`, indexMovie, indexComment);

    return Promise.resolve();
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
