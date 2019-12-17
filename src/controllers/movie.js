import FilmComponent from '../components/film.js';
import FilmPopupComponent from '../components/film-popup.js';
import CommentsComponent from '../components/comments.js';

import {generateComments} from '../mock/comment.js';
import {render, remove} from '../utils/render.js';

export default class Movie {
  constructor(container, onDataChange) {
    this._container = container;
    this._filmComments = [];
    this._onDataChange = onDataChange;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._commentsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._openPopup = this._openPopup.bind(this);
  }

  render(film) {
    this._filmComponent = new FilmComponent(film);
    this._filmPopupComponent = new FilmPopupComponent(film);

    this._filmComments = generateComments(film.comments);

    this._filmComponent.setOpenDetailHandler(this._openPopup);
    this._filmComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isNeedWatch: !film.isNeedWatch
      }));
    });
    this._filmComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatch: !film.isWatch
      }));
    });
    this._filmComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite
      }));
    });

    this._filmPopupComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isNeedWatch: !film.isNeedWatch
      }));
    });
    this._filmPopupComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isWatch: !film.isWatch
      }));
    });
    this._filmPopupComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, film, Object.assign({}, film, {
        isFavorite: !film.isFavorite
      }));
    });

    render(this._container, this._filmComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
    }
  }

  _closePopup() {
    remove(this._filmPopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _openPopup() {
    render(document.querySelector(`body`), this._filmPopupComponent);

    const popupBottomElement = this._filmPopupComponent.getElement().querySelector(`.form-details__bottom-container`);
    this._commentsComponent = new CommentsComponent(this._filmComments);
    render(popupBottomElement, this._commentsComponent);

    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._filmPopupComponent.setClickCloseHandler(this._closePopup);
  }
}
