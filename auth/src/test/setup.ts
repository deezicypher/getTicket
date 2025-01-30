import { Pool } from 'pg';
import request from 'supertest';
import dotenv from "dotenv"
import { app } from '../app';
dotenv.config()


// Create a new pool for the test database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeAll(async () => {
  // Run migrations or seed the database before running tests
  await pool.query(`CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" varchar NOT NULL,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL,
    "role" varchar NOT NULL DEFAULT 'USER',
    "created_at" timestamptz NOT NULL DEFAULT (now())
  );`);
});


afterAll(async () => {
  // Clean up the database after tests
  await pool.query('DROP TABLE IF EXISTS users');
  await pool.end();
});

beforeEach(async () => {
    // Clear the users table before each test
    await pool.query('DELETE FROM users');
  });



// global.signin = async () => {
//     const name = "testuser"
//     const email = "testuser@gmail.com"
//     const password = "password21"

//     //declare a token variable
//     let token ;
//     // call signup request and assign the result to the signupres variable
//      const signupres = await request(app)
//         .post('/api/users/signup')
//         .send({
//             name,
//             email,
//             password
//           }).expect(201)
  
//           // Extract the token and store it in the token variable
//           token = signupres.body.token;

//           // call the activate account request with the token
//            await request(app)
//           .post('/api/users/activate')
//           .send({
//             token
//           })
//           .expect(200)
//           // assign the login request result to loginres
//           const loginres = await request(app)
//           .post('/api/users/signin')
//           .send({
//             email,
//             password
//           }).expect(200);

//           const cookie = loginres.get('Set-Cookie')
//           if(!cookie) {
//             throw new Error('failed to get cookie from response')
//           }
//           return cookie

        
//   }