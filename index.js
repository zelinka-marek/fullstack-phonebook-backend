import cors from "cors";
import express from "express";
import morgan from "morgan";
import { Person } from "./models/person.js";

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT must be set");
}

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
  const today = new Date().toLocaleString("en", {
    dateStyle: "full",
    timeStyle: "short",
  });

  Person.find().then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} ${
        persons.length === 1 ? "person" : "people"
      }</p><p>${today}</p>`
    );
  });
});

app.get("/api/persons", (_request, response) => {
  Person.find().then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  Person.findById(id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const { id } = request.params;

  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end();
  });
});

app.post("/api/persons", (request, response) => {
  const data = request.body;

  if (!data.name) {
    return response.status(400).json({ error: "name is missing" });
  }

  // const existingPerson = persons.find((person) => person.name === name);
  // if (existingPerson) {
  //   return response.status(400).json({ error: "name must be unique" });
  // }

  if (!data.number) {
    return response.status(400).json({ error: "number is missing" });
  }

  const person = new Person({
    name: data.name,
    number: data.number,
  });

  person.save().then((savedPerson) => {
    response.status(201).json(savedPerson);
  });
});

app.listen(port, () => console.log(`Running on port ${port}`));
