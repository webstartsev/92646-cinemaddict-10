import FilmComponent from '../components/film.js';
import FilmPopupComponent from '../components/film-popup.js';
import CommentsComponent from '../components/comments.js';

import {render, remove, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  OPEN: `open`,
};

export default class Movie {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._commentsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._openPopup = this._openPopup.bind(this);
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmPopupComponent = this._filmPopupComponent;

    this._prepeareFilm(film);
    this._prepearPopup(film);

    if (oldFilmComponent && oldFilmPopupComponent) {
      replace(this._filmComponent, oldFilmComponent);
      replace(this._filmPopupComponent, oldFilmPopupComponent);
    } else {
      render(this._container, this._filmComponent);
    }
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

    // Comment
    const popupBottomElement = this._filmPopupComponent.getElement().querySelector(`.form-details__bottom-container`);
    this._commentsComponent = new CommentsComponent(film.comments);
    render(popupBottomElement, this._commentsComponent);
  }

  _closePopup() {
    this._mode = Mode.DEFAULT;
    remove(this._filmPopupComponent);
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
