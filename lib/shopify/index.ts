import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from "../constants";
import { isShopifyError } from "../type-guards";
import { ensureStartsWith } from "../utils";

import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { addToCartMutation, 
         createCartMutation, 
         editCartItemsMutation, 
         removeFromCartMutation } from "./mutations/cart";

import { getCartQuery } from "./queries/cart";
import { getCollectionProductsQuery, 
         getCollectionQUery, 
         getCollectionsQUery } from "./queries/collection";

import { getMenuQuery } from "./queries/menu";
import { getPageQuery, getPagesQUery } from "./queries/page";

import { getProductQuery, 
         getProductRecommendationsQuery, 
         getProductsQuery } from "./queries/product";

import {
    Cart,
    Collection,
    Connection,
    Image,
    Menu,
    Page,
    Product,
    ShopifyAddToCartOperation,
    ShopifyCart,
    ShopifyCartOperation,
    ShopifyCollection,
    ShopifyCollectionOperation,
    ShopifyCollectionProductsOperation,
    ShopifyCollectionsOperation,
    ShopifyCreateCartOperation,
    ShopifyMenuOperation,
    ShopifyPageOperation,
    ShopifyPagesOperation,
    ShopifyProduct,
    ShopifyProductOperation,
    ShopifyProductRecommendationsOperation,
    ShopifyProductsOperation,
    ShopifyRemoveFromCartOperation,
    ShopifyUpdateCartOperation
  } from './types';

const domain = process.env.SHOPIFY_STORE_DOMAIN ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://'): '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
    cache = 'force-cache',
    headers,
    query,
    tags,
    variables
}: {
    cache?: RequestCache;
    headers?: HeadersInit;
    query: string;
    tags?: string[];
    variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
    try {
        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': key,
                ...headers
            },
            body: JSON.stringify({
                ...(query && { query }),
                ...(variables && { variables })
            }),
            cache,
            ...(tags && { next: { tags } })
        });

        const body = await result.json();
        
        if (body.errors) {
            throw body.errors[0];
        }

        return {
            status: result.status,
            body
        };
    } catch (e) {
        if (isShopifyError(e)) {
            throw {
                cause: e.cause?.toString() || 'unknown',
                status: e.status || 500,
                message: e.message,
                query
            };
        }

        throw {
            error: e,
            query
        };
    }
}

const removeEdgesAndNodes = (array: Connection<any>) => {
    return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
    if (!cart.cost?.totalTaxAmount) {
        cart.cost.totalTaxAmount = {
            amount: '0.0',
            currencyCode: 'USD'
        };
    }

    return {
        ...cart,
        lines: removeEdgesAndNodes(cart.lines)
    };
};

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
    if (!collection) {
        return undefined
    }

    return {
        ...collection,
        path: `/search/${collection.handle}`
    };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
    const reshapedCollections = [];

    for (const collection of collections) {
        if (collection) {
            const reshapedCollection = reshapeCollection(collection);

            if (reshapedCollection) {
                reshapedCollections.push(reshapedCollection);
            }
        }
    }

    return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
    const flattened = removeEdgesAndNodes(images);

    return flattened.map((image) => {
        const filename = image.url.match(/.*\/(.*)\..*/)[1];
        return {
            ...image,
            altText: image.altText || `${productTitle} - ${filename}`
        };
    });
};

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
    if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
        return undefined
    }

    const { images, variants, ...rest } = product;

    return {
        ...rest,
        images: reshapeImages(images, product.title),
        variants: removeEdgesAndNodes(variants)
    };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
    const reshapedProducts = [];

    for (const product of products) {
        if (product) {
            const reshapedProduct = reshapeProduct(product);

            if (reshapedProduct) {
                reshapedProducts.push(reshapedProduct)
            }
        }
    }

    return reshapeProducts;
};

export async function createCart(): Promise<Cart> {
    const res = await shopifyFetch<ShopifyCreateCartOperation>({
        query: createCartMutation,
        cache: 'no-store'
    });

    return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
    cartId: string,
    lines: { merchandiseId: string; quantity: number }[]
): Promise <Cart> {
    const res = await shopifyFetch<ShopifyAddToCartOperation>({
        query: addToCartMutation,
        variables: {
            cartId,
            lines
        },
        cache: 'no-store'
    });
    return reshapeCart(res.body.data.cartLinesAdd.cart)
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
    const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
        query: removeFromCartMutation,
        variables: {
            cartId,
            lineIds
        },
        cache:'no-store'
    });

    return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
    cartId: string,
    lines: { id: string; merchandiseId: string, quantity: number }[]
): Promise<Cart>{
    const res = await shopifyFetch<ShopifyUpdateCartOperation>({
        query: editCartItemsMutation,
        variables: {
            cartId,
            lines
        },
        cache: 'no-store'
    });

    return reshapeCart(res.body.data.cartLinesUpdate.cart)
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
    const res = await shopifyFetch<ShopifyCartOperation>({
        query: getCartQuery,
        variables: { cartId },
        tags: [TAGS.cart],
        cache: 'no-store'
    });

    if (!res.body.data.cart) {
        return undefined;
    }

    return reshapeCart(res.body.data.cart);
}