const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const { request } = require("http");
const { response } = require("express");

const app = express();

const mercado = { transactions: [], balance: {} };

// MIDDLEWARES

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); //prox middleware

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: `Param sent is not a valid UUID` });
  }
  next();
}

// ROUTES

app.use(express.json());

app.get("/transactions", logRequests, (request, response) => {
  const { id, title, value, type } = request.query;
  console.log(mercado.transactions);
  let income = 0;
  let outcome = 0;

  for (const transaction of mercado.transactions) {
    if (transaction.type === "income") {
      income += transaction.value;
    } else if (transaction.type === "outcome") {
      outcome -= transaction.value * -1;
    }
  }

  let total = income - outcome;

  mercado.balance = { income, outcome, total };

  console.log(mercado.balance);
  return response.json(mercado);
});

app.post("/transactions", logRequests, (request, response) => {
  const { title, value, type } = request.body;

  const transaction = { id: uuid(), title, value, type };

  mercado.transactions.push(transaction);

  return response.json(mercado);
});

app.put(
  "/transactions/:id",
  validateProjectId,
  logRequests,
  (request, response) => {
    const { id } = request.params;

    const { title, value, type } = request.body;

    const transactionIndex = mercado.transactions.findIndex(
      (transaction) => transaction.id === id
    );

    if (transactionIndex < 0) {
      return response.status(400).json({ error: "Transaction not found." });
    }

    const transaction = { id, title, value, type };

    mercado.transactions[transactionIndex] = transaction;

    return response.json(transaction);
  }
);

app.delete(
  "/transactions/:id",
  validateProjectId,
  logRequests,
  (request, response) => {
    const { id } = request.params;

    const transactionIndex = mercado.transactions.findIndex(
      (transaction) => transaction.id === id
    );

    if (transactionIndex < 0) {
      return response.status(400).json({ error: "Transaction not found." });
    }

    mercado.transactions.splice(transactionIndex, 1);

    return response.status(204).send();
  }
);

app.listen(3333, () => {
  console.log("Back-end started! 😎");
});
