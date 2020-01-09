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
