import ShowMoreBtnComponent from '../components/show-more-btn.js';
import NoFilmsComponent from '../components/no-films.js';
import FilmComponent from '../components/film.js';
import FilmPopupComponent from '../components/film-popup.js';
import CommentsComponent from '../components/comments.js';
import FilmsTopComponent from '../components/films-top.js';
import FilmsMostComponent from '../components/films-most.js';
import SortComponent from '../components/sort';

import {generateComments} from '../mock/comment.js';
import {render, remove, RenderPosition} from '../utils/render.js';

const FILM_EXTRA_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;


export default class PageController {
  constructor(container) {
    this._container = container;
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
  }

  _renderFilms(filmsContainer, films) {
    films.forEach((film) => {
      this._renderFilm(filmsContainer, film);
    });
  }
  _renderFilm(filmsContainer, film) {
    const filmComponent = new FilmComponent(film);
    const filmPopupComponent = new FilmPopupComponent(film);

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        closePopup();
      }
    };

    const openPopup = () => {
      render(document.querySelector(`body`), filmPopupComponent);
      const popupBottomElement = filmPopupComponent.getElement().querySelector(`.form-details__bottom-container`);
      const comments = generateComments(film.comments);
      render(popupBottomElement, new CommentsComponent(comments));
      document.addEventListener(`keydown`, onEscKeyDown);
      filmPopupComponent.setClickCloseHandler(closePopup);
    };
    const closePopup = () => {
      remove(filmPopupComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };
    filmComponent.setOpenDetailHandler(openPopup);

    render(filmsContainer, filmComponent);
  }

  _renderShowMoreBtn(filmListContainerElement, films) {
    const container = this._container.getElement();
    render(container, this._showMoreBtnComponent);

    this._showMoreBtnComponent.setClickHandler(() => {
      const prevTasksCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      this._renderFilms(filmListContainerElement, films.slice(prevTasksCount, this._showingFilmsCount));

      if (this._showingFilmsCount >= films.length) {
        remove(this._showMoreBtnComponent);
      }
    });
  }

  render(films) {
    const container = this._container.getElement();
    const filmListContainerElement = container.querySelector(`.films-list__container`);

    if (films.length === 0) {
      render(container, this._noFilmsComponent);
    } else {
      render(document.querySelector(`.main`), this._sortComponent);
      this._renderFilms(filmListContainerElement, films.slice(0, this._showingFilmsCount));
      this._renderShowMoreBtn(filmListContainerElement, films);

      const filmTopList = films.slice().sort((a, b) => b.rating - a.rating).slice(0, FILM_EXTRA_COUNT);
      if (filmTopList.length) {
        const filmsTopComponent = new FilmsTopComponent();
        const filmsListTopContainerElement = filmsTopComponent.getElement().querySelector(`.films-list__container`);
        render(container, filmsTopComponent);
        this._renderFilms(filmsListTopContainerElement, filmTopList);
      }

      const filmMostList = films.slice().sort((a, b) => b.comments - a.comments).slice(0, FILM_EXTRA_COUNT);
      if (filmMostList.length) {
        const filmsMostComponent = new FilmsMostComponent();
        const filmsListMostContainerElement = filmsMostComponent.getElement().querySelector(`.films-list__container`);
        render(container, filmsMostComponent);
        this._renderFilms(filmsListMostContainerElement, filmMostList);
      }
    }
  }
}
