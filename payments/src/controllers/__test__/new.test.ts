import request from "supertest";
import { app } from "../../app";
import { signin } from "../../utils/test/signin";
import pool from "../../config/db";
import { OrderStatus } from "@xgettickets/common";
import { stripe } from "../../stripe";

// jest.mock('../../stripe');

it('returns a 404, when purchasing an order that does not exist', async () => {
    await request(app)
    .post('/api/payments')
    .set('Cookie',signin())
    .send({
        token:"1nkn181n",
        orderId:1
    })
    .expect(404)
})

it("returns a 403 when purchasing an order that doesn't belong to the user", async () => {
    const q = "INSERT INTO orders (id,status,version,price,user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *"
    const {rows} = await pool.query(q,[1,OrderStatus.Created,0,50,1])
    const order = rows[0]

    await request(app)
    .post('/api/payments')
    .set('Cookie',signin())
    .send({
        token:"1nkn181n",
        orderId:order.id
    })
    .expect(403)
})

it('returns 400 when purchasing a cancelled order', async () => {
    const userId = 1
    const q = "INSERT INTO orders (id,status,version,price,user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *"
    const {rows} = await pool.query(q,[1,OrderStatus.Cancelled,0,50,userId])
    const order = rows[0]

    await request(app)
    .post('/api/payments')
    .set('Cookie',signin(userId))
    .send({
        token:"1nkn181n",
        orderId:order.id
    })
    .expect(400)
})

it('returns a 204 with valid inputs', async () => {
    const userId = 1;
    const price = Math.floor(Math.random()*100000);
    const q = "INSERT INTO orders (id,status,version,price,user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *";
    const {rows} = await pool.query(q,[1,OrderStatus.Created,0,price,1]);
    const order = rows[0];

    await request(app)
    .post('/api/payments')
    .set('Cookie',signin(userId))
    .send({
        token:"tok_visa",
        orderId:order.id
    })
    .expect(201);

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    // expect(chargeOptions.source).toEqual('tok_visa')
    // expect(chargeOptions.amount).toEqual(50 * 100)
    // expect(chargeOptions.currency).toEqual('usd')

    const stripeCharges = await stripe.charges.list({limit:10});
    const stripeCharge = stripeCharges.data.find(charge => {return charge.amount === price * 100});

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const paymentQ = "SELECT * FROM payments WHERE order_id = $1 AND stripe_id = $2";
    const {rows:paymentRow} = await pool.query(paymentQ,[order.id,stripeCharge!.id]);
    const payment = paymentRow[0];
    
    expect(payment).not.toBeNull();
})