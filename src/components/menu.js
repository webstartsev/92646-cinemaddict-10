import AbstractComponent from './abstract-component.js';

const createMenuMarkup = (item, {isChecked, isLast}) => {
  const {name, code, count} = item;

  const checkedClass = isChecked ? `main-navigation__item--active` : ``;
  const lastClass = isLast ? `main-navigation__item--additional` : ``;

  const countMarkup = count ? `<span class="main-navigation__item-count">${count}</span>` : ``;

  return (
    `<a href="#${code}" class="main-navigation__item ${checkedClass} ${lastClass}">${name} ${countMarkup}</a>`
  );
};

const createMenuTemplate = (menuItems) => {
  const menuMarkup = menuItems.map((item, i) => createMenuMarkup(item, {isChecked: i === 0, isLast: i === menuItems.length - 1})).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${menuMarkup}
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor(menuItems) {
    super();

    this._menuItems = menuItems;
  }

  getTemplate() {
    return createMenuTemplate(this._menuItems);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const filterName = evt.target.href.split(`#`)[1];
      if (!filterName) {
        return;
      }

      handler(filterName);
    });
  }
}
