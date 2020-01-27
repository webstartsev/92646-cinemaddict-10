import MenuComponent from '../components/menu.js';
import {generateMenu} from '../utils/menu.js';
import {render, replace} from '../utils/render.js';
import {FilterType} from "../const.js";

export default class FilterController {
  constructor(container, movieModel) {
    this._container = container;
    this._movieModel = movieModel;
    this._activeFilterType = FilterType.ALL;

    this._menuComponent = null;
    this._handlerOnMenuChange = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._movieModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldComponent = this._menuComponent;

    const films = this._movieModel.getMovies();
    const menuItems = generateMenu(films);
    this._menuComponent = new MenuComponent(menuItems);
    this._recoveryListeners();

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(this._container, this._menuComponent);
    }
  }

  _onFilterChange(filterName) {
    this._movieModel.setFilter(filterName);
    this._activeFilterType = filterName;
  }

  _onDataChange() {
    this.render();
  }

  setOnChange(handler) {
    this._handlerOnMenuChange = handler;
    this._menuComponent.setOnChange((menuItem) => {
      this._menuComponent.setActiveMenu(menuItem);
      if (this._handlerOnMenuChange) {
        this._handlerOnMenuChange(menuItem);
      }
    });
  }

  _recoveryListeners() {
    this._menuComponent.setOnChange(this._onFilterChange);
    this.setOnChange(this._handlerOnMenuChange);
  }
}
