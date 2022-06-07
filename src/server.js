import express from "express";

const app = express();
const PORT = 3188;

const handleHome = (req, res) => {
  return res.send("I still love you");
};

const handLogin = (req, res) => {
  return res.send("Login Here.");
};

app.get("/", handleHome);
app.get("/login", handLogin);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
