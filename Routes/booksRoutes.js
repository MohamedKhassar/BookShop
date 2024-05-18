const express = require("express");
const {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReview,
  deleteBookByUser,
  updateOrAddBookReview,
} = require("../Controllers/booksController");
const authMiddleware = require("../middleware/authMiddleware");
const booksRouter = express.Router();

booksRouter.get("/", getAllBooks);
booksRouter.get("/isbn/:isbn", getBookByISBN);
booksRouter.get("/author/:author", getBooksByAuthor);
booksRouter.get("/title/:title", getBooksByTitle);
booksRouter.get("/review/:isbn", getBookReview);
booksRouter.put("/review/:isbn", authMiddleware, updateOrAddBookReview);
booksRouter.delete("/review/:isbn", authMiddleware, deleteBookByUser);

module.exports = booksRouter;
