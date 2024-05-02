const routes = (handler) => ([
    {
      method: 'POST',
      path: '/threads',
      handler: handler.postThreadsHandler,
    },
    {
      method: 'GET',
      path: '/threads/{threadId}',
      handler: handler.detailThreadsHandler,
    }
]);

module.exports = routes;