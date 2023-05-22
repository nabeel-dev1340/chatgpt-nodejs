// index.js
import app from "./api/api.js";
import { PORT } from "./constants/constants.js";

app.listen(PORT, () => {
  console.log("app listening on port", PORT);
});
