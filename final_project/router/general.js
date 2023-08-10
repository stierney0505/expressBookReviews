const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User registered"});
    } else {
      return res.status(404).json({message: "User already exists"});    
    }
  } 

  if(!username && !password){
    return res.status(404).json({message: "Empty usernames and passwords are invalid"});
  }
  else if(!username){
    return res.status(404).json({message: "Empty usernames are invalid"});
  }
  else if(!password){
    return res.status(404).json({message: "Empty passwords are invalid"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  isbn = parseInt(isbn);
  if(Number.isInteger(isbn) && isbn > 0 && isbn <= 10){
    return res.status(200).send(books[isbn]);
  }
  else{
    res.send("invalid ISBN");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let listBooks = [];

  for([key, value] of Object.entries(books)){
      if(value.author === author){
          listBooks.push(books[key]);
      }
  }

  return res.status(200).send(listBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let listBooks = [];

  for([key, value] of Object.entries(books)){
      if(value.title === title){
          listBooks.push(books[key]);
      }
  }

  return res.status(200).send(listBooks);
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = parseInt(req.params.isbn);

    if(Number.isInteger(isbn) && isbn > 0 && isbn <= 10){
        return res.status(200).send(books[isbn].reviews);
    }
      else{
        res.send("invalid ISBN");
    }
});


function getListOfBooks(){ //Task 10
    const listBooksPromise = new Promise((resolve, reject) => {
        try{resolve(books);}
        catch(err){reject("Request Failed");}
    });
    return listBooksPromise;
}

public_users.get("/", function (req, res) {
    getListOfBooks().then(
        (book)=>res.send(book),
        (err) => res.send(err)
    );
});


function getBookFromISBN(isbn){ //Task 11
    const getBookFromISBNPromise = new Promise((resolve, reject) => {
        if(books[isbn]){
            resolve(books[isbn]);
        }
        reject("Invalid ISBN");
    });

    return getBookFromISBNPromise;
}

public_users.get("/isbn/:isbn", function (req, res) {
    let isbn = req.params.isbn;
    getBookFromISBN(isbn).then(
        (book)=>res.send(book),
        (err) => res.send(err)
    );
});


function getBookFromAuthor(author){ //Task 12
    const getBookFromAuthorPromise = new Promise((resolve, reject) => {
        
        let listBooks = [];

        for([key, value] of Object.entries(books)){
            if(value.author === author){
                listBooks.push(books[key]);
            }
        }
        resolve(listBooks);
    });

    return getBookFromAuthorPromise;
} 

public_users.get("/author/:author", function (req, res) {
    let author = req.params.author;
    getBookFromAuthor(author).then(
        (book)=>res.send(book),
        (err) => res.send(err)
    );
});


function getBookFromTitle(title){ //Task 13
    const getBookFromTitlePromise = new Promise((resolve, reject) => {
        
        let listBooks = [];

        for([key, value] of Object.entries(books)){
            if(value.title === title){
                listBooks.push(books[key]);
            }
        }
        resolve(listBooks);
    });

    return getBookFromTitlePromise;
}

public_users.get("/title/:title", function (req, res) {
    let title = req.params.title;
    getBookFromTitle(title).then(
        (book)=>res.send(book),
        (err) => res.send(err)
    );
});

module.exports.general = public_users;
