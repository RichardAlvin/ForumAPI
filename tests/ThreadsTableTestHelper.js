/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThreads({
    id = 'thread-123', title = 'dicoding', body = 'secret', ownerId = 'user-123',created_at = new Date().toISOString(), updated_at = new Date().toISOString()
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, title, body, ownerId, created_at, updated_at],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments, threads');
  },
};

module.exports = ThreadsTableTestHelper;
