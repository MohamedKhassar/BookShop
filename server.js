const express = require("express");
const booksRouter = require("./Routes/booksRoutes");
const authRoute = require("./Routes/authRoutes");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/books", booksRouter);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
