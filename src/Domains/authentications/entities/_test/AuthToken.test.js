const AuthToken = require('../AuthToken');

describe('AuthToken entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
    };

    // Action & Assert
    expect(() => new AuthToken(payload)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 1234,
    };

    // Action & Assert
    expect(() => new AuthToken(payload)).toThrowError('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AuthToken entities correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    // Action
    const authToken = new AuthToken(payload);

    // Assert
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(authToken.accessToken).toEqual(payload.accessToken);
    expect(authToken.refreshToken).toEqual(payload.refreshToken);
  });
});