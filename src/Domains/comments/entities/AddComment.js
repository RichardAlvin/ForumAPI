class AddComment {
    constructor(payload) {
      this._verifyPayload(payload);
   
      const { content } = payload;
   
      this.content = content;
    }
   
    _verifyPayload({ content }) {
      if (typeof content !== 'string') {
        throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
   
  module.exports = AddComment;