const bcrypt = require('bcrypt')

module.exports = function (args) {
    if (args._[0]) {
        bcrypt.hash("${args._[0]}", 10, function (err, hash) {
            console.log(hash)
        });
    }
}