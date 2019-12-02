const createMenuMarkup = (item, isChecked, isLast) => {
  const {name, code, count} = item;

  const checkedClass = isChecked ? `main-navigation__item--active` : ``;
  const lastClass = isLast ? `main-navigation__item--additional` : ``;

  const countMarkup = count ? `<span class="main-navigation__item-count">${count}</span>` : ``;

  return (
    `<a href="#${code}" class="main-navigation__item ${checkedClass} ${lastClass}">${name} ${countMarkup}</a>`
  );
};

export const createMenuTemplate = (menuItems) => {
  const menuMarkup = menuItems.map((item, i) => createMenuMarkup(item, i === 0, i === menuItems.length - 1)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${menuMarkup}
    </nav>`
  );
};
