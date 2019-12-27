const Rank = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};


export const getRank = (films) => {
  let rank = ``;
  const countView = films.filter((film) => film.isWatch).length;
  if (countView >= 1 && countView <= 10) {
    rank = Rank.NOVICE;
  } else if (countView >= 11 && countView <= 20) {
    rank = Rank.FAN;
  } else {
    rank = Rank.MOVIE_BUFF;
  }

  return rank;
};
