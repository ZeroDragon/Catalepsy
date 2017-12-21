const Catalepsy = require('./Catalepsy')
const mockCB = require('request')
const marked = require('marked')
const {mockHTML, mockPost, mockallPosts, mockResultRaw} = require('./__mocks__/requestData')
jest.mock('request', () => jest.fn())

describe('Validate errors', () => {
  it('should get default values', async () => {
    const username = 'test'
    const logger = jest.fn()
    const catalepsy = new Catalepsy()
    mockCB.mockImplementationOnce((params, cb) => cb(new Error('da Err'), '', ''))
    const {status, data} = await catalepsy.getPosts({username})
    expect(mockCB).toHaveBeenCalledWith(
      {'method': 'GET', 'qs': {'format': 'json', 'limit': 10}, 'uri': 'https://medium.com/@test/latest'},
      expect.any(Function)
    )
    expect(logger).not.toHaveBeenCalled()
    expect(status).toBe(500)
    expect(data).toEqual()
  })
  it('should catch request error', async () => {
    const username = 'test'
    const logger = jest.fn()
    const catalepsy = new Catalepsy({logger})
    mockCB.mockImplementationOnce((params, cb) => cb(new Error('da Err'), '', ''))
    const {status, data} = await catalepsy.getPost({username})
    expect(mockCB).toHaveBeenCalledWith(
      {'method': 'GET', 'qs': {'format': 'json', 'limit': 1}, 'uri': 'https://medium.com/@test/undefined'},
      expect.any(Function)
    )
    expect(logger).toHaveBeenCalledWith(
      'hitting https://medium.com/@test/undefined with',
      {'limit': 1}
    )
    expect(status).toBe(500)
    expect(data).toEqual()
  })
})

describe('Catalepsy all user public posts', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should fetch from medium only once', async () => {
    const username = 'test'
    const logger = jest.fn()
    const catalepsy = new Catalepsy({logger})
    mockCB.mockImplementationOnce((params, cb) => cb(null, '', `])}while(1);</x>${JSON.stringify(mockallPosts)}`))
    const {status, data} = await catalepsy.getPosts({username, limit: 10})
    expect(mockCB).toHaveBeenCalledWith(
      {'method': 'GET', 'qs': {'format': 'json', 'limit': 10}, 'uri': 'https://medium.com/@test/latest'},
      expect.any(Function)
    )
    expect(logger).toHaveBeenCalledWith(
      'hitting https://medium.com/@test/latest with',
      {'limit': 10}
    )
    expect(status).toBe(200)
    expect(data).toEqual({
      posts: expect.any(Array),
      user: expect.any(Object)
    })

    const {status: status2, data: data2} = await catalepsy.getPosts({username, limit: 10})
    expect(logger).toHaveBeenCalledTimes(1)
    expect(status).toEqual(status2)
    expect(data).toEqual(data2)
  })
})
describe('Catalepsy one public post', () => {
  const username = 'test'
  const slug = 'title-text-xyz321'
  const logger = jest.fn()
  const catalepsy = new Catalepsy({
    siteUrl: 'http://test.com/',
    cdn: 'https://amazontest.com/',
    cacheInMinutes: 1,
    logger
  })

  it('should fetch one post in RAW format', async () => {
    mockCB.mockImplementationOnce((params, cb) => cb(null, '', `])}while(1);</x>${JSON.stringify(mockPost)}`))
    const { data } = await catalepsy.getPost({username, slug, format: 'raw'})
    expect(mockCB).toHaveBeenCalledWith(
      {'method': 'GET', 'qs': {'format': 'json', 'limit': 1}, 'uri': 'http://test.com/@test/title-text-xyz321'},
      expect.any(Function)
    )
    expect(logger).toHaveBeenCalledWith(
      'hitting http://test.com/@test/title-text-xyz321 with',
      {'limit': 1}
    )
    expect(data).toEqual(mockResultRaw)
  })
  it('should fetch one post in MARKDOWN format', async () => {
    mockCB.mockImplementationOnce((params, cb) => cb(null, '', `])}while(1);</x>${JSON.stringify(mockPost)}`))
    const { data: data2 } = await catalepsy.getPost({username, slug, format: 'markdown'})
    expect(mockCB).toHaveBeenCalledTimes(1)
    expect(logger).toHaveBeenCalledTimes(1)
    expect(marked(data2)).toEqual(mockHTML)
  })
  it('should fetch one post in HTML format', async () => {
    mockCB.mockImplementationOnce((params, cb) => cb(null, '', `])}while(1);</x>${JSON.stringify(mockPost)}`))
    const { data: data3 } = await catalepsy.getPost({username, slug})
    expect(mockCB).toHaveBeenCalledTimes(1)
    expect(logger).toHaveBeenCalledTimes(1)
    expect(data3).toEqual(mockHTML)
  })
})
