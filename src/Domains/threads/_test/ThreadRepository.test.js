const ThreadRepository = require('../ThreadRepository');
 
describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();
 
    // Action and Assert
    await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.detailThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadRepository.threadExists({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});