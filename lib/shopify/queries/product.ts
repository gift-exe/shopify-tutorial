import productFragment from "../fragments/product";

export const getProductQuery = `
    query getProduct($handle: String!) {
        product(handle: $handle) {
            ...product
        }
    }
    ${productFragment}
`;

export const getProductsQuery = `
    query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
        products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
            edges {
                nodes {
                    ...product
                }
            }
        }
    }
    ${productFragment}
`;

export const getProductRecommendationsQuery = `
    query getProductRecommendations($productId: ID!) {
        productRecommendations(productId: $productID) {
            ...product
        }
    }
    ${productFragment}
`;