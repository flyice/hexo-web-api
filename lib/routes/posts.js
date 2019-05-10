const router = require('express').Router()
const _ = require('lodash')
const utils = require('../utils')
const path = require('path')
const fs = require('fs')

module.exports = function (hexo) {
    const Post = hexo.model('Post')

    //default return posts and drafts, query args include published, 
    //limit,skip,orderby default is slug
    router.get('/', function (req, res) {
        const query = {}
        const opts = {}

        if (!_.isUndefined(req.query.published)) {
            const published = req.query.published.toLowerCase()
            if (_.includes(['true', 'false'], published)) {
                query.published = published === 'true'
            }
        }

        if (!_.isUndefined(req.query.limit)) {
            const limit = _.parseInt(req.query.limit)
            if (_.isInteger(limit) && limit > 0) {
                opts.limit = limit
            }
        }

        if (!_.isUndefined(req.query.skip)) {
            const skip = _.parseInt(req.query.skip)
            if (_.isInteger(skip) && skip > 0) {
                opts.skip = skip
            }
        }

        let posts = Post.find(query, opts)

        if (!_.isUndefined(req.query.orderby)) {
            const orderby = req.query.orderby.toLowerCase()
            posts = posts.sort(orderby)
        }

        const result = _.map(posts.toArray(), function (post) {
            return _.pick(utils.sanitizePost(post), ['title', 'slug', 'date', 'updated', 'published', 'layout', 'source',
                'comments', 'tags', 'categories'
            ])
        })

        res.json(result)
    })

    //create post
    router.post('/', function (req, res) {
        if (!req.body.title) return res.status(400).json({
            message: 'title is required'
        })

        hexo.post.create(
            req.body,
            error => {
                if (error) res.status(500).json({
                    message: error
                })
            }).then(post => {
            res.status(201).json(post)
        })
    })

    //get post by slug,default will find in posts and drafts, 
    //you can provide published query arg to find in posts or drafts
    router.get('/:layout(post|draft)/:slug', function (req, res) {
        const query = {
            slug: req.params.slug,
            published: req.params.layout === 'post'
        }

        const post = Post.findOne(query)

        if (!post) return res.sendStatus(404)

        res.json(utils.sanitizePost(post))
    })

    //update posts, args inclue front-matter, content
    //fornt-matter is a map,content is a string
    router.patch('/:layout(post|draft)/:slug', function (req, res) {
        const query = {
            slug: req.params.slug,
            published: req.params.layout === 'post'
        }

        const post = Post.findOne(query)

        if (!post) return res.sendStatus(404)


    })

    //publish a draft
    router.patch('/publish/:slug', function (req, res) {
        const query = {
            slug: req.params.slug,
            published: false
        }

        const post = Post.findOne(query)

        if (!post) return res.sendStatus(404)

        req.body.slug = req.params.slug

        hexo.post.publish(req.body, function (error) {
            if (error) res.status(500).json({
                message: error
            })
        }).then(function (post) {
            res.json(post)
        })
    })

    //delete post
    router.delete('/:layout(post|draft)/:slug', function (req, res) {
        const query = {
            slug: req.params.slug,
            published: req.params.layout === 'post'
        }

        const post = Post.findOne(query)

        if (!post) return res.sendStatus(404)

        //delte source file
        fs.unlink(post.full_source, function (error) {
            if (error) return res.status(500).json({
                message: error
            })

            //if assert dir exsit, then delete it
            fs.rmdir(post.asset_dir, function (error) {})

            res.sendStatus(204)
        })

    })

    return router
}