import AbstractComponent from './abstract-component.js';

const createFilmsMostTemplate = () => {
  return (
    `<section class="films-list--extra films-list--extra-most">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container"></div>
    </section>`
  );
};

export default class FilmsMost extends AbstractComponent {
  getTemplate() {
    return createFilmsMostTemplate();
  }
}

