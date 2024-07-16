import { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import { useQuery } from "@apollo/client";
import { QUERY_BOOKS } from "../utils/queries";
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';
//import { saveBook, searchGoogleBooks } from '../utils/API';
import { searchGoogleBooks } from '../utils/API';
//import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {

  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  console.log("Searched Books: " + JSON.stringify(searchedBooks));
  
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState([]);
  const { loading, data } = useQuery(QUERY_ME);
  console.log("loading: " + JSON.stringify(loading) + ", data: " + JSON.stringify(data));
  const mySavedBooks = (data?.me.savedBooks || [])
  const mySavedBookIds = mySavedBooks.map(book => book.bookId);
  console.log("mySavedBookIds: " + JSON.stringify(mySavedBookIds));
  
  const [saveBook] = useMutation(SAVE_BOOK);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
  //useEffect(() => {
  //  return () => saveBookIds(savedBookIds);
  //});
  //console.log("Saved book ids: " + savedBookIds);

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);
      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);

      console.log("Searched Books: " + JSON.stringify(bookData));
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id

    console.log("Book ID: " + bookId);
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    console.log("Book to save: " + JSON.stringify(bookToSave));

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log("Token: " + token);
    if (!token) {
      return false;
    }

    try {
      //const response = await saveBook(bookToSave, token);

      //if (!response.ok) {
      //  throw new Error('something went wrong!');
      //}

      //const { data } = saveBook({
      //  variables: { ...bookToSave }
      //});

      const response = await saveBook({
        variables: { ...bookToSave, token }
      });

      console.log("Response: " + JSON.stringify(response) );

      // if book successfully saves to user's account, save book id to state
      //setSavedBookIds([...savedBookIds, bookToSave.bookId]);
      setSavedBookIds([...savedBookIds]);
    } catch (err) {
      console.log("Error: " + err);
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            {console.log("Book id: " + book.bookId)}
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
