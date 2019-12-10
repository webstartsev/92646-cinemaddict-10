import AbstractComponent from './abstract-component.js';

const sortItems = [
  {
    title: `Sort by default`,
    type: `default`,
  },
  {
    title: `Sort by date`,
    type: `date`,
  },
  {
    title: `Sort by rating`,
    type: `rating`,
  }
];

const createSortMarkup = (item, currentSortType) => {
  const activeClass = (currentSortType === item.type) ? `sort__button--active` : ``;

  return (
    `<li><a href="#" class="sort__button ${activeClass}" data-sort-type="${item.type}">${item.title}</a></li>`
  );
};

const createSortTemplate = (currentSortType) => {
  const sortMarkup = sortItems.map((item) => createSortMarkup(item, currentSortType)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortMarkup}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = `default`;
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _setActiveElement(currentElement, sortElements) {
    sortElements.forEach((element) => {
      element.classList.remove(`sort__button--active`);
    });
    currentElement.classList.add(`sort__button--active`);
  }

  setClickSortHandler(handler) {
    const sortElements = this.getElement().querySelectorAll(`.sort__button`);
    sortElements.forEach((element) => element.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const sortType = evt.target.dataset.sortType;
      if (sortType === this._currentSortType) {
        return;
      }

      this._currentSortType = sortType;
      handler(sortType);

      this._setActiveElement(element, sortElements);
    }));
  }
}
