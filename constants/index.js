import dotenv from "dotenv";
dotenv.config();

export const URL = process.env.MONGO_URL;
export const MODEL = "text-davinci-003";
export const PORT = process.env.PORT || 3030;
export const API_KEY = process.env.OPENAI_API_KEY;
export const FORMAT = `{
  "Warm Up": [
  {
  "Exercise": string,
  "Time": string
  },
  ...
  ],
  "Exercises": [
  {
  "Exercise": string,
  "Sets": string,
  "Reps": string
  },
  ...
  ],
  "Cool Down": [
  {
  "Exercise": string,
  "Time": string
  },
  ...
  ]
  }`;
