
import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Backend rodando 🚀");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server running on port", port);
});
