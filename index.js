import dotenv from "dotenv";
import Express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";

const PORT = process.env.PORT || 3030;
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = "text-davinci-003";
const allowedOrigins = [
  "https://wild-gray-goshawk-wrap.cyclic.app",
  "http://localhost:3000",
];

const app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.get("/", async (req, res) => {
  const TIME = req.query.time;
  const LOCATION = req.query.location;
  const EQUIPMENT = req.query.equipment;
  const MUSCLE = req.query.muscle;

  try {
    const Prompt = `
  Give me a ${TIME} minute workout plan for ${MUSCLE} at ${LOCATION} with ${EQUIPMENT}. Please include a warmup and cooldown. Also specify the time period for each exercise. Give the results in json format with keys Warm up:  Exercises:  and Cool down. All these keys have array entry and please provide a valid json object`;
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: MODEL,
        prompt: Prompt,
        temperature: 0,
        max_tokens: 400,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    res.send(JSON.parse(response.data.choices[0].text));
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
