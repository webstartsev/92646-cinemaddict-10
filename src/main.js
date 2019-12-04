import ProfileComponent from './components/profile';
import MenuComponent from './components/menu';
import SortComponent from './components/sort';
import FilmsComponent from './components/films';
import FilmComponent from './components/film';
import ShowMoreBtnComponent from './components/show-more-btn';
import FilmsTopComponent from './components/films-top';
import FilmsMostComponent from './components/films-most';
import FilmPopupComponent from './components/film-popup';
import CommentsComponent from './components/comments';
import CountFilmsComponent from './components/count-films';
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
render(headerElement, new ProfileComponent().getElement());

const mainElement = document.querySelector(`.main`);
render(mainElement, new MenuComponent(menuItems).getElement());
render(mainElement, new SortComponent().getElement());
render(mainElement, new FilmsComponent().getElement());

const filmsElement = mainElement.querySelector(`.films`);
const filmListContainerElement = filmsElement.querySelector(`.films-list__container`);

let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
films.slice(0, showingFilmsCount)
  .forEach((film) => {
    const filmComponent = new FilmComponent(film);
    const filmPopup = new FilmPopupComponent(film);

    const filmPosterElement = filmComponent.getElement().querySelector(`.film-card__poster`);
    const filmTitleElement = filmComponent.getElement().querySelector(`.film-card__title`);
    const filmCommentsElement = filmComponent.getElement().querySelector(`.film-card__comments`);
    const popupCloseBtn = filmPopup.getElement().querySelector(`.film-details__close-btn`);

    const openPopup = () => {
      render(document.querySelector(`body`), filmPopup.getElement());
      const popupBottomElement = filmPopup.getElement().querySelector(`.form-details__bottom-container`);
      const comments = generateComments(films[0].comments);
      render(popupBottomElement, new CommentsComponent(comments).getElement());
    };
    const closePopup = () => {
      filmPopup.getElement().remove();
    };

    filmPosterElement.addEventListener(`click`, openPopup);
    filmTitleElement.addEventListener(`click`, openPopup);
    filmCommentsElement.addEventListener(`click`, openPopup);
    popupCloseBtn.addEventListener(`click`, closePopup);

    render(filmListContainerElement, filmComponent.getElement());
  });

const filmsListElement = mainElement.querySelector(`.films-list`);
render(filmsListElement, new ShowMoreBtnComponent().getElement());

const filmTopList = films.slice().sort((a, b) => b.rating - a.rating).slice(0, FILM_EXTRA_COUNT);
let filterFilm = filmTopList.filter((film) => film.rating > 0);
if (filterFilm.length) {
  render(filmsElement, new FilmsTopComponent().getElement());
  const filmsListTopElement = mainElement.querySelector(`.films-list--extra-top`);
  const filmsListTopContainerElement = filmsListTopElement.querySelector(`.films-list__container`);
  filmTopList.forEach((film) => render(filmsListTopContainerElement, new FilmComponent(film).getElement()));
}

const filmMostComment = films.slice().sort((a, b) => b.comments - a.comments).slice(0, FILM_EXTRA_COUNT);
filterFilm = filmTopList.filter((film) => film.comments > 0);
if (filterFilm.length) {
  render(filmsElement, new FilmsMostComponent().getElement());
  const filmsListMostCommentElement = mainElement.querySelector(`.films-list--extra-most`);
  const filmsListMostCommentContainerElement = filmsListMostCommentElement.querySelector(`.films-list__container`);
  filmMostComment.forEach((film) => render(filmsListMostCommentContainerElement, new FilmComponent(film).getElement()));
}

const loadMoreButton = filmsListElement.querySelector(`.films-list__show-more`);
loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  films.slice(prevTasksCount, showingFilmsCount)
    .forEach((film) => render(filmListContainerElement, new FilmComponent(film).getElement()));

  if (showingFilmsCount >= films.length) {
    loadMoreButton.remove();
  }
});

render(document.querySelector(`.footer__statistics`), new CountFilmsComponent(films.length).getElement());
