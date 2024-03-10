const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');
 
class CommentsHandler {
  constructor(container) {
    this._container = container;
 
    this.postCommentsHandler = this.postCommentsHandler.bind(this);
  }
 
  async postCommentsHandler(request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await commentUseCase.addComment(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}
 
module.exports = CommentsHandler;