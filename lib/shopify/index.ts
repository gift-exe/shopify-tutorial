import { HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from "../constants";
import { isShopifyError } from "../type-guards";
import { ensureStartsWith } from "../utils";

import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { addToCartMutation, createCartMutation, editCartItemsMutation, removeFromCartMutation } from "./mutations/cart";

import { getCartQuery } from "./queries/cart";
import { getCollectionProductsQuery, getCollectionQUery, getCollectionsQUery } from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getPageQuery, getPagesQUery } from "./queries/page";
import { getProductQuery, getProductRecommendationsQuery, getProductsQuery } from "./queries/product";

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

