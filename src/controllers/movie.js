import FilmComponent from '../components/film.js';
import FilmPopupComponent from '../components/film-popup.js';
import CommentsComponent from '../components/comments.js';
import UserRatingComponent from '../components/user-rating.js';
import CountCommentsComponent from "../components/count-comments.js";
import CommentController from "../controllers/comment.js";
import CommentsModel from "../models/comments.js";
import MovieModel from "../models/movie.js";

import {SHAKE_ANIMATION_TIMEOUT} from "../const.js";
import {render, remove, replace, RenderPosition} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  OPEN: `open`,
};

export default class Movie {
  constructor(container, onDataChange, onViewChange, movieModel, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._movieModel = movieModel;
    this._api = api;
    this._commentsModel = new CommentsModel();

    this._film = null;
    this._mode = Mode.DEFAULT;
    this._popupBottomElement = null;
    this._showedCommentControllers = [];

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._commentsComponent = null;
    this._countCommentsComponent = null;
    this._userRatingComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._openPopup = this._openPopup.bind(this);
    this._onCommentChange = this._onCommentChange.bind(this);

    this._commentsModel.setCommentChangeHandler(this._onCommentChange);
  }

  getMovie() {
    return this._film;
  }

  render(film) {
    this._film = film;
    const oldFilmComponent = this._filmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;

    this._prepeareFilm();
    this._prepearPopup();

    if (oldFilmComponent && oldFilmPopupComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmPopupComponent, oldFilmPopupComponent);
    } else {
      render(this._container, this._filmComponent);
    }
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
    }
  }

  shake(container) {
    container.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      container.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _prepeareFilm() {
    this._filmComponent = new FilmComponent(this._film);

    this._filmComponent.setOpenDetailHandler(() => this._openPopup(this._film));
    this._filmComponent.setWatchlistClickHandler(() => {
      const newMovie = MovieModel.clone(this._film);
      newMovie.isNeedWatch = !newMovie.isNeedWatch;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmComponent.setWatchedClickHandler(() => {
      const newMovie = MovieModel.clone(this._film);
      newMovie.dateWatched = new Date();
      newMovie.isWatch = !newMovie.isWatch;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmComponent.setFavoriteClickHandler(() => {
      const newMovie = MovieModel.clone(this._film);
      newMovie.isFavorite = !newMovie.isFavorite;

      this._onDataChange(this, this._film, newMovie);
    });
  }

  _prepearPopup() {
    this._filmPopupComponent = new FilmPopupComponent(this._film);

    this._filmPopupComponent.setClickCloseHandler(this._closePopup);
    this._filmPopupComponent.setWatchlistClickHandler(() => {
      const newMovie = MovieModel.clone(this._film);
      newMovie.isNeedWatch = !newMovie.isNeedWatch;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmPopupComponent.setWatchedClickHandler(() => {
      const newMovie = MovieModel.clone(this._film);
      newMovie.dateWatched = new Date();
      newMovie.isWatch = !newMovie.isWatch;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmPopupComponent.setFavoriteClickHandler(() => {
      const newMovie = MovieModel.clone(this._film);
      newMovie.isFavorite = !newMovie.isFavorite;

      this._onDataChange(this, this._film, newMovie);
    });

    this._renderUserRating();

    this._renderComments(this._film.commentsFull);
  }

  _renderUserRating() {
    const popupMiddleElement = this._filmPopupComponent.getElement().querySelector(`.form-details__middle-container`);
    this._userRatingComponent = new UserRatingComponent(this._film);

    this._userRatingComponent.setChangeRatingHandler((userRating) => {
      const newMovie = MovieModel.clone(this._film);
      newMovie.personalRating = parseInt(userRating, 10);

      this._onDataChange(this, this._film, newMovie, `rating`);
    });
    this._userRatingComponent.removeUserRationgHandler(() => {
      const newMovie = MovieModel.clone(this._film);
      newMovie.personalRating = 0;

      this._onDataChange(this, this._film, newMovie, `rating`);
    });

    if (this._film.isWatch) {
      render(popupMiddleElement, this._userRatingComponent);
    }

  }

  _onCommentChange(commentController, oldData, newData) {
    if (newData === null) {
      this._api.deleteComment(oldData.id)
        .then((movieModel) => {
          commentController.destroy();

          this._movieModel.updateMovie(movieModel.id, movieModel);
          this._updateComments(movieModel.commentsFull);

        });
    }
  }

  _renderComments(comments) {
    this._popupBottomElement = this._filmPopupComponent.getElement().querySelector(`.form-details__bottom-container`);
    this._commentsComponent = new CommentsComponent();

    this._commentsComponent.setFormSumbitHandler(() => {
      const data = this._commentsComponent.getData();
      this._commentsComponent.disabledForm();

      this._onDataChange(this, this._film, data, `comment`);
    });

    this._commentsComponent.setClickEmojiHandler();

    const commentsWrapElement = this._commentsComponent.getElement();
    this._countCommentsComponent = new CountCommentsComponent(comments.length);

    render(this._popupBottomElement, this._commentsComponent);
    render(commentsWrapElement, this._countCommentsComponent, RenderPosition.AFTERBEGIN);

    const commentListElement = this._commentsComponent.getElement().querySelector(`.film-details__comments-list`);
    const newComment = comments.map((comment) => {
      const commentController = new CommentController(commentListElement, this._onCommentChange, this._commentsModel);
      commentController.render(comment);

      return commentController;
    });

    this._showedCommentControllers = [...this._showedCommentControllers, ...newComment];
  }

  _removeComents() {
    remove(this._commentsComponent);
    this._showedCommentControllers.forEach((commentController) => commentController.destroy());
    this._showedCommentControllers = [];
  }

  _updateComments(comments) {
    this._removeComents();
    this._renderComments(comments);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    remove(this._filmPopupComponent);
    remove(this._commentsComponent);
    remove(this._countCommentsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _openPopup(film) {
    this._onViewChange();
    this._mode = Mode.OPEN;

    if (!this._filmPopupComponent._element) {
      this._prepearPopup(film);
    }

    render(document.querySelector(`body`), this._filmPopupComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }
}
