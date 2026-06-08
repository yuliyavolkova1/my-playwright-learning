import { Page, Locator } from '@playwright/test';

export class CartPage {

  private readonly cartItems: Locator;
  private readonly cartItemNames: Locator;
  private readonly removeButton: Locator;
  private readonly cartBadge: Locator;
  private readonly checkoutButton: Locator;

  constructor(private page: Page) {
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async getCartItemNames() {
    return this.cartItemNames;
  }

  async removeFirstItem() {
    await this.removeButton.first().click();
  }

  async getCartBadge() {
    return this.cartBadge;
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async getItemCount() {
    return await this.cartItems.count();
  }
}