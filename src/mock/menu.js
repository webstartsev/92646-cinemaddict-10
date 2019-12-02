const menuItems = [
  {name: `All movies`, code: `all`},
  {name: `Watchlist`, code: `watchlist`},
  {name: `History`, code: `history`},
  {name: `Favorites`, code: `favorites`},
  {name: `Stats`, code: `stats`},
];

const getMenuCountItems = (title, films) => {
  switch (title) {
    case `Watchlist`:
      return films.filter((film) => film.isNeedWatch).length;
    case `History`:
      return films.filter((film) => film.isWatch).length;
    case `Favorites`:
      return films.filter((film) => film.isFavorite).length;
    default:
      return 0;
  }
};

const generateMenu = (films) => {
  return menuItems.map((it) => {
    return {
      name: it.name,
      code: it.code,
      count: getMenuCountItems(it.name, films),
    };
  });
};

export {generateMenu};
