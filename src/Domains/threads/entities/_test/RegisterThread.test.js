const RegisterThread = require('../RegisterThread');
 
describe('a RegisterThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };
 
    // Action and Assert
    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });
 
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      ownerId: 321
    };
    // Action and Assert
    expect(() => new RegisterThread(payload)).toThrowError('REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create registerThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      ownerId: 'user-123'
    };
    // Action
    const { title, body, ownerId } = new RegisterThread(payload);
    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(ownerId).toEqual(payload.ownerId);
  });
});