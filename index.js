import Express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import { MongoClient } from "mongodb";
import { URL, MODEL, API_KEY, FORMAT, PORT } from "./constants/index.js";
import removeUnwantedChars from "./helpers/removeUnwanted.js";

// connecting to db
const client = new MongoClient(URL, { useNewUrlParser: true });
client.connect((err) => {
  if (err) {
    console.log("Error connecting to db", err);
  } else {
    console.log("Connected successfully to db");
  }
});

const app = Express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: false,
  })
);

app.get("/", async (req, res) => {
  const TIME = req.query.time || 30;
  const LOCATION = req.query.location || "none";
  const EQUIPMENT = req.query.equipment || "none";
  const MUSCLE = req.query.muscle || "none";

  const key = `${MUSCLE}-${TIME}-${LOCATION}-${EQUIPMENT}`;

  try {
    // checking if data already exists
    const db = client.db("test");
    const workouts = db.collection("workouts");
    const workoutPlanData = await workouts.findOne({ key });

    if (workoutPlanData) {
      res.send(workoutPlanData);
    } else {
      const Prompt = `
  Give me a ${TIME} minute workout plan for ${MUSCLE} at ${LOCATION} with ${EQUIPMENT}. Please include a warmup and cooldown. Also specify the time period for each exercise. Give the result in following json format:${FORMAT}. Only JSON and no extra text and strictly follow the format. All these keys have array entry and please provide a valid json object`;
      const headers = {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      };

      const data = {
        model: MODEL,
        messages: [{ role: "user", content: Prompt }],
      };
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        { headers }
      );
      const cleanedRes = removeUnwantedChars(
        response.data.choices[0].message.content
      );
      const workoutPlan = JSON.parse(cleanedRes);

      // inserting data into db
      workoutPlan.key = `${key}`;
      await workouts.insertOne(workoutPlan);

      console.log("Data Logged.");

      res.send(workoutPlan);
    }
  } catch (error) {
    throw error;
  }
});

app.get("/customized", async (req, res) => {
  const TIME = req.query.time || 30;
  const EQUIPMENT = req.query.equipment || "none";
  const MUSCLE = req.query.muscle || "none";
  const FITNESS_LEVEL = req.query.fitness_level || "beginner";
  const FITNESS_GOALS = req.query.fitness_goals || "none";

  const key = `${MUSCLE}-${TIME}-${FITNESS_LEVEL}-${EQUIPMENT}-${FITNESS_GOALS}`;

  try {
    // checking if data already exists
    const db = client.db("test");
    const workouts = db.collection("workouts");
    const workoutPlanData = await workouts.findOne({ key });

    if (workoutPlanData) {
      res.send(workoutPlanData);
    } else {
      if (TIME > 40) {
        return res.status(400).json({
          message:
            "Invalid request. Maximum allowed workout time is 40 minutes.",
        });
      }

      const Prompt = `Give me a ${TIME} minute workout plan for ${MUSCLE} with ${EQUIPMENT}. My fitness level is ${FITNESS_LEVEL} and my fitness goals are ${FITNESS_GOALS}. Please include a warmup and cooldown. Also specify the time period for each exercise. Give the result in the following JSON format: ${FORMAT}. Only JSON is allowed, and no extra text. Please strictly follow the format. All keys should have an array entry. Provide a valid JSON object.`;
      const headers = {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      };

      const data = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: Prompt }],
      };
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        { headers }
      );
      const cleanedRes = removeUnwantedChars(
        response.data.choices[0].message.content
      );
      const workoutPlan = JSON.parse(cleanedRes);

      // inserting data into db
      workoutPlan.key = `${key}`;
      await workouts.insertOne(workoutPlan);

      console.log("Data Logged.");

      res.send(workoutPlan);
    }
  } catch (error) {
    throw error;
  }
});

app.get("/hello", async (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("app listening on port", PORT);
});
