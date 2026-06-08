import { Page, Locator } from '@playwright/test';

export class CheckoutPage {

  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly successMessage: Locator;
  private readonly overviewItems: Locator;

  constructor(private page: Page) {
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.zipCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.successMessage = page.getByText('Thank you for your order!');
    this.overviewItems = page.locator('.cart_item');
  }

  async fillShippingInfo(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async getSuccessMessage() {
    return this.successMessage;
  }

  async getOverviewItems() {
    return this.overviewItems;
  }
}