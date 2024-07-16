import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookId: ID!, $title: String!, $description: String, $token: String!) {
    saveBook(bookId: $bookId, title: $title, description: $description, token: $token) {
      _id
        username
        email
        password
        savedBooks {
            authors
            description
            bookId
            image
            link
            title
        }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: ID!) {
    deleteBook(bookId: $bookId) {
        _id
        username
        email
        password
        savedBooks {
            authors
            description
            bookId
            image
            link
            title
        }
    }
  }
`;