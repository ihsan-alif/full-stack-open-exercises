import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const showNotification = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotification(null)
    }, 5000);
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification message={notification} type={notificationType} />
      <div>
        <label>
          username
          <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
        </label>
      </div>
      <div>
          <label>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </label>
        </div>
        <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const createBlog = () => (
    <form onSubmit={handleCreateBlog}>
      <div>
        <label>
          title:
          <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
        </label>
      </div>
      <div>
        <label>
          author:
          <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </label>
      </div>
      <div>
        <label>
          url:
          <input type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
        </label>
      </div>
      <button type='submit'>create</button>
    </form>
  )

  const handleCreateBlog = async event => {
    event.preventDefault()

    const newBlog = {
      title: title,
      author: author,
      url: url,
    }

    const savedBlog = await blogService.create(newBlog)

    setBlogs(blogs.concat(savedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    showNotification(`a new blog ${savedBlog.title} by ${savedBlog.author} added`, 'success')
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      showNotification('wrong username or password', 'error')
      setTimeout(() => {
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <div>
      
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <Notification message={notification} type={notificationType} />
          <p>{user.name} logged in <button onClick={handleLogout}>log out</button></p>
          <h2>create new</h2>
          {createBlog()}
          {blogForm()}
        </div>
      )}

    </div>
  )
}

export default App