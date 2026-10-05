import { expect, Locator, Page } from "@playwright/test";

export class ProductPage {
    private readonly page: Page;
    private readonly productTitle: Locator;
    private readonly productPrice: Locator;
    private readonly productImage: Locator;
    private readonly addToCartButton: Locator;
    private readonly increaseQuantityButton: Locator;
    private readonly quantityInput: Locator;
    private readonly cartQuantity: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTitle = page.locator('[data-test="product-name"]');
        this.productPrice = page.locator('[data-test="unit-price"]');
        this.productImage = page.locator("img");
        this.addToCartButton = page.locator('[data-test="add-to-cart"]');
        this.increaseQuantityButton = page.locator(
            '[data-test="increase-quantity"]'
        );
        this.quantityInput = page.locator('[data-test="quantity"]');
        this.cartQuantity = page.locator('[data-test="cart-quantity"]');
    }

    async expectProductTitle(expectedProductName: string): Promise<void> {
        await expect(this.productTitle).toHaveText(expectedProductName);
    }

    async expectProductPrice(): Promise<void> {
        await expect(this.productPrice).toBeVisible();
        await expect(this.productPrice).toHaveText(/\d+\.\d{2}/);
    }

    async expectProductImage(): Promise<void> {
        await expect(this.productImage.first()).toBeVisible();
    }

    async expectAddToCartButton(): Promise<void> {
        await expect(this.addToCartButton).toBeVisible();
        await expect(this.addToCartButton).toBeEnabled();
    }

    async increaseQuantity(): Promise<void> {
        await expect(this.increaseQuantityButton).toBeVisible();
        await this.increaseQuantityButton.click();
    }

    async expectQuantity(expectedQuantity: number): Promise<void> {
        await expect(this.quantityInput).toHaveValue(
            expectedQuantity.toString()
        );
    }

    async addToCart(): Promise<void> {
        await expect(this.addToCartButton).toBeVisible();
        await expect(this.addToCartButton).toBeEnabled();

        await this.addToCartButton.click();

        await expect(this.cartQuantity).toBeVisible();
    }

    async addProductWithQuantity(quantity: number): Promise<void> {
        for (
            let currentQuantity = 1;
            currentQuantity < quantity;
            currentQuantity++
        ) {
            await this.increaseQuantity();
        }

        await this.expectQuantity(quantity);
        await this.addToCart();
    }

    async getProductPrice(): Promise<string> {
        return (await this.productPrice.textContent())?.trim() ?? "";
    }

    async getProductTitle(): Promise<string> {
        return (await this.productTitle.textContent())?.trim() ?? "";
    }
}