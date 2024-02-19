import cartFragment from "../fragments/cart";

export const getCartQuery = `
    query getCart($cartId: ID!) {
        cart(id: $cartId) {
            ...cart
        }
    }
    ${cartFragment}
`;