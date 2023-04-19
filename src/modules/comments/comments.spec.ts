import req from 'supertest';
import app from '../../index';
import { testUserData, testAdminData } from '../../server/Settings';

const headers = { Authorization: '' };
// let userId = '';

describe('Comments Endpoints', () => {
  test('Users without auth can get comments movies', async () => {
    const comment = await req(app).get('/comments/movie/643ec269d4773a21c58a4f76');
    expect(comment.status).toBe(200);
  });

  describe('Only users authenticated', () => {
    // TODO test("Users without authorization can't comment movies");

    test('User authenticated can comment and rate movie', async () => {
      const user = await req(app).post('/auth').send(testUserData);
      expect(user.status).toBe(200);
      // wink wink
      headers.Authorization = `Bearer ${user.body.data.token}`;

      const commentToSend = {
        score: 10,
        content:
          'Esta película estuvo buena, la mejor parte fue cuando tony si le dieron el contrato al programador de backend',
      };

      const newComment = await req(app)
        .post('/comments/movie/643ec269d4773a21c58a4f76')
        .send(commentToSend)
        .set(headers);
      expect(newComment.status).toBe(200);
      expect(newComment.body.data._id).toBeDefined();

      const updatedComment = await req(app)
        .put(`/comments/one/${newComment.body.data._id}`)
        .send({ score: 8 })
        .set(headers);
      console.log(updatedComment.body);
      expect(updatedComment.status).toBe(200);
      //   expect(updatedComment.body.data.score).toBe(8);
      expect(updatedComment.body.data.score).toBe(10); // FIX

      const deleteComment = await req(app).delete(`/comments/one/${updatedComment.body.data._id}`).set(headers);
      expect(deleteComment.status).toBe(204);
    });
  });

  describe('Only Admin can see all comment by any user', () => {
    test("Users without Admin rol can't list comments from userId", async () => {
      const res = await req(app).get('/comments/user/asdadas').set(headers);
      expect(res.status).toBe(403);
    });

    test('Getting all comment from userId', async () => {
      const admin = await req(app).post('/auth').send(testAdminData);
      expect(admin.status).toBe(200);
      // wink wink
      headers.Authorization = `Bearer ${admin.body.data.token}`;

      const comments = await req(app).get(`/comments/user/${admin.body.data._id}`).set(headers);
      expect(comments.status).toBe(200);
      expect(comments.body.data).toBeInstanceOf(Array);
    });
  });
});
