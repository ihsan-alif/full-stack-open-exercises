import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('write title here')
  const inputAuthor = screen.getByPlaceholderText('write author here')
  const inputUrl = screen.getByPlaceholderText('write url here')
  const sendButton = screen.getByText('save')

  await user.type(inputTitle, 'Learn Go programming language')
  await user.type(inputAuthor, 'John Doe')
  await user.type(inputUrl, 'https://golang.org')
  await user.click(sendButton)

  screen.debug()

  expect(createBlog).toHaveBeenCalledTimes(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Learn Go programming language',
    author: 'John Doe',
    url: 'https://golang.org'
  })
})