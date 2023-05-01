const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    const fetchBooks = await (new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books)
        }, 1000)
    }))

    res.send(JSON.stringify({books: fetchBooks}, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const fetchBooks = await (new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books[isbn])
        }, 1000)
    }))

    res.send(fetchBooks)
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const fetchBooks = await (new Promise((resolve, reject) => {
        setTimeout(() => {
            for (const book of Object.keys(books)) {
                // console.log(books[book])
                if (books[book].author === author) {
                    resolve(books[book])
                }
            }
            
        }, 1000)
    }))

    if(fetchBooks) {
        return res.status(404).json(fetchBooks);
    }

    //Write your code here
    return res.status(404).json({ message: "Not found" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const fetchBooks = await (new Promise((resolve, reject) => {
        setTimeout(() => {
            for (const book of Object.keys(books)) {
                // console.log(books[book])
                if (books[book].title === title) {
                    resolve(books[book])
                }
            }
            
        }, 1000)
    }))

    if(fetchBooks) {
        return res.status(404).json(fetchBooks);
    }

    //Write your code here
    return res.status(404).json({ message: "Not found" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn]
    res.send(book.reviews)
});

module.exports.general = public_users;
