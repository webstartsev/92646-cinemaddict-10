export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`title`] || ``;
    this.description = data[`description`] || ``;
    this.poster = data[`poster`] ? data[`poster`] : null;
    this.rating = data[`rating`] ? data[`rating`] : null;
    this.year = data[`year`] || ``;
    this.duration = data[`duration`] || ``;
    this.genres = data[`genres`] ? data[`genres`] : [];
    this.comments = data[`comments`] ? data[`comments`] : [];
    this.isNeedWatch = data[`user_details`][`watchlist`] ? data[`user_details`][`watchlist`] : false;
    this.isWatch = data[`user_details`][`already_watched`] ? data[`user_details`][`already_watched`] : false;
    this.isFavorite = data[`user_details`][`favorite`] ? data[`user_details`][`favorite`] : false;
    this.directors = data[`directors`] ? data[`directors`] : [];
    this.writers = data[`writers`] ? data[`writers`] : [];
    this.actors = data[`actors`] ? data[`actors`] : [];
    this.dateWatched = data[`date_watched`] ? new Date(data[`date_watched`]) : null;
    this.releaseDate = data[`date_watched`] ? new Date(data[`date_watched`]) : null;
    this.country = data[`country`] || ``;
    this.ratingPlus = data[`rating_plus`] || 0;
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
