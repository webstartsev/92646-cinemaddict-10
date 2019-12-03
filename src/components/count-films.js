import {createElement} from '../utils.js';

const TEXT = `movies inside`;

const createCountFilmsTemplate = (countFilms) => {
  return (
    `<p>${countFilms} ${TEXT}</p>`
  );
};

export default class CountFilms {
  constructor(countFilms) {
    this._element = null;
    this._countFilms = countFilms;
  }

  getTemplate() {
    return createCountFilmsTemplate(this._countFilms);
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
