const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
 
describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await pool.end();
  });
 
  describe('addThread function', () => {
    it('should persist register thread', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })

      // Arrange
      const registerThread = new RegisterThread({
        title: 'dicoding',
        body: 'secret_password',
        ownerId: 'user-123'
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
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })
      
      // Arrange
      const registerThread = new RegisterThread({
        title: 'dicoding',
        body: 'secret_password',
        ownerId: 'user-123'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(registerThread);
 
      // Assert
      expect(registeredThread).toStrictEqual(new RegisteredThread({
        id: 'thread-123',
        title: 'dicoding',
        ownerId: 'user-123'
      }));
    });
  });

  describe('detailThread function', () => {
    it('should get detailThread when thread is exists', async () => {
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'richard',
        fullname: 'richard alvin'
      });

      await ThreadTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread baru',
        body: 'thread body baru',
        ownerId: 'user-123',
        created_at: '2024-05-06T20:00:00.992Z',
        updated_at: '2024-05-06T20:00:00.992Z',
      });

      const thread = await threadRepositoryPostgres.detailThread('thread-123');
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'thread baru',
        body: 'thread body baru',
        username: 'richard',
        date: '2024-05-06T20:00:00.992Z'
      })
    })
  })

  describe('threadExists function', () => {
    it('should get thread when thread is exists', async () => {
      //arrange
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'richard',
        fullname: 'richard alvin'
      });

      await ThreadTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread baru',
        body: 'thread body baru',
        ownerId: 'user-123',
        created_at: '2024-05-06T20:00:00.992Z',
        updated_at: '2024-05-06T20:00:00.992Z',
      });

      const thread = threadRepositoryPostgres.threadExists('thread-123');
      //assert
      expect(thread).resolves.not.toThrowError(NotFoundError);
    })
  })
});