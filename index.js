import cors from "cors";
import express from "express";
import morgan from "morgan";
import { Person } from "./models/person.js";

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT must be set");
}

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  morgan((tokens, request, response) => {
    let body;
    if (process.env.NODE_ENV !== "production") {
      body = JSON.stringify(request.body);
    }

    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, "content-length"),
      "-",
      tokens["response-time"](request, response),
      "ms",
      body,
    ].join(" ");
  })
);

app.get("/info", (_request, response) => {
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(today);
  response.send(
    `<p>Phonebook has info for ${persons.length} ${
      persons.length === 1 ? "person" : "people"
    }</p><p>${formattedDate}</p>`
  );
});

app.get("/api/persons", (_request, response) => {
  Person.find().then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  const person = persons.find((person) => person.id === Number(id));
  if (!person) {
    return response.status(404).end();
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  persons = persons.filter((person) => person.id !== Number(id));

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name) {
    return response.status(400).json({ error: "name is missing" });
  }

  const existingPerson = persons.find((person) => person.name === name);
  if (existingPerson) {
    return response.status(400).json({ error: "name must be unique" });
  }

  if (!number) {
    return response.status(400).json({ error: "number is missing" });
  }

  const person = {
    id: persons.length + 1,
    name,
    number,
  };

  persons = persons.concat(person);

  response.status(201).json(person);
});

app.listen(port, () => console.log(`Running on port ${port}`));
