import { Button } from '@mui/material'
import {
  BlogDetailCard,
  BlogDetailTitle,
  BlogAuthor,
  BlogURL,
  BlogAddedBy,
  BlogActions,
  BlogLikes
} from './Styled'

const BlogDetail = ({ blog, user, handleLike, handleDelete }) => {

  if (!blog) return <p>Blog not found</p>

  const isOwner = user && (blog.user.username === user.username)

  return (
    <BlogDetailCard>
      <BlogDetailTitle>
        {blog.title}
      </BlogDetailTitle>

      <BlogAuthor>
        {blog.author}
      </BlogAuthor>

      <BlogURL>
        <a href={blog.url} target='_blank'>{blog.url}</a>
      </BlogURL>

      <BlogAddedBy>
        Added by {blog.user.name}
      </BlogAddedBy>

      <BlogActions>
        <BlogLikes>{blog.likes} likes</BlogLikes>
        <Button variant='outlined' onClick={() => handleLike(blog)}>LIKE</Button>

        {isOwner && (
          <Button variant='outlined' color='error' onClick={() => handleDelete(blog)}>
            REMOVE
          </Button>
        )}
      </BlogActions>
    </BlogDetailCard>
  )
}

export default BlogDetail