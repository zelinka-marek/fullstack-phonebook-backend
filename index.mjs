import express from "express";

const port = 3001;

const persons = [
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

app.get("/api/persons", (_request, response) => {
  response.json(persons);
});

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

app.listen(port, () => console.log(`Running on port ${port}`));
