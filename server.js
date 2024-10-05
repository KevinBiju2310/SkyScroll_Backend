require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./infrastructure/database/mongoose");
const userRoute = require("./interfaces/routes/userRoute");
const adminRoute = require("./interfaces/routes/adminRoute");
const airlineRoute = require("./interfaces/routes/airlineRoute");


const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

connectDB();
app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/airline", airlineRoute);

app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
