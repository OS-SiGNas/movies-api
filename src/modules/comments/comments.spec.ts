import req from 'supertest';
import app from '../../index';
import { testUserData, testAdminData } from '../../server/Settings';

const headers = { Authorization: '' };
// let userId = '';

describe('Comments Endpoints', () => {
  test('Users authenticated can get comments movies', async () => {
    const comment = await req(app).post('/comment/movie/643ec269d4773a21c58a4f76').send({});
  });

  describe('Users authenticated can comments movies and qualify', () => {
    test('Comment Movie', async () => {
      const res = await req(app).post('/comment/m').send({});
    });
  });
  // describe();
  // describe();
  // describe();
  // describe();
  // describe();
});
