import {MenuItem} from "./components/menu.js";
import ProfileComponent from './components/profile';
import PageController from './controllers/page.js';
import FilterController from "./controllers/filter.js";
import StatisticsController from "./controllers/statistics.js";
import CountFilmsComponent from './components/count-films.js';
import {generateFilms} from './mock/film.js';

import MovieModel from "./models/movies.js";
import {render} from './utils/render.js';
import {getRank} from './utils/statistics.js';

const FILM_COUNT = 15;

const films = generateFilms(FILM_COUNT);
const rank = getRank(films);
const mainElement = document.querySelector(`.main`);

const headerElement = document.querySelector(`.header`);
render(headerElement, new ProfileComponent(rank));

const movieModel = new MovieModel();
movieModel.setMovies(films);

const filterController = new FilterController(mainElement, movieModel);
filterController.render();

const pageController = new PageController(mainElement, movieModel);
pageController.render();

const countFilmsComponent = new CountFilmsComponent(films.length);
render(document.querySelector(`.footer__statistics`), countFilmsComponent);

const statisticsController = new StatisticsController(mainElement, movieModel, rank);
statisticsController.render();
statisticsController.hide();

filterController.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      statisticsController.show();
      pageController.hide();
      break;
    default:
      statisticsController.hide();
      pageController.show();
      break;
  }
});
