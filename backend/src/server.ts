import app from "./app.js";
import "dotenv/config.js"

const PORT = process.env.PORT || 3001;
console.log("Env: ", process.env.JWT_SECRET);

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
