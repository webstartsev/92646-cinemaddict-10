import {getYear, getDuration} from '../utils/movie.js';

export default class Movie {
  constructor(data) {
    const duration = getDuration(data[`film_info`][`runtime`]);

    this.id = data[`id`];
    this.title = data[`film_info`][`title`] || ``;
    this.alternativeTitle = data[`film_info`][`alternative_title`] || ``;
    this.description = data[`film_info`][`description`] || ``;
    this.poster = data[`film_info`][`poster`] ? data[`film_info`][`poster`] : null;
    this.rating = data[`film_info`][`total_rating`] ? data[`film_info`][`total_rating`] : null;
    this.year = data[`film_info`][`release`][`date`] ? getYear(data[`film_info`][`release`][`date`]) : getYear(new Date());
    this.duration = `${duration.hours}h ${duration.minutes}m`;
    this.genres = data[`film_info`][`genre`] ? data[`film_info`][`genre`] : [];
    this.director = data[`film_info`][`director`] ? data[`film_info`][`director`] : ``;
    this.writers = data[`film_info`][`writers`] ? data[`film_info`][`writers`] : [];
    this.actors = data[`film_info`][`actors`] ? data[`film_info`][`actors`] : [];
    this.releaseDate = data[`film_info`][`release`][`date`] ? new Date(data[`film_info`][`release`][`date`]) : new Date();
    this.country = data[`film_info`][`release`][`release_country`] || ``;
    this.ratingPlus = data[`film_info`][`age_rating`] || 0;
    this.personalRating = data[`user_details`][`personal_rating`] || 0;
    this.dateWatched = data[`user_details`][`watching_date`] ? new Date(data[`user_details`][`watching_date`]) : null;
    this.isNeedWatch = data[`user_details`][`watchlist`] ? data[`user_details`][`watchlist`] : false;
    this.isWatch = data[`user_details`][`already_watched`] ? data[`user_details`][`already_watched`] : false;
    this.isFavorite = data[`user_details`][`favorite`] ? data[`user_details`][`favorite`] : false;
    this.comments = data[`comments`] ? data[`comments`] : [];
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.name,
        'alternative_title': this.alternativeName,
        'poster': `images/posters/${this.poster}`,
        "total_rating": this.filmMark,
        'age_rating': this.ageRating * 1,
        'director': this.director,
        'writers': [...this.writers],
        'actors': [...this.actors],
        'release': {
          'date': this.releaseDate.toISOString(),
          'release_country': this.country
        },
        'runtime': Math.floor(this.runTime / 60 / 1000),
        'genre': [...this.genres],
        'description': this.description
      },
      'user_details': {
        'personal_rating': this.personalRating,
        'watchlist': this.isInWatchList,
        'already_watched': this.isInHistory,
        'watching_date': this.whatchedDate ? this.whatchedDate.toISOString() : this.whatchedDate,
        'favorite': this.isFavorite
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.toRAW());
  }
}
