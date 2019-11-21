const Catalepsy = require('catalepsy')
const catalepsy = new Catalepsy({logger: console.log})

const username = 'npmjs'
const limit = 1
const postsResponse = await catalepsy.getPosts({ username, limit })
const { uniqueSlug: slug } = postsResponse.data.posts[0]
const postResponse = await catalepsy.getPost({ username, slug })
console.log(postsResponse.data)
console.log(postResponse.data)
process.exit(0)
