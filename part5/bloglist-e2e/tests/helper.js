
const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.goto('/login')

  await page.getByLabel(/username/i).fill(username)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /login/i }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: /new blog/i }).click()

  await page.getByLabel(/title/i).fill(title)
  await page.getByLabel(/author/i).fill(author)
  await page.getByLabel(/url/i).fill(url)

  await page.getByRole('button', { name: /create|save/i }).click()

  await expect(page).toHaveURL('/')
  await expect(
    page.locator('.blog').filter({ hasText: title })
  ).toBeVisible()
}

const likeBlog = async (page, title, author, times) => {
  for (let i = 0; i < times; i++) {
    await page.getByRole('link', {
      name: `${title} by ${author}`,
      exact: true
    }).click()

    await page.getByRole('button', { name: /like/i }).click()

    await page.getByRole('link', {
      name: 'blogs',
      exact: true
    }).click()
  }
}

module.exports = {
  loginWith,
  createBlog,
  likeBlog
}
