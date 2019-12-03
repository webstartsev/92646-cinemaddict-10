import {createElement} from '../utils.js';

const createFilmsMostTemplate = () => {
  return (
    `<section class="films-list--extra films-list--extra-most">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmsMost {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsMostTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

