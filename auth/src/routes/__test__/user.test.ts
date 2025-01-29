import request from "supertest"
import { app } from "../../app"


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