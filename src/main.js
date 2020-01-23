import {MenuItem} from "./components/menu.js";
import ProfileComponent from './components/profile';
import PageController from './controllers/page.js';
import FilterController from "./controllers/filter.js";
import StatisticsController from "./controllers/statistics.js";
import CountFilmsComponent from './components/count-films.js';
import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import {END_POINT, AUTHORIZATION, STORE_NAME} from "./const.js";

import MovieModel from "./models/movies.js";
import {render} from './utils/render.js';
import {getRank} from './utils/statistics.js';

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);

const movieModel = new MovieModel();

const filterController = new FilterController(mainElement, movieModel);
const pageController = new PageController(mainElement, movieModel, apiWithProvider);
const statisticsController = new StatisticsController(mainElement, movieModel);

apiWithProvider.getMovies()
  .then((movies) => {
    movieModel.setMovies(movies);
    filterController.render();
    pageController.render();
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

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then(() => {

      })
      .catch(() => {

      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
