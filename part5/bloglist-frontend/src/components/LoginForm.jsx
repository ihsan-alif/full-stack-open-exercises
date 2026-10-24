import { useState } from 'react'
import { FormContainer, Form, FormTitle, Input, PrimaryButton } from './Styled'

const LoginForm = ({ onLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <FormContainer>
      <FormTitle>Log in to application</FormTitle>
      <Form onSubmit={handleSubmit}>
        <Input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          placeholder='username'
        />
        <Input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          placeholder='password'
        />
        <PrimaryButton type="submit">LOGIN</PrimaryButton>
      </Form>
    </FormContainer>
  )
}

export default LoginForm