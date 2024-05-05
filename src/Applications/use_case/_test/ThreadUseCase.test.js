const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');
 
describe('ThreadUseCase - AddThread', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'dicoding',
      body: 'secret',
      ownerId: 'user-123'
    };
    const mockRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: useCasePayload.title,
      ownerId: useCasePayload.ownerId
    });
 
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
 
    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredThread));
 
    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });
 
    // Action
    const registeredThread = await getThreadUseCase.addThread(useCasePayload);
 
    // Assert
    expect(registeredThread).toStrictEqual(new RegisteredThread({
      id: 'thread-123',
      title: useCasePayload.title,
      ownerId: 'user-123'
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new RegisterThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      ownerId: useCasePayload.ownerId
    }));
  });
});