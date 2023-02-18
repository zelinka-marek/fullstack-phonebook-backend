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
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minLength: [3, "Name must be at least 3 characters long"],
  },
  number: {
    type: String,
    required: [true, "Number is required"],
    trim: true,
    minLength: [8, "Number must be at least 8 characters long"],
    validate: {
      validator: (value) => /^\d{2,3}-\d+$/.test(value),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

export const Person = mongoose.model("Person", personSchema);
