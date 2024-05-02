const AddComment = require('../../Domains/comments/entities/AddComment');
const DeleteComment = require('../../Domains/comments/entities/DeleteComment');
 
class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }
 
  async addComment(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    return await this._commentRepository.addComment(addComment);
  }

  async deleteComment(useCasePayload){
    const deleteComment = new DeleteComment(useCasePayload);
    await this._commentRepository.commentExists(deleteComment.commentId);
    await this._commentRepository.deleteComment(deleteComment.commentId);
  }
}
 
module.exports = CommentUseCase;