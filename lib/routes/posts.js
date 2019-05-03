const router = require('express').Router()
const _ = require('lodash')
const util = require('hexo-web-api/lib/util')

module.exports = function (hexo) {
    //get posts
    router.get('/', function (req, res) {
        let posts = hexo.model('Post').toArray()

        posts = _.map(posts, function (post) {
            return _.pick(post, ['title', 'published', 'date', 'updated', 'slug'])
        })

        res.json(posts)
    })

    //create post
    router.post('/', async function (req, res) {
        hexo.post.create(
            _.pick(req.body, ['title', 'slug', 'layout', 'path', 'date']),
            function (error) {
                res.json({
                    result: Boolean(!error)
                })
            })
    })

    //get post by slug
    router.get('/:slug', function (req, res) {
        const posts = hexo.model('Post').toArray()
        const post = _.find(posts, ['slug', req.params.slug])

        if (!post) return res.sendStatus(404)

        res.json(util.sanitizePost(post))
    })

    router.put('/:slug', function (req, res) {})

    //delete post
    router.delete('/:slug', function (req, res) {})

    //publish post
    router.post('/publish/:slug', function (req, res) {

    })

    return router
}