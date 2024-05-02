const AddComment = require('../../Domains/comments/entities/AddComment');
 
class CommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }
 
  async addComment(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    return await this._commentRepository.addComment(addComment);
  }

  async deleteComment(useCasePayload){
    const { threadId, commentId } = useCasePayload;
    await this._commentRepository.deleteComment(commentId);
  }
}
 
module.exports = CommentUseCase;