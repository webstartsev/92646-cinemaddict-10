
import AbstractComponent from "./abstract-component.js";

const createStatisticsRankTemplate = () => {
  return (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Sci-Fighter</span>
    </p>`
  );
};

export default class StatisticsRank extends AbstractComponent {
  getTemplate() {
    return createStatisticsRankTemplate();
  }
}
