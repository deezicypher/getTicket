import request from "supertest"
import { app } from "../../app"
import { signin } from "../../utils/test/signin";

it('returns an error if the ticket does not exist', async () => {
    const cookie = signin();
    const ticketId = 1

    await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ticketId})
        .expect(404)

})

it('returns an error if the ticket is already reserved', async () => {

})

it('reserves a ticket', async () => {

})