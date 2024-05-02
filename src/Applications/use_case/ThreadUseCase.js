const RegisterThread = require('../../Domains/threads/entities/RegisterThread');
 
class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }
 
  async addThread(useCasePayload) {
    const registerThread = new RegisterThread(useCasePayload);
    return await this._threadRepository.addThread(registerThread);
  }

  async detailThread(useCasePayload){
    const { threadId } = useCasePayload;
    const detailThread = await this._threadRepository.detailThread(threadId);

    return detailThread;
  }
}
 
module.exports = ThreadUseCase;