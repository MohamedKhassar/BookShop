const jwt = require("jsonwebtoken");
const books = require("../DB/booksDb");

const getAllBooks = (req, res) => {
  try {
    return res.json(books);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the books" });
  }
};

const getBookByISBN = (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books.find((book) => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.json({
      author: book.author,
      title: book.title,
      reviews: book.reviews,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the book" });
  }
};

const getBooksByAuthor = (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = books.filter((book) => book.author === author);
    if (booksByAuthor.length === 0) {
      return res.status(404).json({ error: "No books found by this author" });
    }
    return res.json({
      booksByAuthor: booksByAuthor.map(({ author, ...rest }) => rest),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching books by author" });
  }
};

const getBooksByTitle = (req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = books.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
    if (booksByTitle.length === 0) {
      return res.status(404).json({ error: "No books found with this title" });
    }
    return res.json({
      booksByTitle: booksByTitle.map(({ title, ...rest }) => rest),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching books by title" });
  }
};

const getBookReview = (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books.find((book) => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.json(book.reviews);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the book reviews" });
  }
};

const updateOrAddBookReview = async (req, res) => {
  try {
    const { isbn } = req.params;
    const { review } = req.body;
    const token = req.headers.cookie.replace("token=", "");
    const user = jwt.decode(token);
    const book = books.find((b) => b.isbn === isbn);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    book.reviews.push({ review, user });
    res.status(200).json({
      message: `The review for the book with ISBN ${isbn} has been added/updated`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while updating the book review" });
  }
};

const deleteBookByUser = (req, res) => {
  try {
    const { isbn } = req.params;
    const book = books.find((book) => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const token = req.headers.cookie.replace("token=", "");
    const user = jwt.decode(token);
    const index = book.reviews.findIndex(
      (review) => review.user === user.username
    );
    book.reviews.splice(index, 1);
    res.status(200).json({
      message: `Reviews for the ISBN ${isbn} posted by the user ${user.username} deleted`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the book review" });
  }
};

module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReview,
  updateOrAddBookReview,
  deleteBookByUser,
};
