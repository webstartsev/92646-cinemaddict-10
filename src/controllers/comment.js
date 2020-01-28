import CommentComponent from "../components/comment.js";
import {render, remove} from '../utils/render.js';
import {SHAKE_ANIMATION_TIMEOUT} from "../const.js";

export default class CommentController {
  constructor(container, onDataChange, commentsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._commentsModel = commentsModel;

    this._commentComponent = null;
  }

  shake(container) {
    container.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      container.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  render(comment) {
    this._commentComponent = new CommentComponent(comment);

    render(this._container, this._commentComponent);

    this._commentComponent.setDeleteClickHandler((evt) => {
      evt.preventDefault();
      this._commentComponent.setDeteleText(`Deleting...`);
      this._onDataChange(this, comment, null, `comment`);
    });
  }

  destroy() {
    remove(this._commentComponent);
  }
}
