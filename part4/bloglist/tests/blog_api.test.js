const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb } = require('./test_helper')

const api = supertest(app)

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })
  const savedUser = await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'secret' })

  token = loginResponse.body.token

  const blogObjects = initialBlogs.map(
    blog => new Blog({ ...blog, user: savedUser._id })
  )
  const promiseArray = blogObjects.map(blog => blog.save())
  const savedBlogs = await Promise.all(promiseArray)

  savedUser.blogs = savedUser.blogs.concat(savedBlogs.map(b => b._id))
  await savedUser.save()
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as JSON and correct amount is returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogToCheck = response.body[0]

    assert.notStrictEqual(blogToCheck.id, undefined)
    assert.strictEqual(blogToCheck._id, undefined)
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data and valid token', async () => {
    const newBlog = {
      title: 'Async/await makes testing cleaner',
      author: 'Full Stack Open',
      url: 'https://fullstackopen.com/',
      likes: 8
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Async/await makes testing cleaner'))
  })

  test('fails with 401 Unauthorized if token is missing', async () => {
    const newBlog = {
      title: 'Blog without token',
      author: 'Tester',
      url: 'https://example.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const blogWithoutLikes = {
      title: 'Async/await makes testing cleaner',
      author: 'Full Stack Open',
      url: 'https://fullstackopen.com/'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  describe('fails with status code 400 if title or url missing', () => {
    test('title missing', async () => {
      const blogWithoutTitle = {
        author: 'Full Stack Open',
        url: 'https://fullstackopen.com/',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutTitle)
        .expect(400)
    })

    test('url missing', async () => {
      const blogWithoutUrl = {
        title: 'Async/await makes testing cleaner',
        author: 'Full Stack Open',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutUrl)
        .expect(400)
    })
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id and token are valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data and updates likes', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

    const blogsAtEnd = await blogsInDb()
    const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})