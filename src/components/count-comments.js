import AbstractComponent from './abstract-component.js';

const createCountCommentsTemplate = (countComments) => {
  return (
    `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${countComments}</span></h3>`
  );
};

export default class CountComments extends AbstractComponent {
  constructor(countComments) {
    super();

    this._countComments = countComments;
  }

  getTemplate() {
    return createCountCommentsTemplate(this._countComments);
  }
}
