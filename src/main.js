import ProfileComponent from './components/profile';
import MenuComponent from './components/menu';
import SortComponent from './components/sort';
import FilmsComponent from './components/films';
import PageController from './controllers/page.js';
import {generateFilms} from './mock/film.js';
import {generateMenu} from './mock/menu.js';
import {render} from './utils/render.js';

const FILM_COUNT = 15;

const films = generateFilms(FILM_COUNT);
const menuItems = generateMenu(films);

const headerElement = document.querySelector(`.header`);
render(headerElement, new ProfileComponent());

const mainElement = document.querySelector(`.main`);
render(mainElement, new MenuComponent(menuItems));
render(mainElement, new SortComponent());

const filmsComponent = new FilmsComponent();
render(mainElement, filmsComponent);

const pageController = new PageController(filmsComponent);
pageController.render(films);
