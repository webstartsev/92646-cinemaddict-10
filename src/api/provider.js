import Movie from '../models/movie.js';
import nanoid from 'nanoid';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getMovies() {
    if (this._isOnLine()) {
      return this._api.getMovies()
        .then((movies) => {
          movies.forEach((movie) => this._store.setItem(movie.id, movie.toRAW()));
          return movies;
        });
    }
    this._isSynchronized = false;

    const storeMovies = Object.values(this._store.getAll());
    return Promise.resolve(Movie.parseMovies(storeMovies));
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


  // getComments(movie) {
  //   if (this._isOnLine()) {
  //     return this._api.getComments(movie)
  //       .then((comments) => {
  //         const store = this._store.getAll();
  //         const movieCommments = {[movie.id]: comments};
  //         this._store.setItem(`comments`, Object.assign({}, store.comments, movieCommments));

  //         return comments;
  //       });
  //   }
  //   this._isSynchronized = false;

  //   const store = this._store.getAll();
  //   return Promise.resolve(store.comments[movieId]);
  // }

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
    const fakeNewComment = Object.assign({}, comment, {id: fakeNewCommentId, offline: true, type: `add`});

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

    if (indexComment === null || indexMovie === null) {
      return Promise.reject();
    }

    if (this._isOnLine()) {
      return this._api.deleteComment(id)
        .then(() => {
          this._store.removeItem(`comments`, indexMovie, indexComment);
        });
    }
    this._isSynchronized = false;
    store.comments[indexMovie][indexComment] = Object.assign({}, store.comments[indexMovie][indexComment], {offline: true, type: `delete`});
    this._store.setItem(`comments`, Object.assign({}, store.comments));

    return Promise.resolve();
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  sync() {
    if (this._isOnLine()) {
      const store = this._store.getAll();
      const storeMovies = store.movies;
      const storeComments = store.comments;

      return this._syncComments(storeComments)
        .then(() => this._syncFilms(storeMovies))
        .then(() => {
          this._isSynchronized = true;
          return Promise.resolve();
        });

    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  _syncComments(storeComments) {
    let commentsPromises = [];
    for (const key in storeComments) {
      if (storeComments[key]) {
        commentsPromises = storeComments[key]
          .filter((comment) => comment.offline)
          .map((comment) => {
            switch (comment.type) {
              case `add`:
                return this.addComment(key, comment);
              case `delete`:
              default:
                return this.deleteComment(comment.id);
            }
          });
      }
    }

    return Promise.all(commentsPromises);
  }

  _syncFilms(storeMovies) {
    const movies = Object.values(storeMovies);
    return this._api.sync(movies)
      .then((updateMovies) => {
        const rawMovies = updateMovies.map((movie) => movie.toRAW());
        this._store.setItem(`movies`, Object.assign({}, rawMovies));
      });
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
