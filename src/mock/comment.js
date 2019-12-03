import {getRandomArrayItem, getRandomIntegerNumber} from '../utils.js';
import {Months} from '../const.js';

const Day = {
  begin: 1,
  end: 30
};
const Year = {
  begin: 2017,
  end: 2020
};

const Emojies = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`, `trophy.png`];
const Texts = [
  `Lorem ipsum dolor sit amet consectetur`,
  `adipisicing elit. Quo repellat quae enim aliquid provident.`,
  `Facilis dicta, dolore vitae ducimus`,
  `omnis cupiditate et nesciunt eius quisquam cum reiciendis tempore maxime necessitatibus.`,
];
const Users = [
  `Tim Macoveev`,
  `Sergey Startsev`,
  `Ivan Ivanov`,
  `Petr Petrov`,
];

const generateDate = () => {
  const date = getRandomIntegerNumber(Day.begin, Day.end);
  const month = getRandomArrayItem(Months);
  const year = getRandomIntegerNumber(Year.begin, Year.end);
  return `${date} ${month} ${year}`;
};

export const generateComment = () => {
  return {
    text: getRandomArrayItem(Texts),
    user: getRandomArrayItem(Users),
    date: generateDate(),
    emoji: getRandomArrayItem(Emojies)
  };
};

export const generateComments = (count) => {
  let comments = [];
  for (let index = 0; index < count; index++) {
    comments.push(generateComment());
  }
  return comments;
};
