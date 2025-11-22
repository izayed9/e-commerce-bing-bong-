import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { serverPort } from "./secret.js";

app.listen(serverPort, async () => {
  console.log("server running on port 3001");
  await connectDB();
});

export default app;
