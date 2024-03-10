const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
 
describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await pool.end();
  });
 
  describe('addThread function', () => {
    it('should persist register thread', async () => {
      // Arrange
      const registerThread = new RegisterThread({
        title: 'dicoding',
        body: 'secret_password',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await threadRepositoryPostgres.addThread(registerThread);
 
      // Assert
      const threads = await ThreadTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
 
    it('should return registered user correctly', async () => {
      // Arrange
      const registerThread = new RegisterThread({
        title: 'dicoding',
        body: 'secret_password',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(registerThread);
 
      // Assert
      expect(registeredThread).toStrictEqual(new RegisteredThread({
        id: 'thread-123',
        title: 'dicoding',
      }));
    });
  });
});