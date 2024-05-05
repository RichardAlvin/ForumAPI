const AddComment = require('../../Domains/comments/entities/AddComment');
const DeleteComment = require('../../Domains/comments/entities/DeleteComment');
 
class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
 
  async addComment(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    await this._threadRepository.threadExists(addComment.threadId);
    return await this._commentRepository.addComment(addComment);
  }

  async deleteComment(useCasePayload){
    const deleteComment = new DeleteComment(useCasePayload);
    await this._threadRepository.threadExists(deleteComment.threadId);
    await this._commentRepository.commentExists(deleteComment.commentId);
    await this._commentRepository.checkUserComment(deleteComment.commentId, deleteComment.ownerId);
    await this._commentRepository.deleteComment(deleteComment.commentId);
  }
}
 
module.exports = CommentUseCase;