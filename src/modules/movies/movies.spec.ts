import req from 'supertest';
import app from '../../index';
import { testUserData, testAdminData } from '../../server/Settings';

const headers = { Authorization: '' };
// let userId = '';

describe('Movie Endpoints', () => {
  describe('Get public methods', () => {
    test('Get Movies list and Movie Details', async () => {
      const movies = await req(app).get('/movies/all');
      expect(movies.status).toBe(200);
      expect(movies.body.data).toBeInstanceOf(Array);
      for (let i = 0; i < movies.body.data.length; i++) {
        const element = movies.body.data[i];
        const movie = await req(app).get(`/movies/one/${element._id}`);
        expect(movie.body.data).toBeInstanceOf(Object);
        expect(typeof movie.body.data.name === 'string').toEqual(true);
        expect(movie.body.data.isApproved).toBe(true);
      }
    });
  });

  describe('only users can request add movie to list', () => {
    test('Error when trying to send a movie without Authorization headers', async () => {
      const res = await req(app).post('/movies/one').send({});
      expect(res.status).toBe(400);
    });

    test('Error when trying to send a movie with headers malformed', async () => {
      const res1 = await req(app).post('/movies/one').send({}).set({ Authorization: '' });
      expect(res1.status).toBe(400);
      const res2 = await req(app).post('/movies/one').send({}).set({ Authorization: 'Bearer ' });
      expect(res2.status).toBe(400);
    });

    test('Error when trying to send a movie with invalid Bearer token', async () => {
      const res = await req(app).post('/movies/one').send({}).set({ Authorization: 'Bearer asdadsa' });
      expect(res.status).toBe(400);
    });

    test('User authenticated can request add movie, modified and delete', async () => {
      const user = await req(app).post('/auth').send(testUserData);
      expect(user.status).toBe(200);
      expect(user.body.data.token).toBeDefined();

      // wink wink
      headers.Authorization = `Bearer ${String(user?.body?.data?.token)}`;
      const resPost = await req(app).post('/movies/one').send({ name: 'Blanca Nieves' }).set(headers);
      expect(resPost.status).toBe(200);
      expect(resPost.body.data.isApproved).toBe(false);

      const resPut = await req(app)
        .put(`/movies/one/${resPost.body.data._id}`)
        .send({ name: 'Blanca Nieves (2023)' })
        .set(headers);
      expect(resPut.status).toBe(200);
      expect(resPut.body.data).toBeDefined();
      expect(resPut.body.data.isApproved).toBe(false);
      expect(resPut.body.data.name).toBe('Blanca Nieves (2023)');

      const resDel = await req(app).delete(`/movies/one/${resPut.body.data._id}`).set(headers);
      expect(resDel.status).toBe(204);
    });

    test("Users can't get or approved Movies", async () => {
      const resGet = await req(app).get('/movies/notapproved').set(headers);
      expect(resGet.status).toBe(403);

      const movieApproved = await await req(app).put('/movies/notapproved').set(headers);
      expect(movieApproved.status).toBe(403);
    });

    test('Only Admins can get and approved Movies', async () => {
      const admin = await req(app).post('/auth').send(testAdminData);
      // wink wink
      headers.Authorization = `Bearer ${String(admin?.body?.data?.token)}`;

      const movie1 = await req(app).post('/movies/one').send({ name: 'Blanca Nieves 1' }).set(headers);
      expect(movie1.body.data.isApproved).toBe(false);
      const movie2 = await req(app).post('/movies/one').send({ name: 'Blanca Nieves 2' }).set(headers);
      expect(movie2.body.data.isApproved).toBe(false);

      const moviesToApproved = await req(app).get('/movies/notapproved').set(headers);
      expect(moviesToApproved.status).toBe(200);
      expect(moviesToApproved.body.data).toBeInstanceOf(Array);
      for (let i = 0; i < moviesToApproved.body.data.length; i++) {
        const element = moviesToApproved.body.data[i];
        const movie = await req(app).get(`/movies/one/${element._id}`);
        expect(movie.body.data).toBeInstanceOf(Object);
        expect(typeof movie.body.data.name === 'string').toEqual(true);
        expect(movie.body.data.isApproved).toBe(false);
      }

      const toApprove = [movie1.body.data._id, movie2.body.data._id];
      const moviesApproved = await req(app).put('/movies/notapproved').send(toApprove).set(headers);
      expect(moviesApproved.status).toBe(200);
      expect(moviesApproved.body.data).toBeInstanceOf(Array);
      expect(moviesApproved.body.data[0].isApproved).toBe(true);
      expect(moviesApproved.body.data[1].isApproved).toBe(true);

      const delMovie1 = await req(app).delete(`/movies/one/${moviesApproved.body.data[0]._id}`).set(headers);
      expect(delMovie1.status).toBe(204);
      const delMovie2 = await req(app).delete(`/movies/one/${moviesApproved.body.data[1]._id}`).set(headers);
      expect(delMovie2.status).toBe(204);
    });
  });
});
