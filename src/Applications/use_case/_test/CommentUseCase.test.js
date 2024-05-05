const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../CommentUseCase');
 
describe('CommentUseCase - AddComment', () => {
  it('should throw error if use case payload not contain add comment needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const commentUseCase = new CommentUseCase({});

    await expect(commentUseCase.addComment(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload add comment not meet data type specification', async () => {
    const useCasePayload = {
      content: 'dicoding',
      threadId: 123,
      ownerId: 123
    };
    const commentUseCase = new CommentUseCase({})

    await expect(() => commentUseCase.addComment(useCasePayload))
      .rejects
      .toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'dicoding',
      threadId: 'thread-123',
      ownerId: 'user-123'
    };
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      ownerId: useCasePayload.ownerId
    });
 
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
 
    /** mocking needed function */
    mockThreadRepository.threadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
 
    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });
 
    // Action
    const addedComment = await getCommentUseCase.addComment(useCasePayload);
 
    // Assert
    expect(mockThreadRepository.threadExists).toBeCalledWith(useCasePayload.threadId)
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      threadId: 'thread-123',
      ownerId: 'user-123'
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      ownerId: useCasePayload.ownerId
    }));
  });

  it('should throw error if use case payload not contain delete comment needed property', async () =>{
    // Arrange
    const useCasePayload = {};
    const commentUseCase = new CommentUseCase({});

    await expect(commentUseCase.deleteComment(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  })

  it('should throw error if payload delete comment not meet data type specification', async () => {
    const useCasePayload = {
      threadId: 123,
      commentId: 123,
      ownerId: 321
    }
    const commentUseCase = new CommentUseCase({})

    await expect(() => commentUseCase.deleteComment(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  });


  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      ownerId: 'user-123'
    }

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.threadExists = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.commentExists = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.checkUserComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    await commentUseCase.deleteComment(useCasePayload)

    expect(mockThreadRepository.threadExists)
      .toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.commentExists)
      .toBeCalledWith(useCasePayload.commentId)
    expect(mockCommentRepository.checkUserComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.ownerId)
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCasePayload.commentId)
  })
});