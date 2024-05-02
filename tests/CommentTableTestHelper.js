/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComments({
    id = 'comment-123', content = 'dicoding', threadId = 'thread-123', created_at = new Date().toISOString(), updated_at = new Date().toISOString(), is_delete = false
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, threadId, created_at, updated_at, is_delete],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async checkDeletedComment(id){
    const query = {
      text: 'SELECT * from comments WHERE id = $id AND is_delete = $2',
      values: [id, false],
    }

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments, threads');
  },
};

module.exports = CommentsTableTestHelper;
