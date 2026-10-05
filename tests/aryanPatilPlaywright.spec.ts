import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/Home.page";
import { ProductPage } from "../pages/Product.page";
import { CartPage } from "../pages/Cart.page";
import { LoginPage } from "../pages/Login.page";
import { CheckoutPage } from "../pages/Checkout.page";
import { calculateSubtotal, parsePrice } from "../utils/price.utils";
import {
    checkoutData,
    invalidLoginData,
    checkoutProducts
} from "../utils/test.data";

test.describe("Playwright Capstone Project - Aryan Patil", () => {

    test("Homepage Validation", async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        await expect(page).toHaveURL(
            "https://practicesoftwaretesting.com/"
        );
        await expect(page).toHaveTitle(
            "Practice Software Testing - Toolshop - v5.0"
        );
        await expect(page.getByRole("navigation").filter({
            hasText: "Home Categories Hand"
        })).toBeVisible();
        await expect(page.locator("#search-query")).toBeVisible();

        const productCards = homePage.getProductCards();
        await expect(productCards.first()).toBeVisible();

        const totalProducts = await productCards.count();
        expect(totalProducts).toBeGreaterThanOrEqual(1);

        console.log("Aryan Patil - Homepage validation completed");
    });

    test("Search Functionality", async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        const searchInput = page.locator("#search-query");
        await searchInput.fill("Hammer");

        await page.getByRole("button", {
            name: "Search",
            exact: true
        }).click();

        const searchResults = page.locator(
            '[data-test="search_completed"]'
        );
        const productCards = searchResults.locator(
            'a[data-test^="product-"]'
        );

        await expect(productCards.first()).toBeVisible();

        const productNames = await productCards
            .locator('[data-test="product-name"]')
            .allTextContents();

        expect(productNames.length).toBeGreaterThan(0);

        for (const productName of productNames) {
            expect(productName.toLowerCase()).toContain("hammer");
        }

        console.log("Aryan Patil - Search results validated");
    });

    test("Product Details Validation", async ({ page }) => {
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);

        await homePage.goto();

        const firstProductCard = homePage.getProductCards().first();
        await expect(firstProductCard).toBeVisible();

        const expectedProductName =
            await firstProductCard
                .locator('[data-test="product-name"]')
                .textContent();

        const expectedImageAlt =
            await firstProductCard.locator("img").getAttribute("alt");

        const productName = expectedProductName?.trim() ?? "";

        await firstProductCard.click();

        await productPage.expectProductTitle(productName);
        await productPage.expectProductPrice();
        await expect(
            page.locator(`img[alt="${expectedImageAlt}"]`)
        ).toBeVisible();
        await productPage.expectAddToCartButton();

        console.log("Aryan Patil - Product details validated");
    });

    test("Cart Functionality", async ({ page }) => {
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);

        await homePage.goto();

        const firstProductCard = homePage.getProductCards().first();
        await expect(firstProductCard).toBeVisible();

        const firstProductName =
            (await firstProductCard
                .locator('[data-test="product-name"]')
                .textContent())?.trim() ?? "";

        await firstProductCard.click();

        const firstProductPrice = parsePrice(
            await productPage.getProductPrice()
        );

        await productPage.addProductWithQuantity(2);

        await expect(homePage.getCartQuantity()).toHaveText("2");

        await homePage.goto();

        const secondProductCard = homePage.getProductCards().nth(1);
        await expect(secondProductCard).toBeVisible();

        const secondProductName =
            (await secondProductCard
                .locator('[data-test="product-name"]')
                .textContent())?.trim() ?? "";

        await secondProductCard.click();

        const secondProductPrice = parsePrice(
            await productPage.getProductPrice()
        );

        await productPage.addToCart();

        await expect(homePage.getCartQuantity()).toHaveText("3");

        await cartPage.goto();

        await cartPage.expectProduct(firstProductName);
        await cartPage.expectProduct(secondProductName);

        await cartPage.expectProductQuantity(0, 2);
        await cartPage.expectProductQuantity(1, 1);

        const expectedSubtotal = calculateSubtotal(
            [firstProductPrice, secondProductPrice],
            [2, 1]
        );

        const actualSubtotal = await cartPage.getSubtotal();

        expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);

        await cartPage.expectProceedToCheckoutButton();

        console.log("Aryan Patil - Cart functionality validated");
    });

    test("Sorting Validation - Price High to Low", async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.goto();

        const productCards = homePage.getProductCards();
        await expect(productCards.first()).toBeVisible();

        await page.getByRole("combobox", {
            name: "sort"
        }).selectOption({
            label: "Price (High - Low)"
        });

        await expect(async () => {
            const rawPriceTexts =
                await homePage.getProductPrices();

            const actualPrices = rawPriceTexts.map(parsePrice);

            const expectedPrices = [...actualPrices].sort(
                (firstPrice, secondPrice) =>
                    secondPrice - firstPrice
            );

            expect(actualPrices).toEqual(expectedPrices);
        }).toPass({ timeout: 10000 });

        console.log("Aryan Patil - Sorting validation completed");
    });

    test("Negative Login Validation", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.expectLoginPage();

        await loginPage.login(
            invalidLoginData.email,
            invalidLoginData.password
        );

        await loginPage.expectInvalidCredentialsError();

        console.log("Aryan Patil - Negative login scenario validated");
    });

    test("Checkout Flow", async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.goto();

    await homePage.openProduct("Pliers");
    await productPage.addProductWithQuantity(2);

    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText("2");

    await homePage.goto();

    await homePage.openProduct("Claw Hammer");
    await productPage.addToCart();

    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText("3");

    await page.locator('[data-test="cart-quantity"]').click();

    await expect(page.locator("tbody")).toContainText("Pliers");
    await expect(page.locator("tbody")).toContainText("Claw Hammer");

    await expect(page.getByRole("spinbutton").nth(0)).toHaveValue("2");
    await expect(page.getByRole("spinbutton").nth(1)).toHaveValue("1");

    await page.getByRole("button", {
        name: "Proceed to checkout",
        exact: true
    }).click();

    await checkoutPage.continueAsGuest();

    await checkoutPage.fillGuestDetails(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.email
    );

    await checkoutPage.fillBillingAddress(
        checkoutData.country,
        checkoutData.postalCode,
        checkoutData.houseNumber
    );

    await checkoutPage.selectPaymentMethod(
        "Cash on Delivery"
    );

    await checkoutPage.placeOrder();

    await checkoutPage.expectSuccessfulOrder();

    console.log("Aryan Patil - Checkout completed successfully");
});
});