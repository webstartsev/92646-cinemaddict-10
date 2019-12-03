import {createProfileTemplate} from './components/profile';
import {createMenuTemplate} from './components/menu';
import {createSortTemplate} from './components/sort';
import {createFilmsTemplate} from './components/films';
import {createFilmTemplate} from './components/film';
import {createShowMoreBtnTemplate} from './components/show-more-btn';
import {createFilmsTopTemplate} from './components/films-top';
import {createFilmsMostTemplate} from './components/films-most';
import {createFilmPopupTemplate} from './components/film-popup';
import {createCommentsTemplate} from './components/comments';
import {generateFilms} from './mock/film.js';
import {generateMenu} from './mock/menu.js';
import {generateComments} from './mock/comment.js';
import {render} from './utils.js';

const FILM_COUNT = 15;
const FILM_EXTRA_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

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

let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
films.slice(0, showingFilmsCount)
  .forEach((film) => render(filmListContainerElement, createFilmTemplate(film)));

const filmsListElement = mainElement.querySelector(`.films-list`);
render(filmsListElement, createShowMoreBtnTemplate());

const filmTopList = films.slice().sort((a, b) => b.rating - a.rating).slice(0, FILM_EXTRA_COUNT);
let filterFilm = filmTopList.filter((film) => film.rating > 0);
if (filterFilm.length) {
  render(filmsElement, createFilmsTopTemplate());
  const filmsListTopElement = mainElement.querySelector(`.films-list--extra-top`);
  const filmsListTopContainerElement = filmsListTopElement.querySelector(`.films-list__container`);
  filmTopList.forEach((film) => render(filmsListTopContainerElement, createFilmTemplate(film)));
}

const filmMostComment = films.slice().sort((a, b) => b.comments - a.comments).slice(0, FILM_EXTRA_COUNT);
filterFilm = filmTopList.filter((film) => film.comments > 0);
if (filterFilm.length) {
  render(filmsElement, createFilmsMostTemplate());
  const filmsListMostCommentElement = mainElement.querySelector(`.films-list--extra-most`);
  const filmsListMostCommentContainerElement = filmsListMostCommentElement.querySelector(`.films-list__container`);
  filmMostComment.forEach((film) => render(filmsListMostCommentContainerElement, createFilmTemplate(film)));
}
render(document.querySelector(`body`), createFilmPopupTemplate(films[0]));
const popupBottomElement = document.querySelector(`.form-details__bottom-container`);
const comments = generateComments(films[0].comments);
render(popupBottomElement, createCommentsTemplate(comments));

const loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);
loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  films.slice(prevTasksCount, showingFilmsCount)
    .forEach((film) => render(filmListContainerElement, createFilmTemplate(film)));

  if (showingFilmsCount >= films.length) {
    loadMoreButton.remove();
  }
});

document.querySelector(`.footer__statistics`).innerHTML = `${films.length} movies inside`;
