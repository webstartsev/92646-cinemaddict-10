const menuItems = [
  {name: `All movies`, code: `all`},
  {name: `Watchlist`, code: `watchlist`},
  {name: `History`, code: `history`},
  {name: `Favorites`, code: `favorites`},
  {name: `Stats`, code: `stats`},
];

const getMenuCountItems = (title, movies) => {
  switch (title) {
    case `Watchlist`:
      return movies.filter((movie) => movie.isNeedWatch).length;
    case `History`:
      return movies.filter((movie) => movie.isWatch).length;
    case `Favorites`:
      return movies.filter((movie) => movie.isFavorite).length;
    default:
      return 0;
  }
};

const generateMenu = (movies) => {
  return menuItems.map((item) => {
    return {
      name: item.name,
      code: item.code,
      count: getMenuCountItems(item.name, movies),
    };
  });
};

export {generateMenu};
