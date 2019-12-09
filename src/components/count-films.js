import AbstractComponent from './abstract-component.js';

const TEXT = `movies inside`;

const createCountFilmsTemplate = (countFilms) => {
  return (
    `<p>${countFilms} ${TEXT}</p>`
  );
};

export default class CountFilms extends AbstractComponent {
  constructor(countFilms) {
    super();

    this._countFilms = countFilms;
  }

  getTemplate() {
    return createCountFilmsTemplate(this._countFilms);
  }
}
