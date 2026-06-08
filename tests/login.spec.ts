import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

test.describe('Login', () => {

  test('standard user can log in and sees inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(
      page,
      'Standard user should be redirected to inventory page'
    ).toHaveURL(/inventory/);

    await expect(
      page.getByText('Products'),
      'Inventory page should show Products heading'
    ).toBeVisible();
  });

  test('locked user cannot log in and sees error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.locked.username, users.locked.password);

    await expect(
      loginPage.errorMessage,
      'Locked user should see locked out error message'
    ).toContainText('Sorry, this user has been locked out');
  });

  test('wrong password shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, 'wrong_password');

    await expect(
      loginPage.errorMessage,
      'Wrong password should show error message'
    ).toContainText('Username and password do not match');
  });

  test('empty username shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithEmptyFields();

    await expect(
      loginPage.errorMessage,
      'Empty fields should show validation error'
    ).toContainText('Username is required');
  });

});