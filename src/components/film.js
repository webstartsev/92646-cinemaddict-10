import AbstractComponent from './abstract-component.js';

const createFilmTemplate = (film) => {
  const {title, description, poster, rating, year, duration, genres, comments} = film;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.slice(1, 100)}...</p>
      <a class="film-card__comments">${comments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Film extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
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
}

