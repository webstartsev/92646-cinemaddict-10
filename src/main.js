import ProfileComponent from './components/profile';
import MenuComponent from './components/menu';
import PageController from './controllers/page.js';
import CountFilmsComponent from './components/count-films.js';
import {generateFilms} from './mock/film.js';
import {generateMenu} from './mock/menu.js';
import {render} from './utils/render.js';

const FILM_COUNT = 15;

const films = generateFilms(FILM_COUNT);
const mainElement = document.querySelector(`.main`);

const headerElement = document.querySelector(`.header`);
render(headerElement, new ProfileComponent());

const menuItems = generateMenu(films);
render(mainElement, new MenuComponent(menuItems));

const pageController = new PageController(mainElement);
pageController.render(films);

const countFilmsComponent = new CountFilmsComponent(films.length);
render(document.querySelector(`.footer__statistics`), countFilmsComponent);
