import {getRandomIntegerNumber} from '../utils.js';

const View = {
  begin: 0,
  end: 30
};

const getRank = (countView) => {
  let rank = ``;
  if (countView >= 1 && countView <= 10) {
    rank = `novice`;
  } else if (countView >= 11 && countView <= 20) {
    rank = `fan`;
  } else {
    rank = `movie buff`;
  }

  return rank;
};

export const createProfileTemplate = () => {
  const rank = getRank(getRandomIntegerNumber(View.begin, View.end));

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
