import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('navigation', () => {
  test('should be able to navigate from front page to post page and back', async ({ page }) => {
    const postLink = page
      .getByRole('article')
      .filter({ has: page.getByRole('heading', { name: 'Posts' }) })
      .getByRole('link')
      .first();
    const postHeading = await postLink.textContent();
    if (!postHeading) throw new Error('Expected post link to contain text content');

    // navigate to post page
    await postLink.click();
    await page.waitForURL('**/posts/*');

    // post page contains correct title and heading
    await expect(page).toHaveTitle(`${postHeading} - toninau's Dev Blog`);
    await expect(page.getByRole('heading', { name: postHeading })).toBeVisible();

    // navigate back to front page from post page
    await page.getByRole('link', { name: 'Return to front page' }).click();
    await page.waitForURL('/');

    // front page contains correct title, about section and posts section
    await expect(page).toHaveTitle("toninau's Dev Blog");
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
  });
});

test.describe('accessibility', () => {
  test('front page should not have any automatically detectable accessibility issues', async ({
    page
  }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('post page should not have any automatically detectable accessibility issues', async ({
    page
  }) => {
    const postLink = page
      .getByRole('article')
      .filter({ has: page.getByRole('heading', { name: 'Posts' }) })
      .getByRole('link')
      .first();
    const postHeading = await postLink.textContent();
    if (!postHeading) throw new Error('Expected post link to contain text content');
    await postLink.click();
    await page.waitForURL('**/posts/*');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('theme switcher', () => {
  test('theme can be switched and theme choice is persisted', async ({ page }) => {
    // switch theme from default to dark theme
    await page.getByRole('button', { name: 'Theme options' }).click();
    await page.getByRole('button', { name: 'Dark' }).click();

    // reload page
    await page.reload();

    // theme choice is persisted
    await page.getByRole('button', { name: 'Theme options' }).click();
    await expect(page.getByRole('button', { name: 'Dark' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(page.locator('html')).toHaveClass('dark');
  });

  test('displays page in OS default theme', async ({ page }) => {
    // set OS default theme to dark
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.getByRole('button', { name: 'Theme options' }).click();

    await expect(page.getByRole('button', { name: 'OS Default' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(page.locator('html')).toHaveClass('dark');
  });
});

test.describe('404', () => {
  test('404 page exists and links back to front page', async ({ page }) => {
    // navigate to a page that does not exist
    const response = await page.goto('/some/page/that/will/never/exist');

    // verify that current page is 404 page
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/not found/i);
    await expect(page.getByText(/not found/i)).toBeVisible();

    // navigate back to front page from 404 page
    await page.getByRole('link', { name: 'Return to front page' }).click();
    await page.waitForURL('/');

    // verify that current page is front page
    await expect(page).toHaveTitle("toninau's Dev Blog");
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Posts' })).toBeVisible();
  });
});
