import {MenuItem} from "./components/menu.js";
import ProfileComponent from './components/profile';
import StatisticsComponent from './components/statistics.js';
import PageController from './controllers/page.js';
import FilterController from "./controllers/filter.js";
import CountFilmsComponent from './components/count-films.js';
import {generateFilms} from './mock/film.js';

import MovieModel from "./models/movies.js";
import {render} from './utils/render.js';

const FILM_COUNT = 15;

const films = generateFilms(FILM_COUNT);
const mainElement = document.querySelector(`.main`);

const headerElement = document.querySelector(`.header`);
render(headerElement, new ProfileComponent());

const movieModel = new MovieModel();
movieModel.setMovies(films);

const filterController = new FilterController(mainElement, movieModel);
filterController.render();

const pageController = new PageController(mainElement, movieModel);
pageController.render();

const countFilmsComponent = new CountFilmsComponent(films.length);
render(document.querySelector(`.footer__statistics`), countFilmsComponent);

const statisticsComponent = new StatisticsComponent(movieModel);
render(mainElement, statisticsComponent);

statisticsComponent.hide();

filterController.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      statisticsComponent.show();
      pageController.hide();
      break;
    default:
      statisticsComponent.hide();
      pageController.show();
      break;
  }
});
