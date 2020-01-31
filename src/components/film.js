import AbstractComponent from './abstract-component.js';
import debounce from 'lodash/debounce';
import {DEBOUNCE_TIMEOUT} from '../const.js';

const Description = {
  MIN: 1,
  MAX: 100
};

const createFilmTemplate = (film) => {
  const {title, description, poster, rating, year, duration, genres, comments, isNeedWatch, isWatch, isFavorite} = film;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        ${genres.length ? `<span class="film-card__genre">${genres[0]}</span>` : ``}
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.slice(Description.MIN, Description.MAX)}...</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isNeedWatch ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatch ? `film-card__controls-item--active` : ``}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Film extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
    this._isDisabled = false;
  }

  getTemplate() {
    return createFilmTemplate(this._film);
  }

  setOpenDetailHandler(handler) {
    const filmPosterElement = this.getElement().querySelector(`.film-card__poster`);
    const filmTitleElement = this.getElement().querySelector(`.film-card__title`);
    const filmCommentsElement = this.getElement().querySelector(`.film-card__comments`);

    filmPosterElement.addEventListener(`click`, handler);
    filmTitleElement.addEventListener(`click`, handler);
    filmCommentsElement.addEventListener(`click`, handler);
  }

  setWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (this._isDisabled) {
        return;
      }

      debounce(handler, DEBOUNCE_TIMEOUT)();
    });
  }

  setWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (this._isDisabled) {
        return;
      }

      debounce(handler, DEBOUNCE_TIMEOUT)();
    });
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (this._isDisabled) {
        return;
      }

      debounce(handler, DEBOUNCE_TIMEOUT)();
    });
  }

  disabledForm() {
    this._isDisabled = true;
    [...this.getElement().querySelectorAll(`.film-card__controls-item`)]
      .forEach((element) => {
        element.disabled = true;
      });
  }

  activateForm() {
    this._isDisabled = false;
    [...this.getElement().querySelectorAll(`.film-card__controls-item`)]
      .forEach((element) => {
        element.disabled = false;
      });
  }
}

