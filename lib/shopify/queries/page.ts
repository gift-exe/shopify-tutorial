import seoFragment from "../fragments/seo";

const pageFragment = `
    fragment page on Page {
        ... on Page {
            id
            title
            handle
            body
            bodySummaty
            seo {
                ...seo
            }
            createdAt
            updatedAt
        }
    }
    ${seoFragment}
`;

export const getPageQuery = `
    query getPage($handle: String!) {
        pageByHandle(handle: $handle) {
            ...page
        }
    }
    ${pageFragment}
`;

export const getPagesQuery = `
    query getPages {
        pages(first: 100) {
            edges {
                node {
                    ...page
                }
            }
        }
    }
    ${pageFragment}
`;