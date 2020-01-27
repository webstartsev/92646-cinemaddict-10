import AbstractComponent from './abstract-component.js';

const FilmExtraTitle = {
  TOP: `Top rated`,
  MOST: `Most commented`
};

const createFilmsTopTemplate = (type) => {
  const extraClass = `films-list--extra-${type}`;

  return (
    `<section class="films-list--extra ${extraClass}">
      <h2 class="films-list__title">${FilmExtraTitle[type.toUpperCase()]}</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmsExtra extends AbstractComponent {
  constructor(type) {
    super();

    this._type = type;
  }
  getTemplate() {
    return createFilmsTopTemplate(this._type);
  }
}

