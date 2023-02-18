import cors from "cors";
import express from "express";
import morgan from "morgan";
import { Person } from "./models/person.js";

const port = process.env.PORT;
if (!port) {
  throw new Error("PORT must be set");
}

const requestLogger = morgan((tokens, request, response) => {
  const parts = [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, "content-length"),
    "-",
    `${tokens["response-time"](request, response)}ms`,
  ];

  if (process.env.NODE_ENV !== "production") {
    parts.push(JSON.stringify(request.body));
  }

  return parts.join(" ");
});

function errorHandler(error, _request, response, next) {
  console.error(error);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    const errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return response.status(400).json({ errors });
  }

  next(error);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/info", (_request, response, next) => {
  const today = new Date().toLocaleString("en", {
    dateStyle: "full",
    timeStyle: "short",
  });

  Person.find()
    .then((persons) =>
      response.send(
        `<p>Phonebook has info for ${persons.length} ${
          persons.length === 1 ? "person" : "people"
        }</p><p>${today}</p>`
      )
    )
    .catch(next);
});

app.get("/api/persons", (_request, response) => {
  Person.find().then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      response.json(person);
    })
    .catch(next);
});

app.post("/api/persons", (request, response, next) => {
  const data = request.body;

  // const existingPerson = persons.find((person) => person.name === name);
  // if (existingPerson) {
  //   return response.status(400).json({ error: "name must be unique" });
  // }

  new Person({ name: data.name, number: data.number })
    .save()
    .then((savedPerson) => response.status(201).json(savedPerson))
    .catch(next);
});

app.put("/api/persons/:id", (request, response, next) => {
  const data = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name: data.name, number: data.number },
    { new: true, runValidators: true }
  )
    .then((updatedPerson) => response.json(updatedPerson))
    .catch(next);
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(next);
});

app.use(errorHandler);

app.listen(port, () => console.log(`Running on port ${port}`));
