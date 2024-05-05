const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
 
class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
 
  async addThread(registerThread) {
    const { title, body, ownerId } = registerThread;
    const id = `thread-${this._idGenerator()}`;
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
 
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, body, "ownerId", created_at, updated_at',
      values: [id, title, body, ownerId, created_at, updated_at],
    };
    const result = await this._pool.query(query);

    return new RegisteredThread({ ...result.rows[0] });
  }

  async detailThread(threadId){
    const query = {
      text: 'SELECT t.id, t.title, t.body, t.created_at as "date", u.username FROM threads t JOIN users u ON t."ownerId" = u.id WHERE t.id = $1',
      values: [threadId]
    }

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async threadExists(threadId){
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread Not Found');
    }
  }
}
 
module.exports = ThreadRepositoryPostgres;