const router = require('express').Router()
const _ = require('lodash')
const utils = require('../utils')
const path = require('path')
const fs = require('fs')

module.exports = function (hexo) {
    const Post = hexo.model('Post')

    //get posts,default will return posts and drafts
    router.get('/', function (req, res) {
        const query = {}
        const opts = {}
        let posts;

        if (!_.isUndefined(req.query.published) && _.includes(['true', 'false'], req.query.published)) {
            query.published = JSON.parse(req.query.published)
        }

        if (!_.isUndefined(req.query.limit)) {
            opts.limit = _.parseInt(req.query.limit)
        }

        if (!_.isUndefined(req.query.skip)) {
            opts.skip = _.parseInt(req.query.skip)
        }

        posts = Post.find(query, opts)

        const result = _.map(posts.toArray(), function (post) {
            return _.pick(utils.sanitizePost(post), ['_id', 'slug', 'title', 'published', 'date', 'updated', 'layout', 'tags', 'categories'])
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

    //get post by slug,default will find in posts and drafts, you can offer published query arg to reduce find in posts or drafts
    router.get('/:slug', function (req, res) {
        const query = {
            slug: req.params.slug
        }
        if (!_.isUndefined(req.query.published) && _.includes(['true', 'false'], req.query.published.toLowerCase())) {
            query.published = JSON.parse(req.query.published.toLowerCase())
        }

        const post = Post.findOne(query)

        if (!post) return res.sendStatus(404)

        res.json(utils.sanitizePost(post))
    })

    router.put('/:slug', function (req, res) {})

    //delete post
    router.delete('/:slug', function (req, res) {
        const query = {
            slug: req.params.slug
        }
        if (!_.isUndefined(req.query.published) && _.includes(['true', 'false'], req.query.published.toLowerCase())) {
            query.published = JSON.parse(req.query.published.toLowerCase())
        }

        const post = Post.findOne(query)

        if (!post) return res.status(400).json({
            message: 'invalid slug'
        })

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