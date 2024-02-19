import cartFragment from "../fragments/cart";

export const addToCartMutation = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cardId, lines: $lines) {
            cart {
                ...cart
            }
        }
    }
    ${cartFragment}
`;

export const createCartMutation = `
    mutation createCart($lineItems: [CartLineInput!]) {
        cartCreate(input: { lines: $lineItems }) {
            cart {
                ...cart
            }
        }
    }
    ${cartFragment}
`;

export const editCartItemsMutation = `
    mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
                ...cart
            }
        }
    }
    ${cartFragment}
`;

export const removeFromCartMutation = `
    mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartID: $cartId, linesIds: $lineIds) {
            cart {
                ...cart
            }
        }
    }
    ${cartFragment}
`;