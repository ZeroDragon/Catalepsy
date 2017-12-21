CATALEPSY
=======

Catalepsy is a medium-read-only wrapper that lets you get all user (public) posts, also get a single post in raw format, markdown or html

## Install

`yarn install catalepsy` or `npm install -S catalepsy`

## Usage

```javascript
const Catalepsy = require('catalepsy')
const catalepsy = new Catalepsy({
  siteUrl: 'http://test.com/', // defaults to https://medium.com/
  cdn: 'https://amazontest.com/', // defaults to https://cdn-images-1.medium.com/max/1600/
  cacheInMinutes: 5, // defaults to 1
  logger: console.log // put here your favourite logger defaults to no-logs
})
```

## Exposed methods

**getPosts** `Async function({username, limit})`  
username is the medium user's username. This is **required**  
limit is the number of latest post to fetch, defaults to 10  

**getPost** `Async function({ username, slug, format })`  
username is the medium user's username. This is  **required**  
slug is the desired post slug (you can get that from **getPosts**). This is **required**  
format is the result format, defaults to `html`

You can set one of three possible format options:.

  - `raw`: will return a *JSON* format just like medium returns it
  - `markdown`: will return the post in *markdown* format
  - `html`: will return the post in *html* format


## Examples:

```javascript
const getAllUserPosts = async (username,limit) => {
  const {status, data} = await catalepsy.getPosts({username, limit})
  // status is an HTTP Status code (200 or 500)
  // data is a JSON file with `posts` and `user`
}

const getPost = async (username, slug) => {
  const {data: html} = await catalepsy.getPost({username, slug})
  // HTML with the post

  const {data: raw} = await catalepsy.getPost({username, slug, 'raw'})
  // raw is the JSON from medium

  const {data: markdown} = await catalepsy.getPost({username, slug, 'markdown'})
  // markdown is the post in markdown format
}
```

## Develop

Must follow standard.js rules and keep test coverage over 90% to be able to commit

## Testing

Just run `yarn test` coverage should be 100%
