const DetailedComment = require('../DetailedComment');
 
describe('a DetailedComment entities', () => { 
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};
    // Action and Assert
    expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 321,
      date: 22,
      username: 3,
      is_delete: false
    };
    // Action and Assert
    expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create deletecomment object correctly', () => {
    // Arrange
    const payload = {
        id: 'comment-123',
        content: 'comment baru',
        date: '2024-05-06T20:00:00.992Z',
        username: 'richard',
        is_delete: false
    };
    // Action
    const detailComment = new DetailedComment(payload);
    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.date).toEqual(payload.date);
  });

  it('should create deletecomment object correctly with Deleted Content', () => {
    //Arrange
    const payload = {
      id: 'comment-123',
      content: 'comment baru',
      date: '2024-05-06T20:00:00.992Z',
      username: 'richard',
      is_delete: true
    };
    // Action
    const detailComment = new DetailedComment(payload);
    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.content).toEqual("**komentar telah dihapus**");
    expect(detailComment.date).toEqual(payload.date);
  })
});