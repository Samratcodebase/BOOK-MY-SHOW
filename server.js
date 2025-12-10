import "dotenv/config";
import app from "./src/app.js";
import ConnectToDB from "./src/Utils/DB/index.js";
ConnectToDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database Connection Failed:", err.message);
    process.exit(1); 
  });
