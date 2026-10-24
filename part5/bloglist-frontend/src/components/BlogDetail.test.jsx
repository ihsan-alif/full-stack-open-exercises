import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import BlogDetail from './BlogDetail'

const blog = {
  id: '1',
  title: 'Learn React',
  author: 'John Doe',
  url: 'https://example.com',
  likes: 5,
  user: {
    username: 'john',
    name: 'John Doe'
  }
}

const otherUser = {
  username: 'budi',
  name: 'Budi'
}

const owner = {
  username: 'john',
  name: 'John Doe'
}

test('unauthenticated user sees blog information but no buttons', () => {
  render(
    <BlogDetail
      blog={blog}
      user={null}
      handleLike={vi.fn()}
      handleDelete={vi.fn()}
    />
  )

  expect(screen.getByText('John Doe: Learn React')).toBeDefined()
  expect(screen.getByText('likes 5')).toBeDefined()

  expect(
    screen.queryByRole('button')
  ).toBeNull()
})

test('logged-in user who is not the creator sees only Like button', () => {
  render(
    <BlogDetail
      blog={blog}
      user={otherUser}
      handleLike={vi.fn()}
      handleDelete={vi.fn()}
    />
  )

  expect(
    screen.getByRole('button', { name: /like/i })
  ).toBeDefined()

  expect(
    screen.queryByRole('button', { name: /remove/i })
  ).toBeNull()
})

test('blog creator sees Like and Delete buttons', () => {
  render(
    <BlogDetail
      blog={blog}
      user={owner}
      handleLike={vi.fn()}
      handleDelete={vi.fn()}
    />
  )

  expect(
    screen.getByRole('button', { name: /like/i })
  ).toBeDefined()

  expect(
    screen.getByRole('button', { name: /remove/i })
  ).toBeDefined()
})
