const routes = (handler) => ([
    {
      method: 'POST',
      path: '/threads/{threadId}/comments',
      handler: handler.postCommentsHandler,
    },
]);

module.exports = routes;