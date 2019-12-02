const createMenuMarkup = (item, isChecked, isLast) => {
  const {name, code, count} = item;

  return (
    `<a href="#${code}"
        class="main-navigation__item ${isChecked ? `main-navigation__item--active` : ``} ${isLast ? ` main-navigation__item--additional` : ``}">
        ${name} ${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`
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
