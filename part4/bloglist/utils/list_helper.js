const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  let total = 0

  blogs.forEach(blog => {
    total = total + blog.likes
  })

  return total
}

const favoriteBlog = (blogs) => {

  let favorite = blogs[0]

  blogs.forEach(blog => {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  })

  return favorite
}

const mostBlogs = (blogs) => {

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let topAuthor = null
  let topCount = 0

  Object.keys(counts).forEach(author => {
    if (counts[author] > topCount) {
      topAuthor = author
      topCount = counts[author]
    }
  })

  return {
    author: topAuthor,
    blogs: topCount,
  }
}

const mostLikes = (blogs) => {

  const likesByAuthor = {}

  blogs.forEach(blog => {
    likesByAuthor[blog.author] = (likesByAuthor[blog.author] || 0) + blog.likes
  })

  let topAuthor = null
  let topLikes = 0

  Object.keys(likesByAuthor).forEach(author => {
    if (likesByAuthor[author] > topLikes) {
      topAuthor = author
      topLikes = likesByAuthor[author]
    }
  })

  return {
    author: topAuthor,
    likes: topLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}