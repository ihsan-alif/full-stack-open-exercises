import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const FormContainer = styled.div`
  background: #ffffff;
  padding: 24px;
  margin: 20px 0;
  max-width: 300px;
  border: none;
  border-radius: 8px;
`

export const FormTitle = styled.h2`
  color: #000000;
  margin-top: 0;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Input = styled.input`
  padding: 10px;
  border: none;
  border-bottom: 1px solid;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: 2px solid #1976d2;
    border-color: transparent;
  }
`

export const PrimaryButton = styled.button`
  padding: 10px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  max-width: 100px;

  &:hover {
    background: #125ca1;
  }
`

export const BlogDetailCard = styled.div`
  background: white;
  padding: 24px;
  margin: 20px 0;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
`

export const BlogDetailTitle = styled.h1`
  font-size: 32px;
  font-weight: 400;
  margin: 0 0 20px;
  color: #222222;
`

export const BlogAuthor = styled.p`
  font-size: 20px;
  color: #666666;
  margin: 0 0 16px;
`

export const BlogURL = styled.p`
  font-size: 18px;
  margin: 0 0 16px;
  overflow-wrap: anywhere;

  a {
    color: #1976d2;
  }
`

export const BlogAddedBy = styled.p`
  font-size: 18px;
  color: #666666;
  margin: 0 0 16px;
`

export const BlogActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

export const BlogLikes = styled.span`
  font-size: 20px;
  color: #222222;
`