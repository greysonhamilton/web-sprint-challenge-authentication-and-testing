// Write your tests here
const supertest  = require('supertest');
const server = require('../api/server');
const db = require('../data/dbConfig');

const testUser = {

	username:"userUser",
	password:"012345"

}

describe('Tests the auth against the user db', () => {

    test('Sanity Check', ()=>{
        expect(1+5).toEqual(6)
        expect(1*5).not.toEqual(6)
    })

    test('will grab all users', async () => {

        const res = await supertest(server).get('/api/auth/users')
        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body[0].username).toBe("foo")
    })

    test('will register a user', async () => {

        const res = await supertest(server)
            .post('/api/auth/register')
            .send({
                username: "Guardian",
                password:'543210'
            })
        expect(res.statusCode).toBe(201)
        expect(res.type).toBe('application/json')
        expect(res.body.username).toBe("Guardian")
    })

    test('will not register a duplicate', async () => {

        const res = await supertest(server)
            .post('/api/auth/register')
            .send({
                username: "Guardian",
                password:'012345'
            })

        expect(res.statusCode).toBe(418)
        expect(res.type).toBe('application/json')
        expect(res.body.message).toBe("username taken")
    })

    test('users receive token on login', async () => {

        const res = await supertest(server)
            .post('/api/auth/login')
            .send({
                username:"Guardian",
                password:'543210'
            })

        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body.token).toBeDefined()
    })

    test('wrong credentials are denied', async () => {

        const res = await supertest(server)
            .post('/api/auth/login')
            .send({
                username:"Guardians",
                password:'Visitor'
            })

        expect(res.statusCode).toBe(404)
        expect(res.body.message).toBe("invalid credentials")
    })

})

describe('joke testing' , () => {

    test('am I funny?', ()=>{
        const grey = true;
        const funny = true;
        expect(grey).toBe(funny)
    })

    test('grab the rest of the jokes', async ()=>{
        
        const {body:{token}} = await supertest(server)
            .post('/api/auth/login')
            .send({
                username: "Guardian",
                password:'543210'
            })

        const res = await supertest(server)
            .get('/api/jokes')
            .set('authorization', token)

        expect(res.statusCode).toBe(200)
        expect(res.type).toBe('application/json')
        expect(res.body[0].id).toBe("0189hNRf2g")
    })

    test('jokes denied on bad login', async () => {

        const res = await supertest(server)
            .get('/api/jokes')
            .set('authorization', "f4k3_t0k3n")

        expect(res.statusCode).toBe(401)
        expect(res.type).toBe('application/json')
        expect(res.body.message).toBe('token invalid')
    })
    
})