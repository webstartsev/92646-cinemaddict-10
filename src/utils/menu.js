const menuItems = [
  {name: `All movies`, code: `all`},
  {name: `Watchlist`, code: `watchlist`},
  {name: `History`, code: `history`},
  {name: `Favorites`, code: `favorites`},
  {name: `Stats`, code: `stats`},
];

const prepearMovies = (movies) => {
  return movies.reduce((acc, movie) => {
    if (movie.isNeedWatch) {
      acc[`watchlist`] = acc.hasOwnProperty(`watchlist`) ? ++acc[`watchlist`] : 1;
    }

    if (movie.isWatch) {
      acc[`history`] = acc.hasOwnProperty(`history`) ? ++acc[`history`] : 1;
    }

    if (movie.isFavorite) {
      acc[`favorites`] = acc.hasOwnProperty(`favorites`) ? ++acc[`favorites`] : 1;
    }

    return Object.assign({}, acc);
  }, {});
};

export const generateMenu = (movies) => {
  const moviesByFilter = prepearMovies(movies);
  return menuItems.map((item) => {
    return {
      name: item.name,
      code: item.code,
      count: moviesByFilter[item.code],
    };
  });
};
