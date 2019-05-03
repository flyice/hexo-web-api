const _ = require('lodash')
const app = require('hexo-web-api/lib/app')
const bcrypt = require('bcrypt')

hexo.config.web_api = _.assign({
    port: 4000,
    username: 'hexo',
    password: '$2b$10$FFG4HIVv.XHFN/RS7r/ale/onbUnJ83GQblJq1x51a3HDbUxCDdXq', //default password is hexo
    secret: 'hexo',
    with_server: false,
    path: '/api',
}, hexo.config.web_api)

//register console command brcrypt for hash password
hexo.extend.console.register('bcrypt', 'Use bcrypt to generate hash password', {
    useage: '<password>',
    arguments: [{
        name: 'password',
        desc: 'password to hash',
    }]
}, function (args) {
    if (args._[0]) {
        bcrypt.hash("${args._[0]}", 10, function (err, hash) {
            console.log(hash)
        });
    }
})

if (hexo.config.web_api.with_server) {
    //run with bulitin server
    hexo.extend.filter.register('server_middleware', app)
} else {
    //register console command for start server
    hexo.extend.console.register('webapi', 'Start web api server', function (args) {
        hexo.watch().then(() => app.call(hexo))
    })
}