import { useState } from 'react'
import styled from 'styled-components'
import { FormContainer, Form, FormTitle, PrimaryButton } from './Styled'

const Input = styled.input`
  padding: 10px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: 2px solid #1976d2;
    border-color: transparent;
  }
`

const BlogForm = ({ createBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <FormContainer>
      <FormTitle>
        create new
      </FormTitle>

      <Form onSubmit={handleSubmit}>
        <Input
          label='title'
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder='title'
        />
        <Input
          label='author'
          value={author}
          onChange={event => setAuthor(event.target.value)}
          placeholder='author'
        />
        <Input
          label='url'
          value={url}
          onChange={event => setUrl(event.target.value)}
          placeholder='url'
        />
        <PrimaryButton>
          CREATE
        </PrimaryButton>
      </Form>
    </FormContainer>
  )
}

export default BlogForm