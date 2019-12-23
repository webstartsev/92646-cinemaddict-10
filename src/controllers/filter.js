import MenuComponent from '../components/menu.js';
import {generateMenu} from '../mock/menu.js';
import {render, replace} from '../utils/render.js';
import {FilterType} from "../const.js";

export default class FilterController {
  constructor(container, movieModel) {
    this._container = container;
    this._movieModel = movieModel;
    this._activeFilterType = FilterType.ALL;

    this._menuComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const oldComponent = this._menuComponent;

    const films = this._movieModel.getMovies();
    const menuItems = generateMenu(films);
    this._menuComponent = new MenuComponent(menuItems);
    this._menuComponent.setFilterChangeHandler(this._onFilterChange);

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
}
