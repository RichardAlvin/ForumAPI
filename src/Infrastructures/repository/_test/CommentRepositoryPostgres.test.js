const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
 
describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await pool.end();
  });
 
  describe('addComment function', () => {
    it('should persist add comment', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      })

      await ThreadTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread baru',
        body: 'body thread baru',
        ownerId: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      const addComment = new AddComment({
        content: 'dicoding',
        threadId: 'thread-123',
        ownerId: 'user-123'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(addedComment).toStrictEqual(new AddedComment({
        id: comments[0].id,
        content: comments[0].content,
        ownerId: comments[0].ownerId
      }))
      expect(comments).toHaveLength(1);
    });
  });

  describe('deleteComment function', () => {
    it('should persist delete comment', async () => {
      //Add Dummy Data
      await UsersTableTestHelper.addUser({ 
        id: 'user-123', 
        username: 'richard'
      });
      await ThreadTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread baru',
        body: 'body thread baru',
        ownerId: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      await CommentTableTestHelper.addComments({
        id: 'comment-123',
        content: 'content baru',
        threadId: 'thread-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_delete: false
      })

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      const deletedComment = await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comments = await CommentTableTestHelper.checkDeletedComment('comment-123');
      expect(comments).toHaveLength(0);
    })
  });

  describe('commentExists function', () => {
    it('should throw not found error when comment not exists', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)
      await expect(commentRepositoryPostgres.commentExists('comment-123')).rejects.toThrowError(NotFoundError);
    })

    it('should get comment when comment exists', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      await CommentTableTestHelper.addComments({
        id: 'comment-123',
        content: 'comment baru',
        ownerId: 'user-123',
        threadId: 'thread-123',
        is_delete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const comment = commentRepositoryPostgres.commentExists('comment-123');
      //assert
      expect(comment).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('checkUserComment function', () => {
    it('should throw auth error if user is not valid', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //buat user yang punya comment dan yang ngak punya comment
      await UsersTableTestHelper.addUser({ 
        id: 'user-123',
        username: 'richard'
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'alvin'
      });

      await ThreadTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread baru',
        body: 'body thread baru',
        ownerId: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      await CommentTableTestHelper.addComments({
        id: 'comment-123',
        content: 'comment baru',
        ownerId: 'user-123',
        threadId: 'thread-123',
        is_delete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      const comment = commentRepositoryPostgres.checkUserComment('comment-123', 'user-456');
      await expect(comment)
        .rejects
        .toThrowError(AuthorizationError)
    });

    it('should delete comment if user is valid', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //buat user yang punya comment dan yang ngak punya comment
      await UsersTableTestHelper.addUser({ 
        id: 'user-123',
        username: 'richard'
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'alvin'
      });

      await ThreadTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread baru',
        body: 'body thread baru',
        ownerId: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      await CommentTableTestHelper.addComments({
        id: 'comment-123',
        content: 'comment baru',
        ownerId: 'user-123',
        threadId: 'thread-123',
        is_delete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      const comment = commentRepositoryPostgres.checkUserComment('comment-123', 'user-123');
      await expect(comment)
        .resolves.not
        .toThrowError(AuthorizationError)
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should get comment by thread id', async () => {
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //buat user yang punya comment dan yang ngak punya comment
      await UsersTableTestHelper.addUser({ 
        id: 'user-123',
        username: 'richard'
      });
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'alvin'
      });

      await ThreadTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread baru',
        body: 'body thread baru',
        ownerId: 'user-123',
        created_at: '2024-05-06T20:00:00.992Z',
        updated_at: '2024-05-06T20:00:00.992Z',
      })

      await CommentTableTestHelper.addComments({
        id: 'comment-123',
        content: 'comment baru',
        ownerId: 'user-123',
        threadId: 'thread-123',
        is_delete: false,
        created_at: '2024-05-06T20:00:00.992Z',
        updated_at: '2024-05-06T20:00:00.992Z',
      })

      const comment = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      expect(comment).toStrictEqual([{
        id: 'comment-123',
        content: 'comment baru',
        username: 'richard',
        date: '2024-05-06T20:00:00.992Z',
      }]);
    })
  });
});