const RegisterThread = require('../../Domains/threads/entities/RegisterThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailedComment = require('../../Domains/comments/entities/DetailedComment');
 
class ThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }
 
  async addThread(useCasePayload) {
    const registerThread = new RegisterThread(useCasePayload);
    return await this._threadRepository.addThread(registerThread);
  }

  async detailThread(useCasePayload){
    const detailThread = new DetailThread(useCasePayload);
    await this._threadRepository.threadExists(detailThread.threadId);
    const threadResponse = await this._threadRepository.detailThread(detailThread.threadId);
    const commentResponse = await this._commentRepository.getCommentByThreadId(detailThread.threadId);
    threadResponse.comments = commentResponse.map((comment) =>{
      return new DetailedComment(comment);
    });
    return threadResponse;
  }
}
 
module.exports = ThreadUseCase;