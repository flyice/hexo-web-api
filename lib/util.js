const _ = require('lodash')

exports.sanitizePost = function (post) {
    return _.mapValues(post, function (v, k) {
        if (k == 'categories' || k == 'tags') {

            return _.map(v.toArray(), function (o) {
                return {
                    _id: o._id,
                    name: o.name,
                }
            })
        }
        return v
    })
}