export default class Comments {
  constructor() {
    this._comments = [];
    this._commentChangeHandlers = [];
  }

  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = Array.from(comments);
  }

  addComment(comment) {
    this._comments = [...this._comments, comment];
    this._callHandlers(this._commentChangeHandlers);
  }

  removeComment(data) {
    const index = this._getIndexCommentById(data.id);

    if (index === -1) {
      return false;
    }

    this._comments = [...this._comments.slice(0, index), ...this._comments.slice(index + 1)];
    this._callHandlers(this._commentChangeHandlers);

    return true;
  }

  setCommentChangeHandler(handler) {
    this._commentChangeHandlers.push(handler);
  }

  _getIndexCommentById(id) {
    return this._comments.findIndex((comment) => comment.id === id);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
