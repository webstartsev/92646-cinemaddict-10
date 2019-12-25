import {getRandomArrayItem, formatDate, randomDate} from '../utils/utils.js';

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

export const generateComment = () => {
  const date = formatDate(randomDate(new Date(2000, 0, 1), new Date()));
  return {
    id: String(Date.now() + Math.random()),
    text: getRandomArrayItem(Texts),
    user: getRandomArrayItem(Users),
    date,
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
