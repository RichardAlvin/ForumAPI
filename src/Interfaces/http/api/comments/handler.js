const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');
 
class CommentsHandler {
  constructor(container) {
    this._container = container;
 
    this.postCommentsHandler = this.postCommentsHandler.bind(this);
    this.deleteCommentsHandler = this.deleteCommentsHandler.bind(this);
  }
 
  async postCommentsHandler(request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const { id: ownerId } = request.auth.credentials;
    const { threadId } = request.params;

    const useCasePayload = {
      content: request.payload.content,
      threadId: threadId,
      ownerId: ownerId
    }

    const addedComment = await commentUseCase.addComment(useCasePayload);
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentsHandler(request, h){
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const useCasePayload = {
      threadId: threadId,
      commentId: commentId,
      ownerId: ownerId
    }

    await commentUseCase.deleteComment(useCasePayload);
    const response = h.response({
      status: 'success'
    });
    response.code(200);
    return response;
  }
}
 
module.exports = CommentsHandler;