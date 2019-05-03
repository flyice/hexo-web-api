const Post = require('hexo-web-api/lib/models/post')
const _ = require('lodash')

class PostsRepository {
    constructor(hexo) {
        this.hexo = hexo;
    }

    getConfig() {
        return this.hexo.config;
    }

    getPosts() {
        let posts = this.hexo.model('Post').toArray()
        posts = _.map(posts, function (post) {
            return _.pick(post, ['title', 'published', 'date', 'updated', '_id'])
        })

        return posts
    }

    getPost(id) {
        const posts = this.hexo.model('Post').toArray()
        const post = _.find(posts, ['_id', id])

        return post ? this._sanitizePost(post) : null
    }

    getCategories() {
        let categories = this.hexo.model('Category').toArray()
        const self = this
        categories = _.map(categories, function (category) {
            return self._sanitizeCatOrTag(category)
        })

        return categories
    }

    getCategory(id) {
        const categories = this.hexo.model('Category').toArray()
        const category = _.find(categories, ['_id'], id)

        return category ? _sanitizeCatOrTag(category) : null
    }

    getTags() {
        let tags = this.hexo.model('Tag').toArray()
        const self = this
        tags = _.map(tags, function (tag) {
            return self._sanitizeCatOrTag(tag)
        })

        return tags
    }

    _sanitizePost(post) {
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

    _sanitizeCatOrTag(object) {
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

}

module.exports = function (hexo) {
    return new PostsRepository(hexo)
}