import express from "express";
import dotenv from "dotenv";
import { googleSheetRouter } from "./modules/google-sheet/router/index.js";
import { reminderRouter } from "./modules/reminder/router/index.js";
import { transactionRouter } from "./modules/transaction/router/index.js";
import { userRouter } from "./modules/user/router/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/google-sheet", googleSheetRouter);
app.use("/reminder", reminderRouter);
app.use("/transaction", transactionRouter);
app.use("/user", userRouter);
app.get("/", (_, res) => {
  res.send("Hello world");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
