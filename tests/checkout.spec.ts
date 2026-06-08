import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users, checkoutData } from '../test-data/users';

test.describe('Checkout', () => {

  test('user can complete checkout and see success message', async ({ page }) => {
    await test.step('Login', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(users.standard.username, users.standard.password);
    });

    await test.step('Add product to cart', async () => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.addProductToCart(0);
      await inventoryPage.goToCart();
    });

    await test.step('Go to checkout', async () => {
      const cartPage = new CartPage(page);
      await cartPage.goToCheckout();
    });

    await test.step('Fill shipping info', async () => {
      const checkoutPage = new CheckoutPage(page);
      await checkoutPage.fillShippingInfo(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.zipCode
      );
      await checkoutPage.continue();
    });

    await test.step('Verify overview and finish', async () => {
      const checkoutPage = new CheckoutPage(page);

      await expect(
        await checkoutPage.getOverviewItems(),
        'Overview page should show selected product'
      ).toHaveCount(1);

      await checkoutPage.finish();
    });

    await test.step('Verify success message', async () => {
      const checkoutPage = new CheckoutPage(page);

      await expect(
        await checkoutPage.getSuccessMessage(),
        'Success message should be visible after completing order'
      ).toBeVisible();
    });
  });

});