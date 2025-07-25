import "dotenv/config";
import app from "./server";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
