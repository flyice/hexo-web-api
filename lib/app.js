const _ = require('lodash')
const express = require('express')
const api = require('hexo-web-api/lib/api')

const expressApp = express()

expressApp.use(express.json())
expressApp.use(express.urlencoded({
    extended: true
}))

module.exports = function (app) {
    const path = app ? joinUrlPath(this.config.root, this.config.webapi.path) : this.config.webapi.path
    expressApp.use(path, api(this))

    if (app) {
        app.use(expressApp)
    } else {
        expressApp.listen(this.config.webapi.port, () => console.log(`Web api erver listening on port ${this.config.webapi.port}!`))
    }
}

function joinUrlPath(...args) {
    args = _.filter(args, value => value != '/')
    return '/' + _.join(_.map(args, value => _.trim(value, '/')), '/') + '/'
}