const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Bloglist app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'San Alif',
        username: 'sanalif',
        password: 'incorrect'
      }
    })

    await page.goto('/')
  })

  test('Login form is displayed', async ({ page }) => {
    await page.goto('/login')

    await expect(
      page.getByRole('button', { name: /login/i })
    ).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'sanalif', 'incorrect')

      await expect(page).toHaveURL('/')

      await expect(
        page.getByRole('link', { name: /new blog/i })
      ).toBeVisible()

      await expect(
        page.getByRole('button', { name: /log out/i })
      ).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'sanalif', 'wrongpassword')

      const errorDiv = page.locator('.error')

      await expect(errorDiv).toContainText(
        'wrong username or password'
      )

      await expect(errorDiv).toHaveCSS(
        'color',
        'rgb(255, 0, 0)'
      )
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'sanalif', 'incorrect')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Playwright testing is fun',
        'Playwright Author',
        'https://playwright.dev'
      )

      const blog = page.locator('.blog').filter({
        hasText: 'Playwright testing is fun'
      })

      await expect(blog).toContainText('Playwright Author')
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'test blog',
        'John Doe',
        'https://example.com'
      )

      await page.getByRole('link', {
        name: 'test blog by John Doe',
        exact: true
      }).click()

      await page.getByRole('button', { name: /like/i }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the creator can delete a blog', async ({ page }) => {
      await createBlog(
        page,
        'blog to delete',
        'John Doe',
        'https://example.com'
      )

      await page.getByRole('link', {
        name: 'blog to delete by John Doe',
        exact: true
      }).click()


      page.once('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: /remove/i }).click()

      await expect(page).toHaveURL('/')
      await expect(
        page.getByRole('link', {
          name: 'blog to delete by John Doe',
          exact: true
        })
      ).toHaveCount(0)
    })

    test('only the creator can see the delete button', async ({
      page,
      request
    }) => {
      await createBlog(
        page,
        'My blog',
        'Test Author',
        'https://example.com'
      )

      await request.post('/api/users', {
        data: {
          name: 'Second User',
          username: 'seconduser',
          password: 'secondpassword'
        }
      })

      await page.getByRole('button', { name: /log out/i }).click()

      await loginWith(page, 'seconduser', 'secondpassword')

      await page.getByRole('link', {
        name: 'My blog by Test Author',
        exact: true
      }).click()

      const removeButton = page.getByRole('button', {
        name: /remove/i
      })

      await expect(removeButton).toHaveCount(0)
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'Blog A', 'Author A', 'https://a.example')
      await createBlog(page, 'Blog B', 'Author B', 'https://b.example')
      await createBlog(page, 'Blog C', 'Author C', 'https://c.example')

      await likeBlog(page, 'Blog A', 'Author A', 1)
      await likeBlog(page, 'Blog B', 'Author B', 3)
      await likeBlog(page, 'Blog C', 'Author C', 2)

      const blogs = page.getByRole('listitem')

      await expect(blogs.nth(0)).toContainText('Blog B by Author B')
      await expect(blogs.nth(1)).toContainText('Blog C by Author C')
      await expect(blogs.nth(2)).toContainText('Blog A by Author A')
    })
  })
})
