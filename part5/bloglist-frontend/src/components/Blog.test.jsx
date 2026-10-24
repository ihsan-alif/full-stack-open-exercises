import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Learn Go programming language',
    author: 'John Doe',
    url: 'https://...',
    likes: 5,
    user: {
      name: 'John Doe',
    }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} handleLike={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  screen.debug()

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('renders content', () => {
  const blog = {
    title: 'Learn Go programming language',
    author: 'John Doe',
    url: 'https://...',
    likes: 5,
    user: {
      name: 'John Doe',
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(/Learn Go programming language/)

  // screen.debug(element)

  expect(element).toBeDefined()
})