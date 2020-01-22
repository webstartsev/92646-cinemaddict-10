export const AUTHORIZATION = `Basic eo0w590ik29889a`;
export const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

export const SHAKE_ANIMATION_TIMEOUT = 600;
export const DEBOUNCE_TIMEOUT = 500;

export const STORE_PREFIX = `cinemaddict-localstorage`;
export const STORE_VER = `v1`;
export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

export const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const StatisticType = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const StatisticPeriod = {
  [StatisticType.TODAY]: `days`,
  [StatisticType.WEEK]: `week`,
  [StatisticType.MONTH]: `month`,
  [StatisticType.YEAR]: `year`
};

export const USER = `Sergey Startsev`;

export const HIDDEN_CLASS = `visually-hidden`;
