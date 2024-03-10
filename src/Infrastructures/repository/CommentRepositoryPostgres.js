const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
 
class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
 
  async addComment(addComment) {
    const { content } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
 
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, threadId, created_at, updated_at',
      values: [id, content, 'test', created_at, updated_at],
    };
 
    const result = await this._pool.query(query);
 
    return new AddedComment({ ...result.rows[0] });
  }
}
 
module.exports = CommentRepositoryPostgres;