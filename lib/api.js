const router = require('express').Router()

module.exports = function (hexo) {
    const auth = require('hexo-web-api/lib/middlewares/authenticate')(hexo.config.web_api)

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
}