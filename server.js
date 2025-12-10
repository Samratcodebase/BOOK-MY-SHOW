import "dotenv/config";
import app from "./src/app.js";



app.listen(process.env.PORT, () => {
  console.log(`Server is Running on http://localhost:${process.env.PORT}`);
});
