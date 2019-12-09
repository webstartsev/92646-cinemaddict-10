import AbstractComponent from './abstract-component.js';

const createFilmsTopTemplate = () => {
  return (
    `<section class="films-list--extra films-list--extra-top">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmsTop extends AbstractComponent {
  getTemplate() {
    return createFilmsTopTemplate();
  }
}

