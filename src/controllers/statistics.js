import StatisticsComponent from '../components/statistics.js';
import StatisticsRankComponent from '../components/statistics-rank.js';
import StatisticsFiltersComponent from '../components/statistics-filters.js';
import {render, replace, RenderPosition} from '../utils/render.js';
import {getRank} from '../utils/statistics.js';
import {StatisticType} from '../const.js';

export default class StatisticsController {
  constructor(container, movieModel) {
    this._container = container;
    this._movieModel = movieModel;
    this._rank = null;
    this._activeFilterType = StatisticType.ALL;

    this._statisticsComponent = null;
    this._statisticsRankComponent = null;
    this._statisticsRankComponent = null;

    this._onStatisticsFilterChange = this._onStatisticsFilterChange.bind(this);
  }

  render() {
    const oldStatisticsComponent = this._statisticsComponent;
    const movies = this._movieModel.getMovies();
    this._rank = getRank(movies);

    this._statisticsComponent = new StatisticsComponent(this._movieModel, this._activeFilterType);
    this._statisticsRankComponent = new StatisticsRankComponent(this._rank);
    this._statisticsFiltersComponent = new StatisticsFiltersComponent(this._activeFilterType);

    this._statisticsFiltersComponent.setClickSortHandler(this._onStatisticsFilterChange);

    const statisicsElement = this._statisticsComponent.getElement();
    render(statisicsElement, this._statisticsFiltersComponent, RenderPosition.AFTERBEGIN);
    render(statisicsElement, this._statisticsRankComponent, RenderPosition.AFTERBEGIN);

    if (oldStatisticsComponent) {
      replace(this._statisticsComponent, oldStatisticsComponent);
    } else {
      render(this._container, this._statisticsComponent);
    }
  }

  show() {
    this._statisticsComponent.show();
    this.render();
  }

  hide() {
    this._statisticsComponent.hide();
  }

  _onStatisticsFilterChange(filterType) {
    this._activeFilterType = filterType;
    this.render();
  }
}
