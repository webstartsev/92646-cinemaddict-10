import {getRandomIntegerNumber, getRandomArrayItem, getRandomFloatNumber} from '../utils.js';

const Year = {
  begin: 2000,
  end: 2020
};
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

const generateDescriprion = () => {
  const countLineDescription = getRandomIntegerNumber(1, 3);
  let description = [];
  for (let index = 0; index < countLineDescription; index++) {
    description.push(getRandomArrayItem(DescriptionItems));
  }
  return description.join(` `);
};

const generateDuration = () => {
  const hour = getRandomIntegerNumber(Time.hour.begin, Time.hour.end);
  const minute = getRandomIntegerNumber(Time.minute.begin, Time.minute.end);

  return `${hour}h ${minute}m`;
};

export const generateFilm = () => {
  return {
    title: getRandomArrayItem(TitleItems),
    description: generateDescriprion(),
    poster: getRandomArrayItem(PosterItems),
    rating: getRandomFloatNumber(Rating.begin, Rating.end),
    year: getRandomIntegerNumber(Year.begin, Year.end),
    duration: generateDuration(),
    genre: getRandomArrayItem(Genres),
    comments: getRandomIntegerNumber(Comment.begin, Comment.end)
  };
};

export const generateFilms = (count) => {
  let films = [];
  for (let index = 0; index < count; index++) {
    films.push(generateFilm());
  }
  return films;
};
