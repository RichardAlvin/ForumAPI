const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
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
    const mockCommentRepository = new CommentRepository();
 
    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredThread));
 
    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
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

  it('should orchestrating get detail thread correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123'
    };

    const useCaseThread = {
      id: useCasePayload.threadId,
      title: 'thread baru',
      body: 'body thread baru',
      username: 'richard',
      date: '2024-05-06T20:00:00.992Z'
    };

    const useCaseComment = [
      {
        id: 'comment-123',
        username: 'alvin',
        date: '2024-05-06T20:00:00.992Z',
        content: 'content comment baru',
        is_delete: false
      },
      {
        id: 'comment-321',
        username: 'alvin',
        date: '2024-05-06T20:00:00.992Z',
        content: 'content comment baru',
        is_delete: true
      }
    ];

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.threadExists = jest.fn(() => Promise.resolve())
    mockThreadRepository.detailThread = jest.fn().mockImplementation(() => Promise.resolve(useCaseThread))
    mockCommentRepository.getCommentByThreadId = jest.fn().mockImplementation(() => Promise.resolve(useCaseComment));

    /** creating use case instance */
    const detailThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    });
  
    // Action
    const detailThread = await detailThreadUseCase.detailThread(useCasePayload);

    expect(mockThreadRepository.threadExists)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.detailThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentByThreadId)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(detailThread.id).toEqual(useCaseThread.id);
    expect(detailThread.title).toEqual(useCaseThread.title);
    expect(detailThread.body).toEqual(useCaseThread.body);
    expect(detailThread.date).toEqual(useCaseThread.date);
    expect(detailThread.username).toEqual(useCaseThread.username);
  })
});