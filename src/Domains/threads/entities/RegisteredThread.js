class RegisteredThread {
    constructor(payload) {
      this._verifyPayload(payload);
   
      const { id, title} = payload;
   
      this.id = id;
      this.title = title;
    }
   
    _verifyPayload({ id, title }) {
      if (!id || !title) {
        throw new Error('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }
   
      if (typeof id !== 'string' || typeof title !== 'string') {
        throw new Error('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
}

module.exports = RegisteredThread;