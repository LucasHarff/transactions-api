const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const { request } = require("http");

const app = express();

const transactions = [];

app.use(express.json());

app.get("/transactions", (request, response) => {
  const { id, title, value, type } = request.query;

  const results = { id, title, value, type };

  return response.json(results);
});

app.post("/transactions", (request, response) => {
  const { title, value, type } = request.body;

  const transaction = { id: uuid(), title, value, type };

  transactions.push(transaction);

  return response.json(transactions);
});

app.listen(3333, () => {
  console.log("Back-end started! 😎");
});
