import CommentComponent from "../components/comment.js";
import {render, remove} from '../utils/render.js';

export default class CommentController {
  constructor(container, onCommentChange, commentsModel) {
    this._container = container;
    this._onCommentChange = onCommentChange;
    this._commentsModel = commentsModel;

    this._commentComponent = null;
  }

  render(comment) {
    this._commentComponent = new CommentComponent(comment);

    render(this._container, this._commentComponent);

    this._commentComponent.setDeleteClickHandler((evt) => {
      evt.preventDefault();
      this._onCommentChange(this, comment, null);
    });
  }

  destroy() {
    remove(this._commentComponent);
  }
}