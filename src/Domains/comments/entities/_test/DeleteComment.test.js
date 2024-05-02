const DeleteComment = require('../DeleteComment');
 
describe('a DeleteComment entities', () => { 
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      threadId: 'thread-123'
    };
    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create deletecomment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      threadId: 'thread-123'
    };
    // Action
    const { content } = new DeleteComment(payload);
    // Assert
    expect(content).toEqual(payload.content);
  });
});