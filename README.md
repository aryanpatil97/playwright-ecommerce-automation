# Playwright E2E Automation — Practice Software Testing

> A structured end-to-end test automation project built with Playwright and TypeScript, developed as a hands-on exploration of modern web automation during my Initial Learning Program (ILP) in the Quality Engineering & Transformation domain at Tata Consultancy Services (TCS).

[![Playwright](https://img.shields.io/badge/Playwright-TypeScript-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Test Status](https://img.shields.io/badge/tests-7%2F7%20passed-success)](#test-results)

## Overview

This project demonstrates practical UI test automation for the [Practice Software Testing](https://practicesoftwaretesting.com/) e-commerce application.

The project was designed around realistic QA scenarios rather than simple UI checks. It uses Playwright's browser automation, locator strategies, assertions, Page Object Model (POM), reusable utilities, dynamic data extraction, synchronization, and end-to-end workflow validation.

The automation suite covers the complete journey from basic application validation to product search, cart calculations, authentication failure handling, sorting, and checkout.

## Test Coverage

| # | Scenario | What is validated |
|---|---|---|
| 1 | Homepage Validation | URL, title, navigation, search field, and product cards |
| 2 | Search Functionality | Search execution and product filtering |
| 3 | Product Details Validation | Product name, price, image, and Add to Cart control |
| 4 | Cart Functionality | Multiple products, quantities, cart count, and dynamic subtotal calculation |
| 5 | Sorting Validation | Price High → Low ordering using dynamically extracted values |
| 6 | Negative Login Validation | Invalid credentials, error message, and failed login state |
| 7 | Checkout Flow | Guest checkout, billing details, payment selection, and order confirmation |

## Architecture

The project follows a lightweight Page Object Model architecture.

```text
playwright-ecommerce-automation/
│
├── tests/
│   └── aryanPatilPlaywright.spec.ts
│
├── pages/
│   ├── Home.page.ts
│   ├── Product.page.ts
│   ├── Cart.page.ts
│   ├── Login.page.ts
│   └── Checkout.page.ts
│
├── utils/
│   ├── test.data.ts
│   └── price.utils.ts
│
├── reports/
│   └── report-screenshot.png
│
├── playwright.config.ts
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### Why this structure?

- **tests/** contains test scenarios and business-level validation.
- **pages/** encapsulates page locators and reusable page actions.
- **utils/** contains reusable test data and calculation helpers.
- **reports/** contains portfolio-friendly test execution evidence.
- **playwright.config.ts** contains Playwright execution configuration.
- **README.md** documents the project, architecture, setup, and results.

The Page Object layer separates UI interaction details from test intent. For example, the cart page encapsulates cart locators, quantity handling, product extraction, subtotal extraction, and checkout navigation rather than placing all of that logic directly inside the test. 
## Key Automation Practices Demonstrated

### Page Object Model

Dedicated page classes represent the major application areas:

- `HomePage`
- `ProductPage`
- `CartPage`
- `LoginPage`
- `CheckoutPage`

The implementation keeps locators and reusable actions inside these classes. For example, the product page encapsulates quantity handling and Add to Cart behavior. 
### Locator Engineering

The project uses Playwright locators such as:

- `getByRole()`
- `getByText()`
- `locator()` with application `data-test` attributes
- CSS selectors where appropriate

The goal is to keep selectors readable and tied to meaningful application elements rather than relying heavily on brittle positional selectors.

### Dynamic Validation

The tests do not rely only on hardcoded expected UI values.

For example, the cart test extracts product prices from the application and calculates the expected subtotal from price × quantity before comparing it with the displayed subtotal. 


The reusable price utility contains the parsing and subtotal calculation logic. 
### Search Validation

The search test executes a Hammer search and verifies that returned product names actually contain the searched term, demonstrating filtering behavior rather than merely checking that the search field accepted text. 

### Sorting Validation

The sorting scenario extracts displayed prices, creates an expected descending representation programmatically, and compares the actual UI order against it. This avoids hardcoding a particular product-price sequence. 


### Negative Testing

The login scenario intentionally uses invalid credentials and verifies both the error message and the fact that the application remains on the login page. 

### End-to-End Checkout

The checkout scenario covers a complete purchase workflow, including adding products with different quantities, navigating through guest checkout, entering customer and billing details, selecting Cash on Delivery, placing the order, and validating the generated invoice confirmation. 
 


## Test Results

The captured Playwright report shows:

- **7 tests**
- **7 passed**
- **0 failed**
- **0 flaky**
- **0 skipped**
- **Chromium**
- **Total execution time: 28.5 seconds**

The seven scenarios are all represented in the execution report, including Homepage, Search, Product Details, Cart, Sorting, Negative Login, and Checkout. 

A screenshot of the successful execution report is included under `reports/`.

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- VS Code or another TypeScript-compatible editor

### Installation

Clone the repository:

```bash
git clone <https://github.com/aryanpatil97/playwright-ecommerce-automation>
cd playwright-ecommerce-automation
```

Install dependencies:

```bash
npm install
```

Install the Playwright Chromium browser:

```bash
npx playwright install chromium
```

### Run the Test Suite

Run all tests:

```bash
npx playwright test
```

Run using the Chromium project:

```bash
npx playwright test --project=chromium
```

Run in headed mode:

```bash
npx playwright test --headed
```

Run a specific test file:

```bash
npx playwright test tests/aryanPatilPlaywright.spec.ts
```

### View the Playwright HTML Report

After a test execution:

```bash
npx playwright show-report
```

## Example Execution Flow

```text
Homepage
   ↓
Search
   ↓
Product Details
   ↓
Cart
   ↓
Sorting
   ↓
Negative Login
   ↓
Checkout
   ↓
Order Confirmation
```

Each test is designed to validate a specific functional area independently, while the checkout scenario demonstrates a broader end-to-end business workflow.

## Project Design Principles

This project focuses on:

- Maintainable automation architecture
- Reusable Page Objects
- Meaningful assertions
- Dynamic validation
- Reliable Playwright locators
- Test isolation
- Explicit test data
- Reusable utility functions
- Playwright's built-in synchronization
- Business-flow-oriented test scenarios
- Clear separation between test intent and UI implementation

## Sample Implementation

The main test suite imports the Page Objects and utility modules rather than placing all interaction logic directly in the test file. 
The cart validation demonstrates the intended separation clearly: page-level methods handle UI interaction, while the test coordinates the scenario and performs business-level assertions. 


## Test Data

Test data is separated from the test implementation. The repository currently defines checkout data, intentionally invalid login credentials, and checkout product names in a dedicated data module. 
For a public portfolio repository, replace any personal or realistic-looking contact information with clearly fictional test data before publishing.

## Future Improvements

Possible next steps for the project:

- Add a dedicated `playwright.config.ts` with projects and execution settings
- Add GitHub Actions CI/CD
- Run the suite across Chromium, Firefox, and WebKit
- Add trace collection and failure artifacts
- Add environment-based test configuration
- Expand test coverage for filters, pagination, product availability, and cart edge cases
- Introduce reusable fixtures where they provide clear value
- Publish the HTML report through GitHub Pages
- Add a test-case matrix and defect documentation

## Disclaimer

This project is an independent learning and demonstration project created while exploring Playwright-based test automation during my TCS Initial Learning Program.

The target application is a publicly available practice/testing application. This repository is intended to demonstrate automation engineering skills and does not represent an official TCS product, internal TCS automation framework, or TCS-sponsored software project.

## Author

**Aryan Patil**

B.E. Information Technology

Playwright | TypeScript | E2E Automation | Software Testing | Page Object Model

[GitHub](https://github.com/aryanpatil97) · [LinkedIn](https://www.linkedin.com/in/aryanpatil97/)
