import express from "express";

const port = 3001;

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
app.use(express.json());

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
  response.json(persons);
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
