import { app } from "../../app";
import request from 'supertest'

export const signin =  async () => {
    const name = "testuser"
    const email = "testuser@gmail.com"
    const password = "password21"

    //declare a token variable
    let token ;
    // call signup request and assign the result to the signupres variable
     const signupres = await request(app)
        .post('/api/users/signup')
        .send({
            name,
            email,
            password
          }).expect(201)
  
          // Extract the token and store it in the token variable
          token = signupres.body.token;

          // call the activate account request with the token
           await request(app)
          .post('/api/users/activate')
          .send({
            token
          })
          .expect(200)
          // assign the login request result to loginres
          const loginres = await request(app)
          .post('/api/users/signin')
          .send({
            email,
            password
          }).expect(200);

          const cookie = loginres.get('Set-Cookie')
          if(!cookie) {
            throw new Error('failed to get cookie from response')
          }
          return cookie

        
  }
