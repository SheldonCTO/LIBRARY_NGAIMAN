/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'NEW_DATABASE_NAME';
const collection = 'NEW_COLLECTION_NAME';

// Create a new database.
use('test');

db.books.insertMany([{
	bookTitle:"Harry Potter-Half-Blood Prince",
	bookAuthor:"J.K. Rowling",
	image:"https://m.media-amazon.com/images/I/81YvqjX4AdL._SL1500_.jpg",
	borrow:"0000"
},
{
	bookTitle:"Harry Potter-The Order Of the Phoenix",
	bookAuthor:"J.K. Rowling",
	image:"https://m.media-amazon.com/images/I/81ofAZFwkNL._SL1500_.jpg",
	borrow:""
},
{
	bookTitle:"Harry Potter-The Goblet of Fire",
	bookAuthor:"J.K. Rowling",
	image:"https://m.media-amazon.com/images/I/81sUIr3c1pL._SL1500_.jpg",
	borrow:""
},
{
	bookTitle:"Harry Potter-The Prisoner of Azkaban",
	bookAuthor:"J.K. Rowling",
	image:"https://m.media-amazon.com/images/I/91VZqV0Cy8L._SL1500_.jpg",
	borrow:"0001"
},
{
	bookTitle:"Harry Potter-The Philosopher's Stone",
	bookAuthor:"J.K. Rowling",
	image:"https://m.media-amazon.com/images/I/81Fyh2mrw4L._SL1500_.jpg",
	borrow:"0001"
},
{

	bookTitle:"Harry Potter-The Deathly Hallows",
	bookAuthor:"J.K. Rowling",
	image:"https://m.media-amazon.com/images/I/81W7uynFyWL._SL1500_.jpg",
	borrow:"0000"
},
{
	bookTitle:"Harry Potter-The Chamber of Secrets",
	bookAuthor:"J.K. Rowling",
	image:"https://m.media-amazon.com/images/I/81gOJoEgVoL._SL1500_.jpg",
	borrow:"0001"
}])


db.users.insertMany([{
	name:"Abbie Lee",
	cardNo:"0000"
},
{
	name:"David Aziz",
	cardNo:"0001"
},
])
// Create a new collection.
