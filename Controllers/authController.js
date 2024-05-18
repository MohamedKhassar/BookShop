const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("../DB/userDb");

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
  };

  users.push(newUser);

  const token = jwt.sign(
    { userId: newUser.id, username: newUser.username },
    "secretKey",
    { expiresIn: "1h" }
  );

  res.status(201).json({
    message: "Customer successfully registered. Now you can login",
    token,
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    "secretKey",
    { expiresIn: "1d" }
  );
  res.cookie("token", token);
  res.status(200).json({ message: "Customer successfully logged in", token });
};

module.exports = {
  register,
  login,
};
