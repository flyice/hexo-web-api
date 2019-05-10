const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const fs = require('hexo-fs')
const express = require('express')
const path = require('path')
const Hexo = require('hexo')
const Api = require('hexo-web-api/lib/api')
const fsa = require('fs')
describe('API', function () {
    const authorizationHeader = {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaGV4byJ9LCJpYXQiOjE1NTYyNzI5NTd9.n7LescDLv3us4G1H5fyHXJT5eGIseu3Oq-38BdSh1Hw'
    }
    const hexo_path = path.join(__dirname, 'test')
    const hexo = new Hexo(hexo_path, {})
    const Post = hexo.model('Post')
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded())

    before(function () {
        hexo.init()
        hexo.config.web_api = {
            username: 'hexo',
            password: 'hexo',
            secret: 'hexo'
        }
        app.use('/', Api(hexo))
    })

    describe('GET /posts', function () {
        const ids = []
        before(function () {
            for (let index = 0; index < 10; index++) {
                let published = Boolean(index % 2)
                Post.insert({
                    title: `${index}`,
                    source: `${index}.md`,
                    slug: `${index}`,
                    published: published,
                    layout: published ? 'post' : 'draft'
                }).then(function (post) {
                    ids.push(post._id)
                })
            }

        })

        after(function () {
            for (const id of ids) {
                Post.removeById(id)
            }
        })

        it('should return posts list', function (done) {
            chai.request(app).get('/posts/').set(authorizationHeader).end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.a('array')
                expect(res.body).to.have.lengthOf(10)
                done(err)
            })
        })

        it('should return only posts when published is true', function (done) {
            chai.request(app).get('/posts/').query({
                published: true
            }).set(authorizationHeader).end(function (err, res) {
                expect(res.body).to.have.lengthOf(5)
                for (const post of res.body) {
                    expect(post.published).to.be.true
                    expect(post.layout).to.equal('post')
                }
                done(err)
            })
        })

        it('should return only drafts when published is false', function (done) {
            chai.request(app).get('/posts/').query({
                published: false
            }).set(authorizationHeader).end(function (err, res) {
                expect(res.body).to.have.lengthOf(5)
                for (const post of res.body) {
                    expect(post.published).to.be.false
                    expect(post.layout).to.equal('draft')
                }
                done(err)
            })
        })

        it('should return 6 posts when limit is 6, skip is 3', function (done) {
            chai.request(app).get('/posts/').query({
                limit: 6,
                skip: 3,
                orderBy: 'slug',
                order: 1
            }).set(authorizationHeader).end(function (err, res) {
                expect(res.body).to.have.lengthOf(6)
                expect(res.body[0]).to.have.property('slug', '3')
                expect(res.body[1]).to.have.property('slug', '4')
                done(err)
            })
        })
    })

    describe('GET /posts/:slug', function () {
        before(function () {
            Post.insert({
                title: 'test',
                source: 'test.md',
                slug: 'test',
                layout: 'draft',
                published: 'false'
            })
            Post.insert({
                title: 'test',
                source: 'test.md',
                slug: 'test',
                layout: 'post',
                published: 'true'
            })
        })

        it('should return a post', function (done) {
            chai.request(app).get('/posts/post/test').query({
                published: true
            }).set(authorizationHeader).end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('title', 'test')
                expect(res.body).to.have.property('updated')
                expect(res.body).to.have.property('slug', 'test')
                expect(res.body).to.have.property('layout', 'post')
                expect(res.body).to.have.property('published', true)
                done(err)
            })
        })

        it('should return a draft', function (done) {
            chai.request(app).get('/posts/draft/test').query({
                published: false
            }).set(authorizationHeader).end(function (err, res) {
                expect(res).to.have.status(200)
                expect(res.body).to.have.property('title', 'test')
                expect(res.body).to.have.property('updated')
                expect(res.body).to.have.property('slug', 'test')
                expect(res.body).to.have.property('layout', 'draft')
                expect(res.body).to.have.property('published', false)
                done(err)
            })
        })

        it('should return 404 if no post found', function (done) {
            chai.request(app).get('/posts/fakeslug').set(authorizationHeader).end(function (err, res) {
                expect(res).to.have.status(404)
                done(err)
            })
        })
    })
})