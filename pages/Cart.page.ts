import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
    private readonly page: Page;
    private readonly cartQuantity: Locator;
    private readonly cartItems: Locator;
    private readonly cartTableBody: Locator;
    private readonly quantityInputs: Locator;
    private readonly subtotal: Locator;
    private readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartQuantity = page.locator('[data-test="cart-quantity"]');
        this.cartItems = page.locator("tbody tr");
        this.cartTableBody = page.locator("tbody");
        this.quantityInputs = page.getByRole("spinbutton");
        this.subtotal = page.locator('[data-test="cart-total"]');
        this.proceedToCheckoutButton = page.getByRole("button", {
            name: "Proceed to checkout",
            exact: true
        });
    }

    async goto(): Promise<void> {
        await this.cartQuantity.click();
    }

    async expectCartQuantity(expectedQuantity: number): Promise<void> {
        await expect(this.cartQuantity).toHaveText(
            expectedQuantity.toString()
        );
    }

    async expectProduct(productName: string): Promise<void> {
        await expect(this.cartTableBody).toContainText(productName);
    }

    async expectProductQuantity(
        productIndex: number,
        expectedQuantity: number
    ): Promise<void> {
        await expect(this.quantityInputs.nth(productIndex)).toHaveValue(
            expectedQuantity.toString()
        );
    }

    async getProductNames(): Promise<string[]> {
        const productNames = this.cartItems.locator(
            '[data-test="product-name"]'
        );

        return (await productNames.allTextContents()).map(name =>
            name.trim()
        );
    }

    async getQuantities(): Promise<number[]> {
        const values = await this.quantityInputs.evaluateAll(inputs =>
            inputs.map(input => Number((input as HTMLInputElement).value))
        );

        return values;
    }

    async getLineTotals(): Promise<number[]> {
        const lineTotals = this.cartItems.locator(
            '[data-test="line-price"]'
        );

        const prices = await lineTotals.allTextContents();

        return prices.map(price =>
            Number(price.replace(/[$,]/g, "").trim())
        );
    }

    async getSubtotal(): Promise<number> {
        const subtotalText = await this.subtotal.textContent();

        return Number(
            subtotalText?.replace(/[$,]/g, "").trim() ?? "0"
        );
    }

    async expectSubtotal(expectedSubtotal: number): Promise<void> {
        await expect(this.subtotal).toHaveText(
            new RegExp(`\\$${expectedSubtotal.toFixed(2)}`)
        );
    }

    async expectProceedToCheckoutButton(): Promise<void> {
        await expect(this.proceedToCheckoutButton).toBeVisible();
        await expect(this.proceedToCheckoutButton).toBeEnabled();
    }

    async proceedToCheckout(): Promise<void> {
        await expect(this.proceedToCheckoutButton).toBeEnabled();
        await this.proceedToCheckoutButton.click();
    }
}