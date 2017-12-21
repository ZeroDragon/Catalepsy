const mockHTML = `<p>something</p>
<p>something</p>
<h1 id="something">something</h1>
<p><img src="https://amazontest.com/some-hash" alt="something" title="something"></p>
<blockquote>
<p>something</p>
<ul>
<li>by someone</li>
</ul>
</blockquote>
`

const mockResultRaw = [
  {
    text: 'something',
    type: 1,
    metadata: undefined
  },
  {
    text: 'something',
    type: 2,
    metadata: undefined
  },
  {
    text: 'something',
    type: 3,
    metadata: undefined
  },
  {
    text: 'something',
    type: 4,
    metadata: 'https://amazontest.com/some-hash'
  },
  {
    text: `something\n- by someone`,
    type: 6,
    metadata: undefined
  }
]

const mockPost = {
  payload: {
    value: {
      content: {
        bodyModel: {
          paragraphs: [
            {
              text: 'something',
              type: 1
            },
            {
              text: 'something',
              type: 2
            },
            {
              text: 'something',
              type: 3
            },
            {
              text: 'something',
              type: 4,
              metadata: {
                id: 'some-hash'
              }
            },
            {
              text: `something\n- by someone`,
              type: 6
            }
          ]
        }
      }
    }
  }
}
const mockallPosts = {
  payload: {
    user: {
      userId: 'abc123',
      name: 'Test User',
      username: 'test',
      other: 'filter me out'
    },
    references: {
      Post: {
        xyz321: {
          title: 'Title Text',
          uniqueSlug: 'title-text-xyz321',
          latestPublishedAt: 1513819841000,
          content: {
            subtitle: 'This is is a subtitle'
          },
          virtuals: {
            previewImage: {
              imageId: 'some-hash.png'
            }
          }
        },
        xyz789: {
          title: 'Title Text2',
          uniqueSlug: 'title-text-xyz789',
          latestPublishedAt: 1513819842000,
          content: {
            subtitle: 'This is is a subtitle2'
          },
          virtuals: {
            previewImage: {
              imageId: 'some-hash-2.png'
            }
          }
        }
      }
    }
  }
}

module.exports = {
  mockHTML,
  mockPost,
  mockallPosts,
  mockResultRaw
}
