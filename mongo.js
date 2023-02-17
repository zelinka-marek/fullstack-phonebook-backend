import mongoose from "mongoose";

function connect() {
  const password = process.argv[2];
  if (!password) {
    console.error("Error: password is missing");
    console.log("Usage: node mongo.js <password>");
  }

  const uri = `mongodb+srv://user:${password}@cluster0.10skx.mongodb.net/fullstack-notes?retryWrites=true&w=majority`;
  mongoose.set("strictQuery", false);
  mongoose.connect(uri);
}

function disconnect() {
  mongoose.connection.close();
  process.exit(0);
}

connect();

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = new mongoose.model("Person", personSchema);

const name = process.argv[3];
const number = process.argv[4];

if (name && number) {
  const person = new Person({ name, number });
  person.save().then((savedPerson) => {
    console.log(`added ${savedPerson.name} ${savedPerson.number} to phonebook`);
    disconnect();
  });
} else {
  Person.find().then((persons) => {
    console.log("phonebook:");
    for (const person of persons) {
      console.log(`${person.name} ${person.number}`);
    }
    disconnect();
  });
}
