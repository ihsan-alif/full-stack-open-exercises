const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.status(200).json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body

  const user = req.user
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  await savedBlog.populate('user', { username: 1, name: 1 })
  res.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    res.status(404).end()
  }

  blog.title = body.title
  blog.author = body.author
  blog.url = body.url
  blog.likes = body.likes

  const savedBlog = await blog.save()

  const updatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  res.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {

  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const user = req.user
  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter