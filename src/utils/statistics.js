import moment from 'moment';

import {StatisticType, StatisticPeriod} from '../const.js';

const RankTitle = {
  NONE: ``,
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

const RankPoint = {
  NONE: 0,
  NOVICE: {
    MIN: 1,
    MAX: 10
  },
  FAN: {
    MIN: 11,
    MAX: 20
  }
};

export const getRank = (films) => {
  let rank = ``;
  const countView = films.filter((film) => film.isWatch).length;
  if (countView === RankPoint.NONE) {
    rank = RankTitle.NONE;
  } else if (countView >= RankPoint.NOVICE.MIN && countView <= RankPoint.NOVICE.MAX) {
    rank = RankTitle.NOVICE;
  } else if (countView >= RankPoint.FAN.MIN && countView <= RankPoint.FAN.MAX) {
    rank = RankTitle.FAN;
  } else {
    rank = RankTitle.MOVIE_BUFF;
  }

  return rank;
};

export const getMoviesByPeriod = (movies, period) => {
  const watchedMovies = movies.filter((movie) => movie.isWatch);

  if (period === StatisticType.ALL) {
    return watchedMovies;
  }

  return watchedMovies.filter((movie) => {
    return moment(movie.dateWatched).diff(new Date(), StatisticPeriod[period]) === 0;
  });
};
