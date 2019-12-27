import AbstractComponent from './abstract-component.js';

const createProfileTemplate = (rank) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractComponent {
  constructor(rank) {
    super();

    this._rank = rank;
  }
  getTemplate() {
    return createProfileTemplate(this._rank);
  }
}
