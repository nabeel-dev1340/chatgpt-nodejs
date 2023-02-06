import { ChatGPTAPI } from "chatgpt";
import dotenv from "dotenv";
import Express from "express";
import bodyParser from "body-parser";
const PORT = process.env.PORT || 3030;
dotenv.config();

const app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const TIME = req.query.time;
  const LOCATION = req.query.location;
  const EQUIPMENT = req.query.equipment;
  const MUSCLE = req.query.muscle;

  const Prompt = `
  Give me a ${TIME} minute workout plan for ${MUSCLE} at ${LOCATION} with ${EQUIPMENT}. Please include a warmup and cooldown. Also specify the time period for each exercise. Give the results in json format with keys Warm up:  Exercises:  and Cool down. All these keys have array entry`;
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const data = await api.sendMessage(Prompt);
  res.send(data.text);
});

app.get("/hello", async (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("app listening on port", PORT);
});
