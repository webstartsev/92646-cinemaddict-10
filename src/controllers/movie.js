import FilmComponent from '../components/film.js';
import FilmPopupComponent from '../components/film-popup.js';
import CommentsComponent from '../components/comments.js';
import UserRatingComponent from '../components/user-rating.js';
import CountCommentsComponent from "../components/count-comments.js";
import CommentController from "../controllers/comment.js";
import CommentsModel from "../models/comments.js";
import MovieModel from "../models/movie.js";
import Comment from "../models/comment.js";

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

  handleError(type) {
    switch (type) {
      case `comment`:
        this._commentsComponent.setErrorTextArea();
        this._commentsComponent
          .shake()
          .then(() => this._commentsComponent.activateForm());
        break;
      case `rating`:
        this._userRatingComponent.setErrorInput();
        this._userRatingComponent.shake();
        break;
      default:
        if (this._mode === Mode.OPEN) {
          this._filmPopupComponent
            .shake()
            .then(() => {
              this.render(this._film);
            });
        } else {
          this._filmComponent
            .shake()
            .then(() => {
              this.render(this._film);
            });
        }
        break;
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

  _prepeareFilm() {
    this._filmComponent = new FilmComponent(this._film);

    this._filmComponent.setOpenDetailHandler(() => this._openPopup(this._film));
    this._filmComponent.setWatchlistClickHandler(() => {
      this._filmComponent.disabledForm();
      const newMovie = MovieModel.clone(this._film);
      newMovie.isNeedWatch = !newMovie.isNeedWatch;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmComponent.setWatchedClickHandler(() => {
      this._filmComponent.disabledForm();
      const newMovie = MovieModel.clone(this._film);
      newMovie.dateWatched = new Date();
      newMovie.isWatch = !newMovie.isWatch;
      newMovie.personalRating = 0;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmComponent.setFavoriteClickHandler(() => {
      this._filmComponent.disabledForm();
      const newMovie = MovieModel.clone(this._film);
      newMovie.isFavorite = !newMovie.isFavorite;

      this._onDataChange(this, this._film, newMovie);
    });
  }

  _prepearPopup() {
    this._filmPopupComponent = new FilmPopupComponent(this._film);

    this._filmPopupComponent.setClickCloseHandler(this._closePopup);
    this._filmPopupComponent.setWatchlistClickHandler(() => {
      this._filmPopupComponent.disabledForm();
      const newMovie = MovieModel.clone(this._film);
      newMovie.isNeedWatch = !newMovie.isNeedWatch;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmPopupComponent.setWatchedClickHandler(() => {
      this._filmPopupComponent.disabledForm();
      this._userRatingComponent.disabledInputs();
      const newMovie = MovieModel.clone(this._film);
      newMovie.dateWatched = new Date();
      newMovie.isWatch = !newMovie.isWatch;
      newMovie.personalRating = 0;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmPopupComponent.setFavoriteClickHandler(() => {
      this._filmPopupComponent.disabledForm();
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
      this._userRatingComponent.disabledForm();
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

  _renderComments(comments) {
    this._popupBottomElement = this._filmPopupComponent.getElement().querySelector(`.form-details__bottom-container`);
    this._commentsComponent = new CommentsComponent();

    this._commentsComponent.setFormSumbitHandler(() => {
      const newComment = new Comment(this._commentsComponent.getData());
      this._commentsComponent.disabledForm();

      this._onDataChange(this, this._film, newComment, `comment`);
    });

    this._commentsComponent.setClickEmojiHandler();

    const commentsWrapElement = this._commentsComponent.getElement();
    this._countCommentsComponent = new CountCommentsComponent(comments.length);

    render(this._popupBottomElement, this._commentsComponent);
    render(commentsWrapElement, this._countCommentsComponent, RenderPosition.AFTERBEGIN);

    const commentListElement = this._commentsComponent.getElement().querySelector(`.film-details__comments-list`);
    const newComment = comments.map((comment) => {
      const commentController = new CommentController(commentListElement, this._onDataChange, this._commentsModel);
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

  updateComments(comments) {
    this._removeComents();
    this._renderComments(comments);
  }

  _closePopup() {
    this._onViewChange(null);
    this._mode = Mode.DEFAULT;
    remove(this._filmPopupComponent);
    remove(this._commentsComponent);
    remove(this._countCommentsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _openPopup(film) {
    this._onViewChange(this);
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
