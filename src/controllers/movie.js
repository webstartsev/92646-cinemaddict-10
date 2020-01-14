import FilmComponent from '../components/film.js';
import FilmPopupComponent from '../components/film-popup.js';
import CommentsComponent from '../components/comments.js';
import UserRatingComponent from '../components/user-rating.js';
import CountCommentsComponent from "../components/count-comments.js";
import CommentController from "../controllers/comment.js";
import CommentsModel from "../models/comments.js";
import MovieModel from "../models/movie.js";

import {render, remove, replace, RenderPosition} from '../utils/render.js';
import {isSubmitPressed} from "../utils/utils.js";

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
    this._onSubmitForm = this._onSubmitForm.bind(this);

    this._commentsModel.setCommentChangeHandler(this._onCommentChange);
  }

  render(film) {
    this._film = film;
    const oldFilmComponent = this._filmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;

    this._api.getComments(this._film.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
      });

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

  _prepeareFilm() {
    this._filmComponent = new FilmComponent(this._film);

    this._filmComponent.setOpenDetailHandler(() => this._openPopup(this._film));
    this._filmComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();

      const newMovie = MovieModel.clone(this._film);
      newMovie.isNeedWatch = !newMovie.isNeedWatch;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();

      const newMovie = MovieModel.clone(this._film);
      newMovie.dateWatched = new Date();
      newMovie.isWatch = !newMovie.isWatch;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();

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
      newMovie.dateWatched = (newMovie.dateWatched ? null : new Date());
      newMovie.isWatch = !newMovie.isWatch;

      this._onDataChange(this, this._film, newMovie);
    });
    this._filmPopupComponent.setFavoriteClickHandler(() => {
      const newMovie = MovieModel.clone(this._film);
      newMovie.isFavorite = !newMovie.isFavorite;

      this._onDataChange(this, this._film, newMovie);
    });

    if (this._film.isWatch) {
      const popupMiddleElement = this._filmPopupComponent.getElement().querySelector(`.form-details__middle-container`);
      this._userRatingComponent = new UserRatingComponent(this._film);
      render(popupMiddleElement, this._userRatingComponent);
    }
  }

  _onSubmitForm(evt) {
    if (isSubmitPressed(evt)) {
      this._filmPopupComponent.setFormSumbitHandler(() => {
        const data = this._filmPopupComponent.getData();
        this._commentsModel.addComment(data);

        const comments = this._commentsModel.getComments();
        this._film.comments = comments;
        this._movieModel.updateMovie(this._film.id, this._film);

        this._updateComments(comments);
      });
    }
  }

  _onCommentChange(commentController, oldData, newData) {
    if (newData === null) {
      commentController.destroy();
      this._commentsModel.removeComment(oldData);

      const comments = this._commentsModel.getComments();
      this._film.comments = comments;
      this._movieModel.updateMovie(this._film.id, this._film);
    }

    this._updateComments();
  }

  _renderComments(comments) {
    this._popupBottomElement = this._filmPopupComponent.getElement().querySelector(`.form-details__bottom-container`);
    this._commentsComponent = new CommentsComponent();

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

  _updateComments() {
    const comments = this._commentsModel.getComments();
    this._removeComents();
    this._renderComments(comments);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    remove(this._filmPopupComponent);
    remove(this._commentsComponent);
    remove(this._countCommentsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onSubmitForm);
  }

  _openPopup(film) {
    this._onViewChange();
    this._mode = Mode.OPEN;

    if (!this._filmPopupComponent._element) {
      this._prepearPopup(film);
    }

    // Comment
    const comments = this._commentsModel.getComments();
    this._renderComments(comments);

    render(document.querySelector(`body`), this._filmPopupComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    document.addEventListener(`keydown`, this._onSubmitForm);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }
}
