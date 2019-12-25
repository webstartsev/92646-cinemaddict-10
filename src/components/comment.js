import AbstractComponent from './abstract-component.js';
import {formatDate} from "../utils/comment.js";

const createCommentsTemplate = (commet) => {
  const {text, user, emoji} = commet;
  const date = formatDate(commet.date);

  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${user}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`
  );
};

export default class Comments extends AbstractComponent {
  constructor(commets) {
    super();

    this._commets = commets;
  }

  getTemplate() {
    return createCommentsTemplate(this._commets);
  }

  setDeleteClickHandler(handler) {
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButtons.forEach((button) => button.addEventListener(`click`, handler));
  }
}
