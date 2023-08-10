const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let sameName = [];
    let i = 0;

    while(i < users.length){
        if(users[i].username === username){
            sameName.push(users[i]);
            break;
        }
        i++;
    }

    console.log(sameName.length);
    if(sameName.length > 0){
        return false;
      } else {
        return true;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let sameName = [];
    let i = 0;

    while(i < users.length){
        if(users[i].username === username){
            sameName.push(users[i]);
            break;
        }
        i++;
    }

    if(sameName[0].password === password){
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  req.session.username = username;
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  isbn = parseInt(isbn);
  let username = req.session.username;
  console.log(username);
  let newReview = req.query.review;
  console.log(newReview);

  if(Number.isInteger(isbn) && isbn > 0 && isbn <= 10){
    let checkBool = true;
    for([key, value] of Object.entries(books[isbn].reviews)){
        if(key === username){
            books[isbn].reviews[username] = newReview;
            let array = ["Review updated", books[isbn].reviews];
            return res.status(200).send(array);
            checkBool = false;
            break;
        }
    }
    if(checkBool){
        books[isbn].reviews[username] = newReview;
        let array = ["Review added", books[isbn].reviews];
        return res.status(200).send(array);
    }
    
  }
  else{
    res.send("invalid ISBN");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    isbn = parseInt(isbn);
    let username = req.session.username;

    if(Number.isInteger(isbn) && isbn > 0 && isbn <= 10){
        let title = books[isbn].title;
        if(username in books[isbn].reviews) {
            delete books[isbn].reviews[username];
            res.send(`Review from ${username} on ${title} removed.`);
        }
        else{
            res.send(`User ${username} does not have a review for ${title}.`);
        }
    }
    else{
        res.send("invalid ISBN");
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
