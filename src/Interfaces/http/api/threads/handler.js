const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');
 
class ThreadsHandler {
  constructor(container) {
    this._container = container;
 
    this.postThreadsHandler = this.postThreadsHandler.bind(this);
    this.detailThreadsHandler = this.detailThreadsHandler.bind(this);
  }
 
  async postThreadsHandler(request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedThread = await threadUseCase.addThread(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async detailThreadsHandler(request){
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const useCasePayload = {
      threadId: request.params.threadId
    }
    const detailThread = await threadUseCase.detailThread(useCasePayload);
    const response = h.response({
      status: 'success',
      data: {
        detailThread,
      }
    });
    response.code(201);
    return response;
  }
}
 
module.exports = ThreadsHandler;