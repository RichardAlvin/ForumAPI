const DeleteComment = require('../DeleteComment');
 
describe('a DeleteComment entities', () => { 
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};
    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      threadId: 'thread-123',
      ownerId: 321
    };
    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create deletecomment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      ownerId: 'user-123'
    };
    // Action
    const { commentId, threadId, ownerId } = new DeleteComment(payload);
    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
    expect(ownerId).toEqual(payload.ownerId);
  });
});