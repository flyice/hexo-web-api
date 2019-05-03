const router = require('express').Router()

module.exports = function (hexo) {
    const auth = require('hexo-web-api/lib/middlewares/authenticate')(hexo.config.webapi)

    router.use('/auth', auth.local, function (req, res) {
        res.json(auth.getToken())
    })

    router.use('/config', auth.jwt, function (req, res) {
        res.json(hexo.config)
    })

    router.use('/posts', auth.jwt, require('./routes/posts')(hexo))
    // app.use('/categories', auth.jwt, require('./routes/categories')(hexo))
    // app.use('/pages', auth.jwt, require('./routes/pages')(hexo))
    // app.use('/tags', auth.jwt, require('./routes/tags')(hexo))

    return router
    // router.post('/auth', auth.local, function (req, res) {
    //     res.json(auth.getToken())
    // })

    // router.use(auth.jwt)

    // router.get('/config', function (req, res) {
    //     res.json(repo.getConfig())
    // })

    // router.get('/posts', function (req, res) {
    //     res.json(repo.getPosts())
    // })

    // router.get('/posts/:id', function (req, res) {
    //     const post = repo.getPost(req.params.id)
    //     const status = post ? 200 : 404
    //     res.status(status).json(post)
    // })

    // router.get('/categories', function (req, res) {
    //     res.json(repo.getCategories())
    // })

    // router.get('/categories/id', function (req, res) {
    //     res.json(repo.getCategory(req.params.id))
    // })

    // router.get('/tags', function (req, res) {
    //     res.json(repo.getTags())
    // })

    // return router
}