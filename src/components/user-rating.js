import AbstractComponent from './abstract-component.js';

const LENGTH_RATING = 9;

const createRatingMarkup = (personalRating) => {
  const markup = [];
  for (let index = 1; index <= LENGTH_RATING; index++) {
    const isChecked = (personalRating === index) ? `checked` : ``;
    markup.push(
        `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${index}" id="rating-${index}" ${isChecked}>
        <label class="film-details__user-rating-label" for="rating-${index}">${index}</label>`
    );
  }

  return markup.join(``);
};

const createUserRatingTemplate = (film) => {
  const {poster, title} = film;
  const ratingInputs = createRatingMarkup(film.personalRating);

  return (
    `<section class="film-details__user-rating-wrap">
      <div class="film-details__user-rating-controls">
        <button class="film-details__watched-reset" type="button">Undo</button>
      </div>

      <div class="film-details__user-score">
        <div class="film-details__user-rating-poster">
          <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
        </div>

        <section class="film-details__user-rating-inner">
          <h3 class="film-details__user-rating-title">${title}</h3>

          <p class="film-details__user-rating-feelings">How you feel it?</p>

          <form action="" method="get" class="film-details__user-rating-score">
            ${ratingInputs}
          </form>
        </section>
      </div>
    </section>`
  );
};

export default class UserRating extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
    this._errorInput = null;
  }
  getTemplate() {
    return createUserRatingTemplate(this._film);
  }

  disabledInputs() {
    const ratingBtns = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    ratingBtns.forEach((button) => {
      button.disabled = true;
    });
  }

  activateInputs() {
    const ratingBtns = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    ratingBtns.forEach((button) => {
      button.disabled = false;
    });
  }

  setChangeRatingHandler(handler) {
    const ratingBtns = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    ratingBtns.forEach((button) => button.addEventListener(`change`, (evt) => {
      this._errorInput = evt.target;
      handler(evt.target.value);
    }));
  }

  removeUserRationgHandler(handler) {
    this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, handler);
  }

  setErrorInput() {
    this._errorInput.classList.add(`film-details__user-rating-input_error`);
  }

  removeErrorInputs() {
    const ratingBtns = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    ratingBtns.forEach((button) => button.classList.remove(`film-details__user-rating-input_error`));
  }
}
