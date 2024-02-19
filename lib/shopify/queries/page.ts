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

export const getPageQuery = 