import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users } from '../test-data/users';

test.describe('Cart', () => {

  // Login before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('cart badge shows correct count after adding a product', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(0);

    await expect(
      await inventoryPage.getCartBadgeText(),
      'Cart badge should show 1 after adding one product'
    ).toHaveText('1');
  });

  test('cart page shows the name of the selected product', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    const firstProductName = await inventoryPage.getFirstProductName();
    await inventoryPage.addProductToCart(0);
    await inventoryPage.goToCart();

    await expect(
      await cartPage.getCartItemNames(),
      'Cart should show the name of the added product'
    ).toContainText(firstProductName!);
  });

  test('removing a product updates the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart(0);
    await inventoryPage.goToCart();
    await cartPage.removeFirstItem();

    await expect(
      await cartPage.getCartBadge(),
      'Cart badge should disappear after removing product'
    ).not.toBeVisible();
  });

  test('adding multiple products shows correct badge count', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addProductToCart(0);
    await inventoryPage.addProductToCart(1);
    await inventoryPage.addProductToCart(2);

    await expect(
      await inventoryPage.getCartBadgeText(),
      'Cart badge should show 3 after adding 3 products'
    ).toHaveText('3');
  });

  // Bonus — sorting by price low to high
  test('products are sorted by price in ascending order', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortByPrice();

    const prices = await inventoryPage.getAllPrices();

    for (let i = 0; i < prices.length - 1; i++) {
      expect(
        prices[i],
        `Price ${prices[i]} should be less than or equal to ${prices[i + 1]}`
      ).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

});