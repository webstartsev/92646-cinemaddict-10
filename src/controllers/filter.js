import MenuComponent from '../components/menu.js';
import {generateMenu} from '../utils/menu.js';
import {render, replace} from '../utils/render.js';

export default class FilterController {
  constructor(container, movieModel) {
    this._container = container;
    this._movieModel = movieModel;

    this._menuComponent = null;
    this._setOnChangeMenuHandler = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._movieModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldComponent = this._menuComponent;

    const films = this._movieModel.getAllMovies();
    const menuItems = generateMenu(films);
    this._menuComponent = new MenuComponent(menuItems);
    this.setOnChange(this._setOnChangeMenuHandler);

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(this._container, this._menuComponent);
    }
  }

  _onDataChange() {
    this.render();
  }

  setOnChange(handler) {
    this._setOnChangeMenuHandler = handler;
    this._menuComponent.setOnChange((menuItem) => {
      this._movieModel.setFilter(menuItem);
      this._menuComponent.setActiveMenu(menuItem);
      if (this._setOnChangeMenuHandler) {
        this._setOnChangeMenuHandler(menuItem);
      }
    });
  }
}
