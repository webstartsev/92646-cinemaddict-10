import AbstarctSmartComponent from './abstract-smart-component.js';
import debounce from 'lodash/debounce';
import {DEBOUNCE_TIMEOUT} from '../const.js';

const Description = {
  MIN: 1,
  MAX: 140
};

const checkDescriptionLength = (description) => {
  if (description.length >= Description.MAX) {
    return `${description.slice(Description.MIN, Description.MAX)}...`;
  }

  return description;
};

const createGenresMarkup = (genre) => {
  return (
    `<span class="film-details__genre">${genre}</span>`
  );
};

const createFilmPopupTemplate = (film) => {
  const {title, poster, rating, duration, genres, director, writers, actors, releaseDate, country, ratingPlus, isNeedWatch, isWatch, isFavorite} = film;
  const genresMarkup = genres.map((genre) => createGenresMarkup(genre)).join(`\n`);

  const description = checkDescriptionLength(film.description);

  return (
    `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ratingPlus}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              ${writers.length ? `<tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(`, `)}</td>
              </tr>` : ``}
              ${actors.length ? `<tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(`, `)}</td>
              </tr>` : ``}
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              ${genres.length ? `<tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
                <td class="film-details__cell">
                  ${genresMarkup}
              </tr>` : ``}
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isNeedWatch ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatch ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>
    </form>
    <div class="form-details__middle-container">
    </div>
    <div class="form-details__bottom-container">
    </div>
  </section>`
  );
};

export default class FilmPopup extends AbstarctSmartComponent {
  constructor(film) {
    super();

    this._film = film;
    this._isDisabled = false;
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film);
  }

  setClickCloseHandler(handler) {
    const popupCloseBtn = this.getElement().querySelector(`.film-details__close-btn`);
    popupCloseBtn.addEventListener(`click`, handler);
  }

  setWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (this._isDisabled) {
        return;
      }

      debounce(handler, DEBOUNCE_TIMEOUT)();
    });
  }

  setWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (this._isDisabled) {
        return;
      }

      debounce(handler, DEBOUNCE_TIMEOUT)();
    });
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (this._isDisabled) {
        return;
      }

      debounce(handler, DEBOUNCE_TIMEOUT)();
    });
  }

  disabledForm() {
    this._isDisabled = true;
    [...this.getElement().querySelectorAll(`.film-details__control-input`)]
      .forEach((element) => {
        element.disabled = true;
      });
  }

  activateForm() {
    this._isDisabled = false;
    [...this.getElement().querySelectorAll(`.film-details__control-input`)]
      .forEach((element) => {
        element.disabled = false;
      });
  }

  recoveryListeners() {

  }
}
