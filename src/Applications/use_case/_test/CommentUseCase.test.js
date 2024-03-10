const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCase = require('../CommentUseCase');
 
describe('CommentUseCase - AddComment', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'dicoding',
    };
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
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
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
    }));
  });
});