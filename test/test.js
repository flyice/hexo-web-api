const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded())

const Api = require('hexo-web-api/lib/api')
const Hexo = require('hexo')
const hexo = new Hexo(__dirname + '/../../../', {})
const authorizationHeader = {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaGV4byJ9LCJpYXQiOjE1NTYyNzI5NTd9.n7LescDLv3us4G1H5fyHXJT5eGIseu3Oq-38BdSh1Hw'
}
describe('API', function () {
    before(function (done) {
        hexo.init().then(function () {
            hexo.load().then(function () {
                const api = Api(hexo)
                app.use('/', api)
                done()
            })
        })
    })

    describe('GET /config', function () {
        it('should return 401 if no auth', function (done) {
            chai.request(app).get('/config').end(function (err, res) {
                expect(res).to.have.status(401)
                done(err)
            })
        })
        it('should return config json string', function (done) {
            chai.request(app).get('/config').set(authorizationHeader).end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property('title')
                done(err)
            })
        })
    })

    describe('GET /posts', function () {
        it('show return array', function (done) {
            chai.request(app).get('/posts').set(authorizationHeader).end(function (err, res) {
                expect(res).to.have.status(200)
                done(err)
            })
        })
    })

    describe('GET /posts/:id', function () {
        it('show return 404 if post not existed', function (done) {
            chai.request(app).get('/posts/fakeid').set(authorizationHeader).end(function (err, res) {
                expect(res).to.have.status(404)
                done(err)
            })
        })
    })
})