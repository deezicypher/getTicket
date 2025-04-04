import request from "supertest";
import { app } from "../../app";
import { signin } from "../../utils/test/signin";
import { natsWrapper } from "../../nats-wrapper";



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
  
it('returns an error if an invalid title is provided', async () => {
  const cookie = signin();
  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title:'',
    price:10
  })
  .expect(422)

  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    price:10
  })
  .expect(422)
})
it('returns an error if an invalid price is provided', async () => {
  const cookie = signin();
  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title:'flckshow',
    price:-10
  })
  .expect(422)
})
it('creates a ticket with valid input', async () => {
  const cookie = signin();
  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'HoodFlick',
    price: 50
  })
  .expect(201)

}) 

it('Publishes an event', async () => {
  const cookie = signin();
  await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie)
  .send({
    title: 'HoodFlick',
    price: 50
  })
  .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})
  
// GET/SHOW Tickets

it('returns a 404 if ticket is not found', async () => {
  await request(app)
  .get('/api/tickets/23')
  .send()
  .expect(404)
})
it('returns a 422 if ticket id is not a number', async () => {
  await request(app)
  .get('/api/tickets/hood')
  .send()
  .expect(422)
})
it('returns the ticket if the ticket is found', async () => {
  const cookie = signin()
  const title = 'hoodflick'
  const price = "20.00" 
  const response = await request(app)
  .post('/api/tickets/')
  .set('Cookie', cookie)
  .send({
      title,
      price 
  })
  .expect(201)

  
  const {id} = response.body
  const ticketResponse = await request(app)
  .get(`/api/tickets/${id}`)
  .send()
  .expect(200)

  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})

// Index

const createTicket = () => {
  const cookie = signin()
  const title = 'hoodflick'
  const price = "20.00" 
  return request(app)
  .post('/api/tickets/')
  .set('Cookie', cookie)
  .send({
      title,
      price 
  })
  .expect(201)
}
it('Can fetch a list of tickets', async() => {
  await createTicket()
  await createTicket()
  await createTicket()

  const response = await request(app) 
    .get('/api/tickets')
    .send()
    .expect(200)
  
  expect(response.body.length).toEqual(3)
})


// Update Tickets

it('returns a 404, if the provided id does not exist', async () => {
      const cookie = signin()

      return request(app)
        .put('/api/tickets/10')
        .set('Cookie', cookie)
        .send({
            title : 'hoodflick',
            price:40.00
        })
        .expect(404)
})

it('returns a 401, if the user is not authenticated', async () => {
      return request(app)
      .put('/api/tickets/10')
      .send({
          title : 'hoodflick',
          price:40.00
      })
      .expect(401)
})

it('returns a 403 if the user does not own the ticket', async () => {
  const cookie = signin()
  const response = await request(app)
      .post('/api/tickets')
      .set('Cookie',cookie)
      .send({
        title:'Hoodflick',
        price:30.00
      })

  await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', signin())
      .send({
        title: 'hoodhigh',
        price:10.00
      })
      .expect(403)
})

it('returns a 422 if the user provides an invalid title or price', async () => {
  const cookie = signin()
  const response = await request(app)
      .post('/api/tickets')
      .set('Cookie',cookie)
      .send({
        title:'Hoodflick',
        price:30.00
      })

  await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: -10
      })
      .expect(422)

})

it('updates the tickets, provided valid title or price', async () => {
  const cookie = signin()
  const response = await request(app)
      .post('/api/tickets')
      .set('Cookie',cookie)
      .send({
        title:'Hoodflick',
        price:30.00
      })

  await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'hoodhigh',
        price: 45.00
      })
      .expect(200)

      const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.id}`) 
            .send();

            expect(ticketResponse.body.title).toEqual('hoodhigh')
            expect(ticketResponse.body.price).toEqual("45.00")


})

it('it publishes an event on update', async () => {
  const cookie = signin()
  const response = await request(app)
      .post('/api/tickets')
      .set('Cookie',cookie)
      .send({
        title:'Hoodflick',
        price:30.00
      })

  await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'hoodhigh',
        price: 45.00
      })
      .expect(200)

      const ticketResponse = await request(app)
            .get(`/api/tickets/${response.body.id}`) 
            .send();
            expect(ticketResponse.body.title).toEqual('hoodhigh')
            expect(ticketResponse.body.price).toEqual("45.00");

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})