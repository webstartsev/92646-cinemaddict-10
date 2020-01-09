import FilmComponent from '../components/film.js';
import FilmPopupComponent from '../components/film-popup.js';
import CommentsComponent from '../components/comments.js';
import UserRatingComponent from '../components/user-rating.js';
import CountCommentsComponent from "../components/count-comments.js";
import CommentController from "../controllers/comment.js";
import CommentsModel from "../models/comments.js";

import {render, remove, replace, RenderPosition} from '../utils/render.js';
import {isSubmitPressed} from "../utils/utils.js";

const Mode = {
  DEFAULT: `default`,
  OPEN: `open`,
};

export default class Movie {
  constructor(container, onDataChange, onViewChange, movieModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._movieModel = movieModel;
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

    this._commentsModel.setComments(film.comments);

    this._prepeareFilm(this._film);
    this._prepearPopup(this._film);

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

  _prepeareFilm(film) {
    this._filmComponent = new FilmComponent(film);

    this._filmComponent.setOpenDetailHandler(() => this._openPopup(film));
    this._filmComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, this._filmComponent._film, Object.assign({}, this._filmComponent._film, {
        isNeedWatch: !film.isNeedWatch
      }));
    });
    this._filmComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._filmComponent._film, Object.assign({}, this._filmComponent._film, {
        dateWatched: (film.dateWatched ? null : new Date()),
        isWatch: !film.isWatch
      }));
    });
    this._filmComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._filmComponent._film, Object.assign({}, this._filmComponent._film, {
        isFavorite: !film.isFavorite
      }));
    });
  }

  _prepearPopup(film) {
    this._filmPopupComponent = new FilmPopupComponent(film);

    this._filmPopupComponent.setClickCloseHandler(this._closePopup);
    this._filmPopupComponent.setWatchlistClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isNeedWatch: !film.isNeedWatch
      }));
    });
    this._filmPopupComponent.setWatchedClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatch: !film.isWatch
      }));
    });
    this._filmPopupComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite
      }));
    });


    if (film.isWatch) {
      const popupMiddleElement = this._filmPopupComponent.getElement().querySelector(`.form-details__middle-container`);
      this._userRatingComponent = new UserRatingComponent(film);
      render(popupMiddleElement, this._userRatingComponent);
    }

    // Comment
    const comments = this._commentsModel.getComments();
    this._renderComments(comments);
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
