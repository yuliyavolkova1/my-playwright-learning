import { Page, Locator } from '@playwright/test';

export class InventoryPage {

  private readonly addToCartButton: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly productNames: Locator;
  private readonly sortDropdown: Locator;

  constructor(private page: Page) {
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.productNames = page.locator('.inventory_item_name');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async addProductToCart(index: number = 0) {
    await this.addToCartButton.nth(index).click();
  }

  async getCartBadgeText() {
    return this.cartBadge;
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortByPrice() {
    await this.sortDropdown.selectOption('lohi');
  }

  async getFirstProductName() {
    return await this.productNames.first().textContent();
  }

  async getAllPrices() {
    const priceLocators = this.page.locator('.inventory_item_price');
    const count = await priceLocators.count();
    const prices: number[] = [];

    for (let i = 0; i < count; i++) {
      const text = await priceLocators.nth(i).textContent();
      prices.push(parseFloat(text!.replace('$', '')));
    }
    return prices;
  }
}