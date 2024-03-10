const AddComment = require('../AddComment');
 
describe('a AddComment entities', () => { 
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123
    };
    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create addcomment object correctly', () => {
    // Arrange
    const payload = {
      content: 'dicoding',
    };
    // Action
    const { content } = new AddComment(payload);
    // Assert
    expect(content).toEqual(payload.content);
  });
});