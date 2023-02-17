import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI must be set");
}

console.log("connecting to db");
mongoose
  .connect(uri)
  .then(() => console.log("connected to db"))
  .catch((error) => console.error("error connecting to db", error.message));

mongoose.set("strictQuery", false);
mongoose.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

export const Person = mongoose.model("Person", personSchema);
