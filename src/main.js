import {MenuItem} from "./components/menu.js";
import ProfileComponent from './components/profile';
import PageController from './controllers/page.js';
import FilterController from "./controllers/filter.js";
import StatisticsController from "./controllers/statistics.js";
import CountFilmsComponent from './components/count-films.js';
import API from "./api.js";
import {END_POINT, AUTHORIZATION} from "./const.js";

import MovieModel from "./models/movies.js";
import {render} from './utils/render.js';
import {getRank} from './utils/statistics.js';

const api = new API(END_POINT, AUTHORIZATION);

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);

const movieModel = new MovieModel();

const filterController = new FilterController(mainElement, movieModel);
const pageController = new PageController(mainElement, movieModel, api);
const statisticsController = new StatisticsController(mainElement, movieModel);
statisticsController.render();
statisticsController.hide();

api.getMovies()
  .then((movies) => {
    movieModel.setMovies(movies);
    filterController.render();
    pageController.render();

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

    const rank = getRank(movies);
    render(headerElement, new ProfileComponent(rank));

    const countFilmsComponent = new CountFilmsComponent(movies.length);
    render(document.querySelector(`.footer__statistics`), countFilmsComponent);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {

    })
    .catch(() => {

    });
});
