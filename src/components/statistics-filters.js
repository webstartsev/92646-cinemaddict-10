import AbstractComponent from "./abstract-component.js";

const STATISTICS_FILTERS = [`All time`, `Today`, `Week`, `Month`, `Year`];

const prepearFilter = (filter) => filter.toLowerCase().replace(` `, `-`);

const createFilterMarkup = (activeFilter) => {
  return STATISTICS_FILTERS.map((filter) => {
    const item = prepearFilter(filter);
    return `<input
      type="radio"
      class="statistic__filters-input visually-hidden"
      name="statistic-filter"
      id="statistic-${item}"
      value="${item}"
      ${item === activeFilter ? `checked` : ``}>
    <label for="statistic-${item}" class="statistic__filters-label">${filter}</label>`;
  }).join(``);
};

const createStatisticsFilterTemplate = (activeFilter) => {
  const filterMarkup = createFilterMarkup(activeFilter);

  return (
    `<form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      ${filterMarkup}
    </form>`
  );
};

export default class StatisticsFilter extends AbstractComponent {
  constructor(activeFilterType) {
    super();

    this._activeFilerType = activeFilterType;
  }
  getTemplate() {
    return createStatisticsFilterTemplate(this._activeFilerType);
  }

  setClickSortHandler(handler) {
    const filters = this.getElement();
    filters.addEventListener(`change`, (evt) => {
      const value = evt.target.value;
      handler(value);
    });
  }
}
