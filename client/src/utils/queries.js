import { gql } from "@apollo/client";

export const QUERY_USERS = gql`
    query Users {
    users {
      _id
      username
      email
      savedBooks {
        bookId
        title
        description
        authors
        image
        link
      }
    }
  }
`;

export const QUERY_USER = gql`
  query User {
    user {
      _id
      username
      email
      savedBooks {
        bookId
        title
        description
        authors
        image
        link
      }
    }
  }
`;

export const QUERY_BOOKS = gql`
    query Books {
    books {
      bookId
      title
      description
      authors
      image
      link
    }
  }
`;