const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted threads', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'dicoding',
        body: 'secret',
      };
      const userRequestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
        username: 'dicoding_indonesia'
      }

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Add User Action
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload
      })
      const userData = JSON.parse(userResponse.payload)

      // Login Action
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userData.data.addedUser.username,
          password: 'secret'
        }
      })
      const authData = JSON.parse(authResponse.payload)

      // Thread Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${authData.data.accessToken}`
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'dicoding',
      };
      const userRequestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
        username: 'dicoding_indonesia'
      }
      const server = await createServer(container);

      // Add User Action
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload
      })
      const userData = JSON.parse(userResponse.payload)

      // Login Action
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userData.data.addedUser.username,
          password: 'secret'
        }
      })
      const authData = JSON.parse(authResponse.payload)

      // Thread Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${authData.data.accessToken}`
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'dicoding',
        body: ['secret'],
      };
      const userRequestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
        username: 'dicoding_indonesia'
      }
      const server = await createServer(container);

      // Add User Action
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: userRequestPayload
      })
      const userData = JSON.parse(userResponse.payload)

      // Login Action
      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: userData.data.addedUser.username,
          password: 'secret'
        }
      })
      const authData = JSON.parse(authResponse.payload)

      // Thread Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${authData.data.accessToken}`
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 401 when request payload does not have access token', async () => {
      // Arrange
      const threadRequestPayload = {
        title: 'dicoding',
        body: 'secret',
      };

      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Thread Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized')
    })
  });
});
