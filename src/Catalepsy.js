const request = require('request')
const memoize = require('memoizee')
const marked = require('marked')

class Trance {
  constructor (options = {}) {
    this.siteUrl = options.siteUrl || 'https://medium.com/'
    this.cdn = options.cdn || 'https://cdn-images-1.medium.com/max/1600/'
    this.cacheInMinutes = options.cacheInMinutes || 1
    this.logger = options.logger || function () {}
    this.requester = memoize(this.fn, { maxAge: 1000 * 60 * this.cacheInMinutes })
  }
  fn (resource, username, limit, slug) {
    const uri = encodeURI((resource === 'posts')
      ? `${this.siteUrl}@${username}`
      : `${this.siteUrl}@${username}/${slug}`)
    this.logger(`hitting ${uri} with`, {limit})
    return new Promise(resolve => {
      request(
        {
          method: 'GET',
          uri,
          qs: {
            format: 'json',
            limit
          }
        }, (err, response, result) => {
        if (err) return resolve({status: 500, body: null})
        const body = JSON.parse(result.replace('])}while(1);</x>', ''))
        return resolve({
          status: 200,
          body
        })
      }
      )
    })
  }
  objectFilter (layout, data) {
    const result = {}
    layout.forEach((item) => {
      result[item] = data[item]
    })
    return result
  }
  parsePosts (posts) {
    const resultPosts = []
    Object.keys(posts).forEach(key => {
      const post = posts[key]
      const result = this.objectFilter(
        ['title', 'slug', 'id', 'latestPublishedAt'],
        post
      )
      result.uniqueSlug = `${result.slug}-${result.id}`
      result.subtitle = post.content.subtitle
      result.previewImage = `${this.cdn}${post.virtuals.previewImage.imageId}`
      resultPosts.push(result)
    })
    return resultPosts
  }
  async getPosts ({ username, limit = 10 }) {
    const data = await this.requester('posts', username, limit)
    const { status, body } = data
    if (!body) return data
    return {
      status,
      data: {
        user: this.objectFilter(['userId', 'name', 'username'], body.payload.user),
        posts: this.parsePosts(body.payload.references.Post)
      }
    }
  }
  async getPost ({ username, slug, format }) {
    const data = await this.requester('post', username, 1, slug)
    const { body } = data
    if (!body) return data
    const resultRaw = body.payload.value.content.bodyModel.paragraphs
      .map(par => {
        const retval = this.objectFilter(['text', 'type', 'metadata'], par)
        if (retval.metadata) {
          retval.metadata = `${this.cdn}${this.objectFilter(['id'], retval.metadata).id}`
        }
        return retval
      })
    if (format === 'raw') return {status: 200, data: resultRaw}
    const resultMarkdown = resultRaw.map(({text, type, metadata}) => {
      switch (type) {
        case 1:
          return `${text}\r\n`
        case 3:
          return `# ${text}`
        case 4:
          return `![${text}](${metadata} "${text}")\r\n`
        case 6:
          return `> ${text.replace(/\n/gi, '\r\n> ')}\r\n`
        default:
          return text
      }
    }).join('\r\n')
    if (format === 'markdown') return {status: 200, data: resultMarkdown}
    return {status: 200, data: marked(resultMarkdown)}
  }
}

module.exports = Trance
