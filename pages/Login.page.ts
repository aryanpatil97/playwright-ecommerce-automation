import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
    private readonly page: Page;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginHeading: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('[data-test="email"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.getByRole("button", {
            name: "Login",
            exact: true
        });
        this.loginHeading = page.getByRole("heading", {
            name: "Login",
            exact: true
        });
        this.errorMessage = page.getByText(
            "Invalid email or password",
            { exact: true }
        );
    }

    async goto(): Promise<void> {
        await this.page.goto(
            "https://practicesoftwaretesting.com/auth/login"
        );
    }

    async expectLoginPage(): Promise<void> {
        await expect(this.page).toHaveURL(
            "https://practicesoftwaretesting.com/auth/login"
        );
        await expect(this.loginHeading).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
    }

    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);

        await expect(this.loginButton).toBeVisible();
        await expect(this.loginButton).toBeEnabled();

        await this.loginButton.click();
    }

    async expectInvalidCredentialsError(): Promise<void> {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.page).toHaveURL(
            "https://practicesoftwaretesting.com/auth/login"
        );
        await expect(this.loginHeading).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
    }
}