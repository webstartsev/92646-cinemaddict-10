import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import AbstractSmartComponent from "./abstract-smart-component.js";

const BAR_COLOR = `#ffe800`;
const LABEL_PADDING = 80;
const LABEL_COLOR = `#fff`;
const LABEL_FONT_SIZE = 18;
const LABEL_OFFSET = 40;

const prepearData = (movies) => {
  const genres = [];
  const genresData = new Map();

  movies.map((film) => film.genres.forEach((genre) => genres.push(genre)));

  genres.forEach((genre) => {
    if (genresData.has(genre)) {
      const value = genresData.get(genre);
      genresData.set(genre, value + 1);
    } else {
      genresData.set(genre, 1);
    }
  });

  return genresData;
};

const sortedData = (genresData) => {
  return new Map([...genresData].sort((a, b) => b[1] - a[1]));
};

const renderMovieChart = (fimsCtx, movies) => {
  const genresData = prepearData(movies);
  const sortedGenresData = sortedData(genresData);

  return new Chart(fimsCtx, {
    type: `horizontalBar`,
    data: {
      labels: [...sortedGenresData.keys()],
      datasets: [{
        data: [...sortedGenresData.values()],
        backgroundColor: BAR_COLOR,
        categoryPercentage: 0.5,
        barPercentage: 1
      }]
    },
    options: {
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            padding: LABEL_PADDING,
            fontColor: LABEL_COLOR,
            fontSize: LABEL_FONT_SIZE
          }
        }]
      },
      plugins: {
        datalabels: {
          color: LABEL_COLOR,
          font: {
            size: LABEL_FONT_SIZE
          },
          anchor: `start`,
          align: `left`,
          offset: LABEL_OFFSET
        }
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    },
    plugins: [ChartDataLabels]
  });
};

const getDuration = (films) => {
  const totalMinutes = films.reduce((acc, film) => {
    const duration = film.duration.split(` `);
    const h = parseInt(duration[0], 10);
    const m = parseInt(duration[1], 10);
    const total = (h * 60) + m;

    return acc + total;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    hours,
    minutes
  };
};

const createStatisticsTemplate = ({films}) => {
  const countMovies = films.length || 0;
  const totalDuration = getDuration(films);

  const genresData = prepearData(films);
  const sortedGenresData = sortedData(genresData);
  const topGenre = [...sortedGenresData.keys()].shift() || `-`;

  return (
    `<section class="statistic">

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${countMovies} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDuration.hours} <span class="statistic__item-description">h</span> ${totalDuration.minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(films) {
    super();

    this._films = films;
    this._filmsChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate({films: this._films});
  }

  _renderCharts() {
    const element = this.getElement();
    const fimsCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._moviesChart = renderMovieChart(fimsCtx, this._films);
  }

  _resetCharts() {
    if (this._filmsChart) {
      this._filmsChart.destroy();
      this._filmsChart = null;
    }
  }

  rerender(films) {
    this._films = films;

    super.rerender();

    this._renderCharts();
  }

  show() {
    super.show();

    this.rerender(this._films);
  }

  recoveryListeners() {}
}
