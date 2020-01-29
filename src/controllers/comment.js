import CommentComponent from "../components/comment.js";
import {render, remove} from '../utils/render.js';

export default class CommentController {
  constructor(container, onDataChange, commentsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._commentsModel = commentsModel;

    this._commentComponent = null;
  }

  shake() {
    this._commentComponent.shake();
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
