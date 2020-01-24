import AbstractComponent from './abstract-component.js';
import {HIDDEN_CLASS} from '../const.js';

const DEFAULT_TITLE = `All movies. Upcoming`;

const createFilmsTemplate = (title) => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">${title}</h2>

        <div class="films-list__container"></div>
      </section>
    </section>`
  );
};

export default class Films extends AbstractComponent {
  constructor() {
    super();

    this._title = DEFAULT_TITLE;
  }
  getTemplate() {
    return createFilmsTemplate(this._title);
  }

  setTitle(title) {
    this._title = title;
    const titleElement = this.getElement().querySelector(`.films-list__title`);
    titleElement.innerHTML = this._title;
    titleElement.classList.remove(HIDDEN_CLASS);
  }

  setDefaultTitle() {
    const titleElement = this.getElement().querySelector(`.films-list__title`);
    titleElement.innerText = DEFAULT_TITLE;
    titleElement.classList.add(HIDDEN_CLASS);
  }
}
