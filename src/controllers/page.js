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
  constructor(container, movieModel, api) {
    this._container = container;
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._films = [];
    this._showedFilmControllers = [];
    this._movieModel = movieModel;
    this._api = api;
    this._filmsListContainer = null;
    this._filmsElement = null;

    this._showMoreBtnComponent = new ShowMoreBtnComponent();
    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
    this._filmsComponent = new FilmsComponent();
    this._filmsTopComponent = new FilmsTopComponent();
    this._filmsMostComponent = new FilmsMostComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreBtnClick = this._onShowMoreBtnClick.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._movieModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setClickSortHandler(this._onSortTypeChange);
  }

  _onFilterChange() {
    this._updateMovies(SHOWING_FILMS_COUNT_ON_START);
  }

  _updateMovies(count) {
    const movies = this._movieModel.getMovies().slice(0, count);
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    this._removeMovies();
    remove(this._filmsTopComponent);
    remove(this._filmsMostComponent);

    this._renderFilms(this._filmsListContainer, movies);
    this._renderTopList();
    this._renderMostList();

    this._renderShowMoreBtn();
  }

  _removeMovies() {
    this._showedFilmControllers.forEach((movieController) => movieController.destroy());
    this._showedFilmControllers = [];
  }

  _onDataChange(movieController, oldData, newData) {
    if (newData !== null) {
      this._movieModel.updateMovie(oldData.id, newData);
    }
    this._updateMovies(this._showingFilmsCount);
  }

  _onViewChange() {
    this._showedFilmControllers.forEach((filmController) => filmController.setDefaultView());
  }

  _renderFilms(filmsContainer, films) {
    const newFilms = films.map((film) => {
      const movieController = new MovieController(filmsContainer, this._onDataChange, this._onViewChange, this._movieModel);
      movieController.render(film);

      return movieController;
    });

    this._showedFilmControllers = [...this._showedFilmControllers, ...newFilms];
    this._countShowTasks = this._showedFilmControllers.length;
  }

  _renderShowMoreBtn() {
    const films = this._movieModel.getMovies();
    remove(this._showMoreBtnComponent);

    if (this._showingFilmsCount >= films.length) {
      return;
    }

    const filmsListElement = this._filmsElement.querySelector(`.films-list`);
    render(filmsListElement, this._showMoreBtnComponent);

    this._showMoreBtnComponent.setClickHandler(this._onShowMoreBtnClick);
  }

  _onShowMoreBtnClick() {
    const films = this._movieModel.getMovies();
    const prevTasksCount = this._showingFilmsCount;
    this._showingFilmsCount = this._showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

    this._renderFilms(this._filmsListContainer, films.slice(prevTasksCount, this._showingFilmsCount));

    if (this._showingFilmsCount >= films.length) {
      remove(this._showMoreBtnComponent);
    }
  }

  render() {
    this._films = this._movieModel.getMovies();
    if (this._filmslength === 0) {
      render(this._container, this._noFilmsComponent);
      return;
    }

    render(this._container, this._sortComponent);
    render(this._container, this._filmsComponent);
    this._filmsElement = this._filmsComponent.getElement();
    this._filmsListContainer = this._filmsElement.querySelector(`.films-list__container`);

    this._renderFilms(this._filmsListContainer, this._films.slice(0, this._showingFilmsCount));
    this._renderShowMoreBtn();

    this._renderTopList();
    this._renderMostList();
  }

  _onSortTypeChange(sortType) {
    let sortFilms = [];

    const movies = this._movieModel.getMovies();

    switch (sortType) {
      case SortType.DATE:
        sortFilms = movies.slice().sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate));
        break;
      case SortType.RATING:
        sortFilms = movies.slice().sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
      default:
        sortFilms = movies.slice();
        break;
    }

    this._removeMovies();
    this._renderFilms(this._filmsListContainer, sortFilms.slice(0, this._showingFilmsCount));

    this._renderShowMoreBtn();
  }

  _renderTopList() {
    const films = this._movieModel.getMovies();
    const filmTopList = this._getTopListMovies(films);
    if (!filmTopList.length) {
      return;
    }

    render(this._filmsElement, this._filmsTopComponent);
    const filmsListTopContainer = this._filmsTopComponent.getElement().querySelector(`.films-list__container`);
    this._renderFilms(filmsListTopContainer, filmTopList);
  }

  _renderMostList() {
    const films = this._movieModel.getMovies();
    const filmMostList = this._getMostListMovies(films);
    if (!filmMostList.length) {
      return;
    }

    render(this._filmsElement, this._filmsMostComponent);
    const filmsListMostContainer = this._filmsMostComponent.getElement().querySelector(`.films-list__container`);
    this._renderFilms(filmsListMostContainer, filmMostList);
  }

  _getTopListMovies(movies) {
    return movies.slice().sort((a, b) => b.rating - a.rating).slice(0, FILM_EXTRA_COUNT);
  }

  _getMostListMovies(movies) {
    return movies.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, FILM_EXTRA_COUNT);
  }

  show() {
    this._sortComponent.show();
    this._filmsElement.classList.remove(`visually-hidden`);
  }

  hide() {
    this._sortComponent.hide();
    this._filmsElement.classList.add(`visually-hidden`);
  }
}
