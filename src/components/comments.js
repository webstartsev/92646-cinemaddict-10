import he from "he";
import AbstractComponent from './abstract-component.js';
import {createElement} from "../utils/render.js";

const Emoji = {
  WIDTH: `55`,
  HEIGHT: `55`,
};

const KeyCode = {
  ENTER: `Enter`,
  ENT: `Ent`
};

const emojiMarkup = (src) => {
  return (
    `<img src="${src}" width="${Emoji.WIDTH}" height="${Emoji.HEIGHT}"/>`
  );
};

const parseFormData = (formData) => {
  const date = new Date().toISOString();
  const comment = he.encode(formData.get(`comment`));

  return {
    comment,
    date,
    emotion: formData.get(`comment-emoji`)
  };
};

const createCommentsTemplate = () => {
  return (
    `<section class="film-details__comments-wrap">
    <ul class="film-details__comments-list">
    </ul>

    <form action="" method="get" class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label">
        <img src="./images/emoji/smile.png" width="55" height="55">
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" checked>
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </form>
  </section>`
  );
};

export default class Comments extends AbstractComponent {
  constructor() {
    super();

    this._isDisabled = false;
    this._handler = null;
  }
  getTemplate() {
    return createCommentsTemplate();
  }

  setClickEmojiHandler() {
    const emojies = this.getElement().querySelectorAll(`.film-details__emoji-label`);
    emojies.forEach((emoji) => {
      emoji.addEventListener(`click`, (evt) => {
        if (this._isDisabled) {
          evt.preventDefault();
          return;
        }

        const src = evt.currentTarget.querySelector(`img`).getAttribute(`src`);
        this._setEmoji(src);
      });
    });
  }

  _setEmoji(src) {
    const emojiLabel = this.getElement().querySelector(`.film-details__add-emoji-label`);
    emojiLabel.innerHTML = ``;

    const img = emojiMarkup(src);
    emojiLabel.append(createElement(img));
  }

  setFormSumbitHandler(handler) {
    this._handler = handler;
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, (evt) => {
      if (evt.ctrlKey && (evt.key === KeyCode.ENTER || evt.key === KeyCode.ENT)) {
        handler();
      }
    });
  }

  disabledForm() {
    this._isDisabled = true;
    this.getElement().querySelector(`.film-details__comment-input`).disabled = true;
  }

  activateForm() {
    this._isDisabled = false;
    this.getElement().querySelector(`.film-details__comment-input`).disabled = false;
  }

  setErrorTextArea() {
    this.getElement().querySelector(`.film-details__comment-input`).classList.add(`film-details__comment-input_error`);
  }

  getData() {
    const form = this.getElement().querySelector(`form`);
    const formData = new FormData(form);

    return parseFormData(formData);
  }
}
