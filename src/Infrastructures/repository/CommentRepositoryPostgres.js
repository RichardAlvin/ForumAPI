const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
 
class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
 
  async addComment(addComment) {
    const { content, threadId, ownerId } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
 
    //kalau mau ada huruf besar, harus pakai petik karena SQL bahasa yang case insensitive
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, "threadId", "ownerId", created_at, updated_at',
      values: [id, content, threadId, ownerId, created_at, updated_at, false],
    };
 
    const result = await this._pool.query(query);
 
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentId){
    const deleted_at = new Date().toISOString();
    const query = {
      text: 'UPDATE comments SET is_delete=$1, deleted_at=$2 WHERE id=$3',
      values: [true, deleted_at, commentId]
    }

    await this._pool.query(query);
  }

  async commentExists(commentId){
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment Not Found');
    }
  }

  async checkUserComment(commentId, ownerId){
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND "ownerId" = $2',
      values: [commentId, ownerId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('You can not delete another user comment');
    }
  }

  async getCommentByThreadId(threadId){
    const query = {
      text: `SELECT c.Id, u.username, c.created_at as "date", c.content, c.is_delete FROM comments c JOIN users u ON c."ownerId" = u.id WHERE c."threadId" = $1 ORDER BY c.created_at ASC`,
      values: [threadId]
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}
 
module.exports = CommentRepositoryPostgres;