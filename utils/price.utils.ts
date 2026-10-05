export function parsePrice(priceText: string): number {
    return Number(priceText.replace(/[$,]/g, "").trim());
}

export function calculateSubtotal(
    prices: number[],
    quantities: number[]
): number {
    return prices.reduce(
        (subtotal, price, index) =>
            subtotal + price * quantities[index],
        0
    );
}