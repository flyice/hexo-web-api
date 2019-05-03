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

exports.sanitizeCatOrTag = function (object) {
    return _.mapValues(object, function (v, k) {
        if (k == 'posts') {

            return _.map(v.toArray(), function (o) {
                return {
                    _id: o._id,
                    title: o.title,
                }
            })
        }
        return v
    })
}

exports.joinUrlPath = function (...args) {
    args = _.filter(args, value => value != '/')
    return '/' + _.join(_.map(args, value => _.trim(value, '/')), '/') + '/'
}