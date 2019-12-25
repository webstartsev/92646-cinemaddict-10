import {getRandomIntegerNumber, getRandomArrayItem, getRandomFloatNumber, formatDate, randomDate} from '../utils/utils.js';
import {generateComments} from './comment.js';

const Time = {
  hour: {
    begin: 1,
    end: 3
  },
  minute: {
    begin: 10,
    end: 59
  }
};
const Comment = {
  begin: 0,
  end: 10
};
const Rating = {
  begin: 4,
  end: 9
};
const Genres = [
  `Action`,
  `Comedy`,
  `Drama`,
  `Horror`,
  `Westerns`
];
const TitleItems = [
  `Начало`,
  `Бойцовский клуб`,
  `Побег из Шоушенка`,
  `Форрест Гамп`,
  `Зеленая миля`,
  `Матрица`,
  `Остров проклятых`,
  `Назад в будущее`,
  `Игры разума`,
  `Большой куш`,
  `Эффект бабочки`,
  `Поймай меня, если сможешь`,
  `Амели`,
  `Интерстеллар`,
  `ВАЛЛ·И`
];
const PosterItems = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];
const DescriptionItems = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce`,
  `tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus`,
  `eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit,`,
  `eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in`,
  `sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];
const Directors = [`Джеймс Мэнголд`, `Егор Баранов`, 	`Крис Бак`, `Дженнифер Ли`];
const Writers = [`Дженнифер Ли`, `Крис Бак`, `Marc Smith`, `Джез Баттеруорт`, `Джон-Генри Баттеруорт`, `Джейсон Келлер`];
const Actors = [`Кристиан Бэйл`, `Мэтт Дэймон`, `Катрина Балф`, `Трэйси Леттс`, `Джон Бернтал`, `Ноа Джуп`, `Джош Лукас`, `Ремо Джироне`, `Рэй Маккиннон`, `Джей Джей Филд`];
const Country = [`США`, `Франция`, `Россия`];
const RatingPlus = {
  begin: 0,
  end: 18
};

const generateRandomArray = (array) => {
  const count = getRandomIntegerNumber(1, 3);
  let result = [];
  for (let index = 0; index < count; index++) {
    result.push(getRandomArrayItem(array));
  }
  return result;
};

const generateDuration = () => {
  const hour = getRandomIntegerNumber(Time.hour.begin, Time.hour.end);
  const minute = getRandomIntegerNumber(Time.minute.begin, Time.minute.end);

  return `${hour}h ${minute}m`;
};

export const generateFilm = () => {
  const releaseDate = formatDate(randomDate(new Date(2000, 0, 1), new Date()));
  return {
    id: String(Date.now() + Math.random()),
    title: getRandomArrayItem(TitleItems),
    description: generateRandomArray(DescriptionItems).join(` `),
    poster: getRandomArrayItem(PosterItems),
    rating: getRandomFloatNumber(Rating.begin, Rating.end),
    year: releaseDate.split(` `)[2],
    duration: generateDuration(),
    genres: generateRandomArray(Genres),
    comments: generateComments(getRandomIntegerNumber(Comment.begin, Comment.end)),
    isNeedWatch: Math.random() > 0.5,
    isWatch: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    directors: generateRandomArray(Directors),
    writers: generateRandomArray(Writers),
    actors: generateRandomArray(Actors),
    releaseDate,
    country: getRandomArrayItem(Country),
    ratingPlus: getRandomIntegerNumber(RatingPlus.begin, RatingPlus.end)
  };
};

export const generateFilms = (count) => {
  let films = [];
  for (let index = 0; index < count; index++) {
    films.push(generateFilm());
  }
  return films;
};
