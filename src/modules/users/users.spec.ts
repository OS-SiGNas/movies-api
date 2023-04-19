import req from 'supertest';
import app from '../../index';
import { testUserData } from '../../server/Settings';

const headers = { Authorization: '' };
let userId = '';

describe('Tesing Users enpoints', () => {
  describe('POST /auth', () => {
    test('username is required', async () => {
      const res = await req(app).post('/auth').send({ password: '' });
      expect(res.status).toBe(422);
      expect(res.body.error).toBeDefined();
      expect(res.body.error[0].errorType).toEqual('invalid_type');
    });

    test('password is required', async () => {
      const res = await req(app).post('/auth').send({ username: 'anyuser' });
      expect(res.status).toBe(422);
      expect(res.body.error).toBeDefined();
      expect(res.body.error[0].errorType).toEqual('invalid_type');
    });

    test('username can`t be empty', async () => {
      const res = await req(app).post('/auth').send({ username: '', password: '' });
      expect(res.status).toBe(422);
      expect(res.body.error).toBeDefined();
      expect(res.body.error[0].errorType).toEqual('too_small');
      expect(res.body.error[0].message).toEqual('username must be a minimun 3 characters');
      expect(res.body.error[1].errorType).toEqual('too_small');
    });

    test('too small password, need at least 10 characters', async () => {
      const res = await req(app).post('/auth').send({ username: 'anyuser', password: '123456789' });
      expect(res.status).toBe(422);
      expect(res.body.error).toBeDefined();
      expect(res.body.error[0].errorType).toEqual('too_small');
    });

    test('incorrect username or password', async () => {
      const res = await req(app).post('/auth').send({ username: 'anyuser', password: '1234567890' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
      expect(res.body.error).toEqual('Username or password is incorrect');
    });

    test('Login works', async () => {
      const res = await req(app).post('/auth').send(testUserData);
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();

      // wink wink
      headers.Authorization = `Bearer ${String(res?.body?.data?.token)}`;
    });
  });

  describe('Authorization Headers empty in /users', () => {
    test('GET, POST, PUT and DELETE Need Authorization headers', async () => {
      const resGet = await req(app).get('/users');
      expect(resGet.status).toBe(400);
      expect(resGet.body.error).toEqual('Missing authorization headers');

      const resPost = await req(app).post('/users');
      expect(resPost.status).toBe(400);
      expect(resPost.body.error).toEqual('Missing authorization headers');

      const resPut = await req(app).put('/users');
      expect(resPut.status).toBe(400);
      expect(resPut.body.error).toEqual('Missing authorization headers');

      const resDelete = await req(app).delete('/users');
      expect(resDelete.status).toBe(400);
      expect(resDelete.body.error).toEqual('Missing authorization headers');
    });
  });

  describe('Check Session and Roles in /users', () => {
    test('GET Array of users in db /users', async () => {
      const res = await req(app).get('/users').set(headers);
      expect(res.status).toBe(200);
      expect(res.body.data[0]).toBeDefined();

      // wink wink
      userId = res.body.data[0]._id;
    });

    test('GET, PUT and DELETE need _id param with 24 hex characters /users', async () => {
      const resGet = await req(app).get('/users/asda').set(headers);
      expect(resGet.status).toBe(422);
      expect(resGet.body.error[0].errorType).toEqual('too_small');

      const resPut = await req(app).put('/users/asda').set(headers);
      expect(resPut.status).toBe(422);
      expect(resPut.body.error[0].errorType).toEqual('too_small');

      const resDelete = await req(app).delete('/users/asda').set(headers);
      expect(resDelete.status).toBe(422);
      expect(resDelete.body.error[0].errorType).toEqual('too_small');
    });

    test('GET user [0] in DB /users', async () => {
      const res = await req(app).get(`/users/${userId}`).set(headers);
      expect(res.status).toBe(200);
    });
  });

  describe('Create, Update and Delete document', () => {
    test('POST create, can`t send empty body, and required keys', async () => {
      const res = await req(app).post('/users').set(headers).send({});
      expect(res.status).toBe(422);

      expect(res.body.error[0]).toBeDefined();
      expect(res.body.error[0].message).toEqual('Required');
      expect(res.body.error[0].path.includes('username')).toEqual(true);

      expect(res.body.error[1]).toBeDefined();
      expect(res.body.error[1].message).toEqual('Required');
      expect(res.body.error[1].path.includes('password')).toEqual(true);

      expect(res.body.error[2]).toBeDefined();
      expect(res.body.error[2].message).toEqual('Required');
      expect(res.body.error[2].path.includes('email')).toEqual(true);

      expect(res.body.error[3]).toBeDefined();
      expect(res.body.error[3].message).toEqual('Required');
      expect(res.body.error[3].path.includes('name')).toEqual(true);

      expect(res.body.error[4]).toBeDefined();
      expect(res.body.error[4].message).toEqual('Required');
      expect(res.body.error[4].path.includes('telf')).toEqual(true);

      expect(res.body.error[5]).toBeDefined();
      expect(res.body.error[5].message).toEqual('Required');
      expect(res.body.error[5].path.includes('active')).toEqual(true);

      expect(res.body.error[6]).toBeDefined();
      expect(res.body.error[6].message).toEqual('Required');
      expect(res.body.error[6].path.includes('roles')).toEqual(true);
    });

    // ID user test111
    let userTempId = '';

    test('POST create Temp user', async () => {
      const res = await req(app)
        .post('/users')
        .set(headers)
        .send({
          username: 'temp',
          password: '1111111111',
          email: 'temp@gmail.com',
          name: 'test temp test',
          telf: '+58 000 0000',
          active: false,
          roles: ['user'],
        });
      expect(res.status).toBe(201);

      // set _id in userTempId
      userTempId = res.body.data._id;
    });

    test('PUT Temp user', async () => {
      const res = await req(app)
        .put(`/users/${userTempId}`)
        .set(headers)
        .send({
          username: 'temp 2',
          password: '111111111r',
          email: 'temp2@gmail.com',
          name: 'testtemptest',
          telf: '+58 000 0001',
          active: true,
          roles: ['user'],
        });
      expect(res.status).toBe(200);
    });

    test('DELETE Temp user', async () => {
      const res = await req(app).delete(`/users/${userTempId}`).set(headers);
      expect(res.status).toBe(204);
    });
  });
});
