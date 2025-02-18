import request from "supertest";
import { app } from "../../app";
import { signin } from "../../utils/test/signin";


it('has a route listening to /api/tickets for post request', async () => {
    const response = await request(app).post('/api/tickets').send({});
            expect(response.status).not.toEqual(404)
})
it('can only be accessed if the user is signed in', async () => {
    await request(app).post('/api/tickets').send({})
    .expect(401)
})
it('returns a status other than 401, when the user is signed in', async () => {
    const cookie = signin();  // Get the cookie string from signin()
  
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)  // Set the cookie for the request
      .send({});
    expect(response.status).not.toEqual(401);  // Should not return 401 if token is valid
  });
  
it('returns an error if an invalid title is provided', async () => {})
it('returns an error if an invalid price is provided', async () => {})
it('creates a ticket with ssvalid input', async () => {})