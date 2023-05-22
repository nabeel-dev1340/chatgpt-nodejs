import { MongoClient } from "mongodb";
import { URL } from "../constants/constants.js";

const client = new MongoClient(URL, { useNewUrlParser: true });
client.connect((err) => {
  if (err) {
    console.log("Error connecting to db", err);
  } else {
    console.log("Connected successfully to db");
  }
});

export default client;
