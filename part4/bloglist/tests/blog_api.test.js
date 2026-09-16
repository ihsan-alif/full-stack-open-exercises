const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('fails with status code 400 if title or url missing', () => {
  test('title missing', async () => {
    const blogWithoutTitle = {
      author: 'Full Stack Open',
      url: 'https://fullstackopen.com/',
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutTitle)
      .expect(400)
  })

  test('url missing', async () => {
    const blogWithoutUrl = {
      title: 'Async/await makes testing cleaner',
      author: 'Full Stack Open',
      likes: 8,
    }

    await api
      .post('/api/blogs')
      .send(blogWithoutUrl)
      .expect(400)
  })
})

test('if likes properties is missing, it defaults to 0', async () => {
  const blogWithoutLikes = {
    title: 'Async/await makes testing cleaner',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com/',
  }

  const response = await api
    .post('/api/blogs')
    .send(blogWithoutLikes)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('addition of a new blog with valid data', async () => {
  const newBlog = {
    title: 'Async/await makes testing cleaner',
    author: 'Full Stack Open',
    url: 'https://fullstackopen.com/',
    likes: 8,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Async/await makes testing cleaner'))
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogToCheck = response.body[0]

  assert.notStrictEqual(blogToCheck.id, undefined)
  assert.strictEqual(blogToCheck._id, undefined)
})

test('blogs are returned as JSON and correct amount is returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})