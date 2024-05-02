const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
 
describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await pool.end();
  });
 
  describe('addComment function', () => {
    it('should persist add comment', async () => {
      await ThreadTableTestHelper.addThreads({
        id: 'thread-123',
        title: 'thread baru',
        body: 'body thread baru',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      const addComment = new AddComment({
        content: 'dicoding',
        threadId: 'thread-123'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await commentRepositoryPostgres.addComment(addComment);
 
      // Assert
      const comments = await CommentTableTestHelper.findCommentsById('comment-123');
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
      await commentRepositoryPostgres.deleteComment('comment-123');
 
      // Assert
      const comments = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(0);
    })
  })
});