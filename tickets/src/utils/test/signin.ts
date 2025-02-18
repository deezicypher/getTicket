import { app } from "../../app";
import request from 'supertest'
import jwt from "jsonwebtoken";


export const signin = () => {
    // Build a JWT payload, {id}
    const payload = {id:1}
    // Create the JWT!
    const token = jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`);

  // Build session Object. { jwt: MY_JWT }
  const session = { accesstoken: token };
  
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  
  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];  
}