import StatisticsComponent from '../components/statistics.js';
import {render} from '../utils/render.js';

export default class StatisticsController {
  constructor(container, movieModel) {
    this._container = container;
    this._movieModel = movieModel;

    this._statisticsComponent = null;
  }

  render() {
    this._statisticsComponent = new StatisticsComponent(this._movieModel);

    render(this._container, this._statisticsComponent);
  }

  show() {
    this._statisticsComponent.show();
  }

  hide() {
    this._statisticsComponent.hide();
  }
}
