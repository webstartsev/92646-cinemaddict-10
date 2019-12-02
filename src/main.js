import {createProfileTemplate} from './components/profile';
import {createMenuTemplate} from './components/menu';
import {createSortTemplate} from './components/sort';
import {createFilmsTemplate} from './components/films';
import {createFilmTemplate} from './components/film';
import {createShowMoreBtnTemplate} from './components/show-more-btn';
import {createFilmsTopTemplate} from './components/films-top';
import {createFilmsMostTemplate} from './components/films-most';
// import {createFilmPopupTemplate} from './components/film-popup';
import {generateFilms} from './mock/film.js';
import {generateMenu} from './mock/menu.js';

const FILM_COUNT = 5;
const FILM__EXTRA_COUNT = 2;

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};
const films = generateFilms(FILM_COUNT);
const menuItems = generateMenu(films);

const headerElement = document.querySelector(`.header`);
render(headerElement, createProfileTemplate());

const mainElement = document.querySelector(`.main`);
render(mainElement, createMenuTemplate(menuItems));
render(mainElement, createSortTemplate());
render(mainElement, createFilmsTemplate());

const filmsElement = mainElement.querySelector(`.films`);
const filmListContainerElement = filmsElement.querySelector(`.films-list__container`);

films.forEach((film) => render(filmListContainerElement, createFilmTemplate(film)));

const filmsListElement = mainElement.querySelector(`.films-list`);
render(filmsListElement, createShowMoreBtnTemplate());

render(filmsElement, createFilmsTopTemplate());
render(filmsElement, createFilmsMostTemplate());

const filmsListTopElement = mainElement.querySelector(`.films-list--extra-top`);
const filmsListTopContainerElement = filmsListTopElement.querySelector(`.films-list__container`);
const filmTopList = films.slice().sort((a, b) => b.rating - a.rating).slice(0, FILM__EXTRA_COUNT);
filmTopList.forEach((film) => render(filmsListTopContainerElement, createFilmTemplate(film)));

const filmsListMostCommentElement = mainElement.querySelector(`.films-list--extra-most`);
const filmsListMostCommentContainerElement = filmsListMostCommentElement.querySelector(`.films-list__container`);
const filmMostComment = films.slice().sort((a, b) => b.comments - a.comments).slice(0, FILM__EXTRA_COUNT);
filmMostComment.forEach((film) => render(filmsListMostCommentContainerElement, createFilmTemplate(film)));

// render(document.querySelector(`body`), createFilmPopupTemplate());
