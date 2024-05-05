const DetailedThread = require('../DetailedThread');
 
describe('a DetailedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};
 
    // Action and Assert
    expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
 
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 123
    };
    // Action and Assert
    expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123'
    };
    // Action
    const { threadId } = new DetailedThread(payload);
    // Assert
    expect(threadId).toEqual(payload.threadId);
  });
});