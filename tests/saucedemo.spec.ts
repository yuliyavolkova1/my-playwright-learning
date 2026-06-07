import { test, expect } from '@playwright/test';

test.describe('SauceDemo', () => {
// SauceDemo test suite — Week 3-4


  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  // Test 1 — successful login
  test('успешный логин — редирект на inventory', async ({ page }) => {
    await expect(page).toHaveURL(/inventory/);
  });

  // Test 2 — negative login
  test('неверный пароль — показывает ошибку', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.getByText('Epic sadface: Username and password do not match'),
      'Error should appear for wrong credentials'
    ).toBeVisible();
  });

  // Test 3 — add product to cart
  test('add product to cart', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should show 1 after adding product'
    ).toHaveText('1');
  });

  // Test 3.1 — add multiple products to cart
  test('add 3 products - badge shows 3, remove one - badge shows 2', async ({ page }) => {
    const buttons = page.getByRole('button', { name: 'Add to cart' });
    
    await buttons.nth(0).click();
    await buttons.nth(1).click();
    await buttons.nth(2).click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Badge should show 3 after adding 3 products'
    ).toHaveText('3');

    await page.getByRole('button', { name: 'Remove' }).first().click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Badge should show 2 after removing one product'
    ).toHaveText('2');
  });

  // Test 3.2 — sorting products
  test('sorting by price low to high changes first product', async ({ page }) => {
    const firstProductBefore = await page.locator('.inventory_item_name').first().textContent();
    
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    
    const firstProductAfter = await page.locator('.inventory_item_name').first().textContent();
    
    expect(
      firstProductBefore,
      'First product should change after sorting'
    ).not.toBe(firstProductAfter);
  });

  // Test 3.3 — cart state after page refresh
  test('cart keeps item after page refresh', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    
    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should show 1 before refresh'
    ).toHaveText('1');
    
    await page.reload();
    
    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should still show 1 after page refresh'
    ).toHaveText('1');
  });

  // Test 4 — remove product from cart
  test('remove product from cart', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.getByRole('button', { name: 'Remove' }).first().click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should disappear after removing product'
    ).not.toBeVisible();
  });

  // Test 5 — empty login form
  test('empty login form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.getByText('Epic sadface: Username is required'),
      'Error should appear for empty credentials'
    ).toBeVisible();
  });

});