import Movie from '../models/movie.js';
import nanoid from 'nanoid';

const DEFAULT_COMMENT_AUTHOR = `Sergey Startsev`;

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

  updateMovie(movie) {
    if (this._isOnLine()) {
      return this._api.updateMovie(movie)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, newMovie.toRAW());

          return newMovie;
        });
    }
    this._isSynchronized = false;
    this._store.setItem(movie.id, Object.assign({}, movie.toRAW(), {offline: true}));

    return Promise.resolve(Movie.parseMovie(movie.toRAW()));
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
    if (this._isOnLine()) {
      return this._api.addComment(movieId, comment)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, updatedMovie.toRAW());

          return updatedMovie;
        });
    }
    this._isSynchronized = false;

    const storeMovies = this._store.getAll();
    const storeMovie = storeMovies[movieId];

    const fakeNewCommentId = nanoid();
    const fakeNewComment = Object.assign({}, comment, {id: fakeNewCommentId, author: DEFAULT_COMMENT_AUTHOR, offline: true, type: `add`});

    storeMovie.comments.push(fakeNewComment.id);
    storeMovie.commentsFull.push(fakeNewComment);

    const movie = Movie.parseMovie(storeMovie);
    movie.setComments(storeMovie.commentsFull);

    this._store.setItem(movieId, Object.assign({}, movie, {offline: true}));

    return Promise.resolve(movie);
  }

  deleteComment(id) {
    const store = this._store.getAll();
    const updateMovie = Object.values(store).find(({commentsFull}) => commentsFull.some((comment) => comment.id === id));
    const comments = updateMovie.comments;
    const commentsFull = updateMovie.commentsFull;
    const indexComment = commentsFull.findIndex((comment) => comment.id === id);

    if (this._isOnLine()) {
      return this._api.deleteComment(id)
        .then(() => {
          updateMovie.comments = [...comments.slice(0, indexComment), ...comments.slice(indexComment + 1)];
          updateMovie.commentsFull = [...commentsFull.slice(0, indexComment), ...commentsFull.slice(indexComment + 1)];
          this._store.setItem(updateMovie.id, updateMovie);
          return updateMovie;
        });
    }
    this._isSynchronized = false;

    updateMovie.comments = [...comments.slice(0, indexComment), ...comments.slice(indexComment + 1)];
    updateMovie.commentsFull = [...commentsFull.slice(0, indexComment), ...commentsFull.slice(indexComment + 1)];
    updateMovie.deletedComments = updateMovie.deletedComments || [];
    if (!comments[indexComment].offline) {
      updateMovie.deletedComments.push(commentsFull[indexComment]);
    }

    this._store.setItem(updateMovie.id, Object.assign({}, updateMovie, {offline: true}));

    return Promise.resolve(updateMovie);
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
