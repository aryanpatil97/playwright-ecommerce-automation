import { expect, Locator, Page } from "@playwright/test";

export class HomePage {
    private readonly page: Page;
    private readonly addToCartButton: Locator;
    private readonly productName: Locator;
    private readonly homeLink: Locator;
    private readonly cartQuantity: Locator;
    private readonly productCards: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addToCartButton = page.locator('#btn-add-to-cart');
        this.productName = page.locator('[data-test="product-name"]');
        this.homeLink = page.getByRole("link", {
            name: "Home",
            exact: true
        });
        this.cartQuantity = page.locator('[data-test="cart-quantity"]');
        this.productCards = page.locator('a[data-test^="product-"]');
    }

    async goto(): Promise<void> {
        await this.page.goto("https://practicesoftwaretesting.com/", {
            waitUntil: "domcontentloaded"
        });
    }

    async openProduct(productName: string): Promise<void> {
        const product = this.page
            .locator(".card-body")
            .getByRole("heading", {
                name: productName,
                exact: true
            });

        await expect(product).toBeVisible();
        await product.click();
    }

    async addProduct(productName: string): Promise<void> {
        const product = this.page
            .locator(".card-body")
            .getByRole("heading", {
                name: productName,
                exact: true
            });

        await expect(product).toBeVisible();
        await expect(product).toBeEnabled();
        await product.click();

        await expect(this.productName).toHaveText(productName);
        await expect(this.addToCartButton).toBeEnabled();
        await expect(this.addToCartButton).toBeVisible();

        await this.addToCartButton.click();

        await expect(this.cartQuantity).toBeVisible();

        await expect(this.homeLink).toBeEnabled();
        await expect(this.homeLink).toBeVisible();

        await this.homeLink.click();
    }

    async getFirstProductName(): Promise<string> {
        return (
            (await this.productCards
                .first()
                .locator('[data-test="product-name"]')
                .textContent())?.trim() ?? ""
        );
    }

    async getProductNames(): Promise<string[]> {
        return (
            await this.productCards
                .locator('[data-test="product-name"]')
                .allTextContents()
        ).map(name => name.trim());
    }

    async getProductPrices(): Promise<string[]> {
        return (
            await this.productCards
                .locator('[data-test="product-price"]')
                .allTextContents()
        ).map(price => price.trim());
    }

    getProductCards(): Locator {
        return this.productCards;
    }

    getCartQuantity(): Locator {
        return this.cartQuantity;
    }

    getHomeLink(): Locator {
        return this.homeLink;
    }
}