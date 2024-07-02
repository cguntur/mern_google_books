import { gql } from "@apollo/client";

export const GET_ME = gql`
    query User {
        user {
            _id
            email
            username
            password
            savedBooks {
                title
                authors
                bookId
                description
                image
                link
            }
        }
    }
`;

export const QUERY_USERS = gql`
    query User {
        user {
            _id
            email
            username
            password
            savedBooks {
                title
                authors
                bookId
                description
                image
                link
            }
        }
    }
`;

export const QUERY_BOOKS = gql`
    query Books {
        books {
            _id
            title
            authors
            bookId
            description
            image
            link
        }
    }
`;