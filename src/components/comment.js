import AbstarctSmartComponent from './abstract-smart-component.js';
import {formatDate} from "../utils/comment.js";

const DEFAULT_DELETE = `Delete`;

const createCommentsTemplate = (commet, deleteText) => {
  const {comment, author, emotion} = commet;
  const date = formatDate(commet.date);

  return (
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">${deleteText}</button>
      </p>
    </div>
  </li>`
  );
};

export default class Comments extends AbstarctSmartComponent {
  constructor(commets) {
    super();

    this._deleteButtonText = DEFAULT_DELETE;
    this._commets = commets;
    this._handler = null;
  }

  getTemplate() {
    return createCommentsTemplate(this._commets, this._deleteButtonText);
  }

  setDeleteClickHandler(handler) {
    this._handler = handler;
    const deleteButtons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    deleteButtons.forEach((button) => button.addEventListener(`click`, handler));
  }

  setDeteleText(text) {
    this._deleteButtonText = text;
    this.rerender();
  }

  recoveryListeners() {
    this.setDeleteClickHandler(this._handler);
  }
}
