import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useMatch, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography } from '@mui/material'
import BlogList from './components/BlogList'
import BlogDetail from './components/BlogDetail'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  const showNotification = (text, type) => {
    setNotification({ text: text, type: type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      } catch {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
      }
    }
    setReady(true)
  }, [])

  const handleCreateBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.create(blogObject)

      const blogToAppend = {
        ...savedBlog,
        user: savedBlog.user || user
      }

      setBlogs(blogs => blogs.concat(blogToAppend))
      showNotification(`a new blog ${savedBlog.title} by ${savedBlog.author} added`, 'success')
      navigate('/')
    } catch {
      showNotification('failed to create blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user ? blog.user.id || blog.user : null
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      setBlogs(currentBlogs =>
        currentBlogs.map(b =>
          b.id === blog.id
            ? { ...returnedBlog, user: blog.user }
            : b
        ))
    } catch {
      showNotification('failed to update likes', 'error')
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs( currentBlogs =>
          currentBlogs.filter(b => b.id !== blog.id)
        )
        showNotification(`Blog ${blog.title} deleted`, 'success')
        navigate('/')
      } catch {
        showNotification('Failed to delete blog', 'error')
      }
    }
  }

  const handleLogin = async (credentials) => {

    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
      navigate('/login')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    navigate('/')
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  const style = { '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } }

  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h5' sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color='inherit' component={Link} to='/' sx={style}>
            BLOGS
          </Button>
          {!user &&
            <Button color='inherit' component={Link} to='/login' sx={style}>
              LOGIN
            </Button>}
          {user && (
            <>
              <Button color='inherit' component={Link} to='/create' sx={style}>
                NEW BLOG
              </Button>
              <Button color='inherit' onClick={handleLogout} sx={style}>
                LOG OUT
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <br />
      <Notification notification={notification} />

      <Routes>
        <Route path='/' element={<BlogList
          blogs={blogs}
          user={user}
        />} />
        <Route path='/login' element={<LoginForm onLogin={handleLogin} />} />
        <Route path='/blogs/:id' element={<BlogDetail blog={blog} user={user} handleDelete={handleDelete} handleLike={handleLike} />} />
        <Route path='/create' element={
          !ready
            ? null
            : user
              ? <BlogForm createBlog={handleCreateBlog} />
              : <Navigate to='/login' replace />
        } />
      </Routes>
    </div>
  )
}

export default App