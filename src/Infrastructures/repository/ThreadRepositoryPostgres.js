const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
 
class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }
 
  async addThread(registerThread) {
    const { title, body } = registerThread;
    const id = `thread-${this._idGenerator()}`;
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
 
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, created_at, updated_at',
      values: [id, title, body, created_at, updated_at],
    };
 
    const result = await this._pool.query(query);
 
    return new RegisteredThread({ ...result.rows[0] });
  }

  async detailThread(threadId){
    const query = {
      text: 'SELECT * FROM threads WHERE $1',
      values: [threadId]
    }

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}
 
module.exports = ThreadRepositoryPostgres;