const _ = require('lodash')
const app = require('hexo-web-api/lib/app')

hexo.config.webapi = _.assign({
    port: 4000,
    username: 'hexo',
    password: '$2b$10$FFG4HIVv.XHFN/RS7r/ale/onbUnJ83GQblJq1x51a3HDbUxCDdXq',
    secretOrKey: 'hexo',
    with_server: false,
    path: '/api',
}, hexo.config.webapi)

hexo.extend.console.register('bcrypt', 'Use bcrypt to generate hash password', {
    useage: '<password>',
    arguments: [{
        name: 'password',
        desc: 'password to hash',
    }]
}, require('./lib/hash_password'))

if (hexo.config.webapi.with_server) {
    hexo.extend.filter.register('server_middleware', app)
} else {
    hexo.extend.console.register('webapi', 'Start web api server', function (args) {
        hexo.watch().then(() => app.call(hexo))
    })
}