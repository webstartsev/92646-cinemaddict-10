import {createElement} from '../utils/render.js';
import {HIDDEN_CLASS} from "../const.js";
import {SHAKE_ANIMATION_TIMEOUT} from "../const.js";

export default class AbstarctComponent {
  constructor() {
    if (new.target === AbstarctComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  show() {
    if (this._element) {
      this._element.classList.remove(HIDDEN_CLASS);
    }
  }

  hide() {
    if (this._element) {
      this._element.classList.add(HIDDEN_CLASS);
    }
  }

  shake() {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    return new Promise((resolve) => {
      setTimeout(() => {
        this.getElement().style.animation = ``;
        resolve();
      }, SHAKE_ANIMATION_TIMEOUT);
    });
  }
}
