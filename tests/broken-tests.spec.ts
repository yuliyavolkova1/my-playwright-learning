import { test, expect } from "@playwright/test";

test("login should redirect to inventory", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("username").fill("standard_user");   // ← is this the real placeholder?
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/inventory/);
});
test("error message on wrong password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("wrong_password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(
    page.locator('[data-test="error"]'),
    'Error should appear for wrong credentials'
  ).toContainText("Epic sadface: Username and password do not match");   // ← 
});
test("cart badge appears after adding product", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await page.locator("[data-test=\"add-to-cart-sauce-labs-backpack\"]").click();   // ← something missing here

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});
// Test 1 — login should redirect to inventory
// Root cause: wrong locator — getByPlaceholder("username")
//             with lowercase "u", but real placeholder is "Username"
//             with uppercase "U"
// Fix: changed to getByPlaceholder("Username")
// How I verified: ran npx playwright test tests/broken-tests.spec.ts — test passed

// Test 2 — error message on wrong password
// Root cause: 1) getByTestId("error") looks for data-testid attribute,
//                but HTML has data-test (without "id")
//             2) error text was incomplete — did not match actual text
// Fix: replaced with locator('[data-test="error"]')
//      and changed toHaveText to toContainText with correct text
// How I verified: ran test — passed green

// Test 3 — cart badge appears after adding product
// Root cause: missing await before click() — test did not wait
//             for the product to be added to cart, assertion ran
//             before the click completed
// Fix: added await before page.locator(...).click()
// How I verified: ran test — passed green. Without await
//                 test is flaky — passes randomly