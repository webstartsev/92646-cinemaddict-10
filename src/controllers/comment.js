import CommentComponent from "../components/comment.js";
import {render, remove} from '../utils/render.js';

const DELETE_TEXT = `Delete`;
const DELETING_TEXT = `Deleting...`;

export default class CommentController {
  constructor(container, onDataChange, commentsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._commentsModel = commentsModel;

    this._commentComponent = null;
  }

  handleError() {
    this._commentComponent
      .shake()
      .then(() => {
        this._commentComponent.setDeteleText(DELETE_TEXT);
      });
  }

  render(comment) {
    this._commentComponent = new CommentComponent(comment);

    render(this._container, this._commentComponent);

    this._commentComponent.setDeleteClickHandler((evt) => {
      evt.preventDefault();
      this._commentComponent.setDeteleText(DELETING_TEXT);
      this._onDataChange(this, comment, null, `comment`);
    });
  }

  destroy() {
    remove(this._commentComponent);
  }
}
