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

    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
    this._filmsComponent = new FilmsComponent();

    this._onDataChange = this._onDataChange.bind(this);
  }

  _onDataChange(movieController, oldFilm, newFilm) {
    const index = this._films.findIndex((film) => film === oldFilm);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));
    movieController.render(this._films[index]);
  }

  _renderFilms(filmsContainer, films, onDataChange) {
    films.forEach((film) => {
      const movieController = new MovieController(filmsContainer, onDataChange);
      movieController.render(film);
    });
  }

  _renderShowMoreBtn(films) {
    this._films = films;

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

      this._renderFilms(filmsListContainerElement, this._films.slice(prevTasksCount, this._showingFilmsCount), this._onDataChange);

      if (this._showingFilmsCount >= this._films.length) {
        remove(this._showMoreBtnComponent);
      }
    });
  }

  render(films) {
    if (films.length === 0) {
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
          sortFilms = films.slice().sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate));
          break;
        case SortType.RATING:
          sortFilms = films.slice().sort((a, b) => b.rating - a.rating);
          break;
        case SortType.DEFAULT:
        default:
          sortFilms = films.slice();
          break;
      }

      filmListContainerElement.innerHTML = ``;
      remove(this._showMoreBtnComponent);

      this._renderFilms(filmListContainerElement, sortFilms.slice(0, this._showingFilmsCount), this._onDataChange);
      this._renderShowMoreBtn(sortFilms);
    });

    this._renderFilms(filmListContainerElement, films.slice(0, this._showingFilmsCount), this._onDataChange);
    this._renderShowMoreBtn(films);

    const filmTopList = films.slice().sort((a, b) => b.rating - a.rating).slice(0, FILM_EXTRA_COUNT);
    if (filmTopList.length) {
      const filmsTopComponent = new FilmsTopComponent();
      const filmsListTopContainerElement = filmsTopComponent.getElement().querySelector(`.films-list__container`);
      render(filmsElement, filmsTopComponent);
      this._renderFilms(filmsListTopContainerElement, filmTopList, this._onDataChange);
    }

    const filmMostList = films.slice().sort((a, b) => b.comments - a.comments).slice(0, FILM_EXTRA_COUNT);
    if (filmMostList.length) {
      const filmsMostComponent = new FilmsMostComponent();
      const filmsListMostContainerElement = filmsMostComponent.getElement().querySelector(`.films-list__container`);
      render(filmsElement, filmsMostComponent);
      this._renderFilms(filmsListMostContainerElement, filmMostList, this._onDataChange);
    }
  }
}
