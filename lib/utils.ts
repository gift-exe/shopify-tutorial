import { ReadonlyURLSearchParams } from "next/navigation";
import { start } from "repl";

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;
    
    return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) => {
    stringToCheck.startsWith(startsWith) ? stringToCheck: `${startsWith}${stringToCheck}`;
};

export const validateEnvironmentVariables = () => {
    const requeredEnvironmentVariables = ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN'];
    const missingEnvironmentVariables = [] as string[];

    requeredEnvironmentVariables.forEach((envVar => {
        if (!process.env[envVar]) {
            missingEnvironmentVariables.push(envVar);
        }
    }));

    if (missingEnvironmentVariables.length) {
        throw new Error(
            'The following environment variables are missing. Your site will not work without them'
        );
    }
    
}