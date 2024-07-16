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
  query User($userId: ID!) {
    user(userId: $userId) {
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

export const QUERY_ME = gql`
  query me {
    me {
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