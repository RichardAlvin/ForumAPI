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
    const { content, threadId } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
 
    //kalau mau ada huruf besar, harus pakai petik karena SQL bahasa yang case insensitive
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, "threadId", created_at, updated_at',
      values: [id, content, threadId, created_at, updated_at, false],
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
      text: 'SELECT EXISTS(SELECT 1 FROM comments WHERE id = $1)',
      values: [commentId]
    };

    const result = await this._pool.query(query);

    if (result) {
      throw new NotFoundError('Comment Not Found');
    }
  }
}
 
module.exports = CommentRepositoryPostgres;