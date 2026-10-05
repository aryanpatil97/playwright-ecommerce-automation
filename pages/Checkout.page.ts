import { expect, Locator, Page } from "@playwright/test";

export class CheckoutPage {
    private readonly page: Page;
    private readonly cartQuantity: Locator;
    private readonly proceedToCheckoutButton: Locator;
    private readonly continueAsGuestTab: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly guestSubmitButton: Locator;
    private readonly guestSubmitButton2: Locator;
    private readonly countrySelect: Locator;
    private readonly postalCodeInput: Locator;
    private readonly houseNumberInput: Locator;
    private readonly stateInput: Locator;
    private readonly paymentMethodSelect: Locator;
    private readonly confirmButton: Locator;
    private readonly successMessage: Locator;
    private readonly orderConfirmation: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartQuantity = page.locator('[data-test="cart-quantity"]');

        this.proceedToCheckoutButton = page.getByRole("button", {
            name: "Proceed to checkout",
            exact: true
        });

        this.continueAsGuestTab = page.getByRole("tab", {
            name: "Continue as Guest",
            exact: true
        });

        this.firstNameInput = page.getByRole("textbox", {
            name: "First name *",
            exact: true
        });

        this.lastNameInput = page.getByRole("textbox", {
            name: "Last name *",
            exact: true
        });

        this.emailInput = page.getByRole("textbox", {
            name: "Email address *",
            exact: true
        });

        this.guestSubmitButton = page.locator(
            '[data-test="guest-submit"]'
        );

        this.guestSubmitButton2 = page.locator(
            '[data-test="proceed-2-guest"]'
        );

        this.countrySelect = page.locator(
            '[data-test="country"]'
        );

        this.postalCodeInput = page.getByRole("textbox", {
            name: "Postal code",
            exact: true
        });

        this.houseNumberInput = page.getByRole("textbox", {
            name: "House number",
            exact: true
        });

        this.stateInput = page.getByRole("textbox", {
            name: "State",
            exact: true
        });

        this.paymentMethodSelect = page.locator(
            '[data-test="payment-method"]'
        );

        this.confirmButton = page.getByRole("button", {
            name: "Confirm",
            exact: true
        });

        this.successMessage = page.locator(
            '[data-test="payment-success-message"]'
        );

        this.orderConfirmation = page.locator(
            "#order-confirmation"
        );
    }

    async openCart(): Promise<void> {
        await expect(this.cartQuantity).toBeVisible();
        await this.cartQuantity.click();
    }

    async continueToCheckout(): Promise<void> {
        await expect(this.proceedToCheckoutButton).toBeVisible();
        await expect(this.proceedToCheckoutButton).toBeEnabled();
        await this.proceedToCheckoutButton.click();
    }

    async continueAsGuest(): Promise<void> {
        await expect(this.continueAsGuestTab).toBeVisible();
        await expect(this.continueAsGuestTab).toBeEnabled();
        await this.continueAsGuestTab.click();
    }

    async fillGuestDetails(
        firstName: string,
        lastName: string,
        email: string
    ): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);

        await expect(this.guestSubmitButton).toBeVisible();
        await expect(this.guestSubmitButton).toBeEnabled();
        await this.guestSubmitButton.click();

        await expect(this.guestSubmitButton2).toBeVisible();
        await expect(this.guestSubmitButton2).toBeEnabled();
        await this.guestSubmitButton2.click();
    }

    async fillBillingAddress(
        country: string,
        postalCode: string,
        houseNumber: string
    ): Promise<void> {
        await expect(this.countrySelect).toBeAttached();

        await this.countrySelect.selectOption({
            label: country
        });

        await this.postalCodeInput.fill(postalCode);
        await this.houseNumberInput.fill(houseNumber);

        await expect(this.stateInput).not.toHaveValue("");

        await expect(this.proceedToCheckoutButton).toBeVisible();
        await expect(this.proceedToCheckoutButton).toBeEnabled();

        await this.proceedToCheckoutButton.click();
    }

    async selectPaymentMethod(
        paymentMethod: string
    ): Promise<void> {
        await expect(this.confirmButton).toBeDisabled();

        await this.paymentMethodSelect.selectOption({
            label: paymentMethod
        });

        await expect(this.confirmButton).toBeEnabled();
    }

    async placeOrder(): Promise<void> {
        await expect(this.confirmButton).toBeEnabled();
        await this.confirmButton.click();
    }

    async expectSuccessfulOrder(): Promise<void> {
        await expect(this.successMessage).toBeVisible();

        await expect(this.successMessage).toHaveText(
            "Payment was successful"
        );
        await this.confirmButton.click();
        await expect(this.orderConfirmation).toBeVisible();

        await expect(this.orderConfirmation).toContainText(
            "Thanks for your order! Your invoice number is"
        );

        const invoiceNumber =
            this.orderConfirmation.locator("span");

        await expect(invoiceNumber).toBeVisible();

        await expect(invoiceNumber).toHaveText(
            /^INV-\d+$/
        );
    }
}