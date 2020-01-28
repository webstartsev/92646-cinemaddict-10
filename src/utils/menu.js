import {getWatchlistMovies, getHistoryMovies, getFavoriteMovies} from './movie.js';

const menuItems = [
  {name: `All movies`, code: `all`},
  {name: `Watchlist`, code: `watchlist`},
  {name: `History`, code: `history`},
  {name: `Favorites`, code: `favorites`},
  {name: `Stats`, code: `stats`},
];

const prepearMovies = (movies) => {
  return {
    Watchlist: getWatchlistMovies(movies).length,
    History: getHistoryMovies(movies).length,
    Favorites: getFavoriteMovies(movies).length,
  };
};

const generateMenu = (movies) => {
  const moviesByFilter = prepearMovies(movies);
  return menuItems.map((item) => {
    return {
      name: item.name,
      code: item.code,
      count: moviesByFilter[item.name],
    };
  });
};

export {generateMenu};
