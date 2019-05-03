const _ = require('lodash')
const express = require('express')
const api = require('hexo-web-api/lib/api')
const utils = require('util')
const expressApp = express()

expressApp.use(express.json())
expressApp.use(express.urlencoded({
    extended: true
}))

module.exports = function (app) {
    const path = app ? utils.joinUrlPath(this.config.root, this.config.web_api.path) : this.config.web_api.path
    expressApp.use(path, api(this))

    if (app) {
        app.use(expressApp)
    } else {
        expressApp.listen(this.config.web_api.port, () => console.log(`Web api erver listening on port ${this.config.web_api.port}!`))
    }
}