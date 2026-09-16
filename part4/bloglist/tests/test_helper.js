const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://...',
    likes: 5
  },
  {
    title: 'Canonicalization',
    author: 'Edsger W. Dijkstra',
    url: 'https://...',
    likes: 5
  },
  {
    title: 'How Not To Be Seen',
    author: 'Graham Chapman',
    url: 'https://...',
    likes: 4
  },
  {
    title: 'Lorem ipsum',
    author: 'John Doe',
    url: 'https://...',
    likes: 8
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
}