import ShowMoreBtnComponent from '../components/show-more-btn.js';
import NoFilmsComponent from '../components/no-films.js';
import FilmsTopComponent from '../components/films-top.js';
import FilmsMostComponent from '../components/films-most.js';
import SortComponent from '../components/sort.js';
import FilmsComponent from '../components/films.js';
import MovieController from '../controllers/movie.js';

import {render, remove} from '../utils/render.js';
import {SortType} from '../const.js';

const FILM_EXTRA_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

export default class PageController {
  constructor(container) {
    this._container = container;
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._films = [];
    this._showedFilmControllers = [];

    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
    this._filmsComponent = new FilmsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  _onDataChange(movieController, oldFilm, newFilm) {
    const index = this._films.findIndex((film) => film === oldFilm);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));
    movieController.render(this._films[index]);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((filmController) => filmController.setDefaultView());
  }

  _renderFilms(filmsContainer, films, onDataChange, onViewChange) {
    return films.map((film) => {
      const movieController = new MovieController(filmsContainer, onDataChange, onViewChange);
      movieController.render(film);

      return movieController;
    });
  }

  _renderShowMoreBtn(films) {
    if (this._showingFilmsCount >= films.length) {
      return;
    }

    const filmsElement = this._filmsComponent.getElement();
    const filmsListElement = filmsElement.querySelector(`.films-list`);
    const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);
    render(filmsListElement, this._showMoreBtnComponent);

    this._showMoreBtnComponent.setClickHandler(() => {
      const prevTasksCount = this._showingFilmsCount;
      this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      const newFilms = this._renderFilms(filmsListContainerElement, films.slice(prevTasksCount, this._showingFilmsCount), this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilms);

      if (this._showingFilmsCount >= films.length) {
        remove(this._showMoreBtnComponent);
      }
    });
  }

  render(films) {
    this._films = films;
    if (this._filmslength === 0) {
      render(this._container, this._noFilmsComponent);
      return;
    }

    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);
    const filmsElement = this._filmsComponent.getElement();
    const filmListContainerElement = filmsElement.querySelector(`.films-list__container`);

    this._sortComponent.setClickSortHandler((sortType) => {
      let sortFilms = [];

      switch (sortType) {
        case SortType.DATE:
          sortFilms = this._filmsslice().sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate));
          break;
        case SortType.RATING:
          sortFilms = this._filmsslice().sort((a, b) => b.rating - a.rating);
          break;
        case SortType.DEFAULT:
        default:
          sortFilms = this._filmsslice();
          break;
      }

      filmListContainerElement.innerHTML = ``;
      remove(this._showMoreBtnComponent);

      const newFilms = this._renderFilms(filmListContainerElement, sortFilms.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange);
      this._showedFilmControllers = newFilms;
      this._renderShowMoreBtn(sortFilms);
    });

    const newFilms = this._renderFilms(filmListContainerElement, this._films.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange);
    this._showedFilmControllers = newFilms;
    this._renderShowMoreBtn(films);

    const filmTopList = this._films.slice().sort((a, b) => b.rating - a.rating).slice(0, FILM_EXTRA_COUNT);
    if (filmTopList.length) {
      const filmsTopComponent = new FilmsTopComponent();
      const filmsListTopContainerElement = filmsTopComponent.getElement().querySelector(`.films-list__container`);
      render(filmsElement, filmsTopComponent);
      const newFilmsTop = this._renderFilms(filmsListTopContainerElement, filmTopList, this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilmsTop);
    }

    const filmMostList = this._films.slice().sort((a, b) => b.comments - a.comments).slice(0, FILM_EXTRA_COUNT);
    if (filmMostList.length) {
      const filmsMostComponent = new FilmsMostComponent();
      const filmsListMostContainerElement = filmsMostComponent.getElement().querySelector(`.films-list__container`);
      render(filmsElement, filmsMostComponent);
      const newFilmsMost = this._renderFilms(filmsListMostContainerElement, filmMostList, this._onDataChange, this._onViewChange);
      this._showedFilmControllers = this._showedFilmControllers.concat(newFilmsMost);
    }
  }
}
