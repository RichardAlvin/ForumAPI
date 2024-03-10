const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
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
      // Arrange
      const addComment = new AddComment({
        content: 'dicoding'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await commentRepositoryPostgres.addComment(addComment);
 
      // Assert
      const comments = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });
 
    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'dicoding'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      await commentRepositoryPostgres.addComment(addComment);
 
      // Assert
      expect(addComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'dicoding',
      }));
    });
  });
});