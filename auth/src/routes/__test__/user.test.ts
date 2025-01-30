import request from "supertest"
import { app } from "../../app"
import { signin } from "../../utils/test/auth-helper"


it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name:"Oculus",
            email:"dave@gmail.com",
            password: "Wired2loop"
        })
        .expect(201)
})


it('returns a 422 for invalid email', async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email:"davegmail.com",
        password:"password2"
    })
    .expect(422)
})
it('returns a 422 for invalid password', async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email:"davegmail.com",
        password:"password"
    })
    .expect(422)
})
it('returns a 422 for missing email or password', async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:"",
        password:"djbjhbd6"
    })
    .expect(422)

    await request(app)
    .post('/api/users/signup')
    .send({
        email:"dave@gmail.com",
        password:""
    })
    .expect(422)
})

it('disallows duplicate email', async () => {
    //declare a token variable
    let token ;
    // call signup request and assign the result to the signupres variable
     const signupres = await request(app)
        .post('/api/users/signup')
        .send({
            name: "dave",
            email: "davex@gmail.com",
            password: "Wired2loop"
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
          // Attempt to signup again with the same credentials 
    await request(app)
      .post('/api/users/signup')
      .send({
        name: "dave",
        email: "davex@gmail.com",
        password: "Wired2loop"
      }).expect(422)
  
  });
  
  
  it('Login fails on invalid email', async () => {
    await request(app)
    .post('/api/users/signin')
    .send({
        email:"dave2@gmail.com",
        password:"wiered2"
    })
    .expect(422)
})

it('Fails on incorrect password', async () => {
     //declare a token variable
     let token ;
     // call signup request and assign the result to the signupres variable
      const signupres = await request(app)
         .post('/api/users/signup')
         .send({
             name: "dave",
             email: "davex@gmail.com",
             password: "Wired2loop"
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
           //Login with invalid password
          await request(app)
          .post('/api/users/signin')
          .send({
            email: "davex@gmail.com",
            password: "Wired2loo"
          }).expect(401)

})

it('Sets cookie after successful signup ', async () => {
        const cookie = await signin()
        // Expect the response to have a set-cookie header, be defined
        expect(cookie).toBeDefined();

})

it('clears the cookie after sign out', async () => {
    // Login
    await signin()
    // signout and assign the result to signoutres
    const signoutres = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200)
    const cookie = signoutres.get('Set-Cookie')
    if(!cookie) {
        throw new Error('Expected cookie but got undefined')
    }
    expect(cookie[0]).toEqual("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
})

it('Responds with details about current user', async () => {
    
          const cookie = await signin()
          if(!cookie) {
            throw new Error('Cookie not set after login')
        }
          // call the currentuser api and assign result to currentuser variable
          const currentuser = await request(app)
          .get('/api/users/currentuser')
          .set("Cookie",cookie)
          .send()
          .expect(200) 

          expect(currentuser.body.user.email).toEqual('testuser@gmail.com')
})