const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../CommentUseCase');
 
describe('CommentUseCase - AddComment', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'dicoding',
      threadId: 'thread-123'
    };
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId
    });
 
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
 
    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
 
    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
    });
 
    // Action
    const addedComment = await getCommentUseCase.addComment(useCasePayload);
 
    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      threadId: 'thread-123'
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
      threadId: useCasePayload.threadId
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
    }

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // mockThreadRepository.threadExists = jest.fn()
    //   .mockImplementation(() => Promise.resolve())
    mockCommentRepository.commentExists = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const commentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    await commentUseCase.deleteComment(useCasePayload)

    // expect(mockThreadRepository.threadExists)
    //   .toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.commentExists)
      .toBeCalledWith(useCasePayload.commentId)
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCasePayload.commentId)
  })
});