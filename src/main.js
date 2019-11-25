import {createProfileTemplate} from './components/profile';
import {createMenuTemplate} from './components/menu';
import {createSortTemplate} from './components/sort';
import {createFilmsTemplate} from './components/films';
import {createFilmTemplate} from './components/film';
import {createShowMoreBtnTemplate} from './components/show-more-btn';
import {createFilmsTopTemplate} from './components/films-top';
import {createFilmsMostTemplate} from './components/films-most';
import {createFilmPopupTemplate} from './components/film-popup';

const FILM_COUNT = 5;
const FILM__EXTRA_COUNT = 2;

const render = (container, template, position = `beforeend`) => {
  container.insertAdjacentHTML(position, template);
};

const headerElement = document.querySelector(`.header`);
render(headerElement, createProfileTemplate());

const mainElement = document.querySelector(`.main`);
render(mainElement, createMenuTemplate());
render(mainElement, createSortTemplate());
render(mainElement, createFilmsTemplate());

const filmsElement = mainElement.querySelector(`.films`);
const filmListContainerElement = filmsElement.querySelector(`.films-list__container`);

new Array(FILM_COUNT).fill(``).forEach(() => render(filmListContainerElement, createFilmTemplate()));

const filmsListElement = mainElement.querySelector(`.films-list`);
render(filmsListElement, createShowMoreBtnTemplate());

render(filmsElement, createFilmsTopTemplate());
render(filmsElement, createFilmsMostTemplate());

const filmsListTopElement = mainElement.querySelector(`.films-list--extra-top`);
const filmsListTopContainerElement = filmsListTopElement.querySelector(`.films-list__container`);
new Array(FILM__EXTRA_COUNT).fill(``).forEach(() => render(filmsListTopContainerElement, createFilmTemplate()));

const filmsListMostElement = mainElement.querySelector(`.films-list--extra-most`);
const filmsListMostContainerElement = filmsListMostElement.querySelector(`.films-list__container`);
new Array(FILM__EXTRA_COUNT).fill(``).forEach(() => render(filmsListMostContainerElement, createFilmTemplate()));

render(document.querySelector(`body`), createFilmPopupTemplate());
