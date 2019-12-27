
import AbstractComponent from "./abstract-component.js";

const createStatisticsRankTemplate = (rank) => {
  return (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>`
  );
};

export default class StatisticsRank extends AbstractComponent {
  constructor(rank) {
    super();

    this._rank = rank;
  }
  getTemplate() {
    return createStatisticsRankTemplate(this._rank);
  }
}
