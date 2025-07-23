import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import toolSceme from "../routes/scheme.js";
import bodyParser from "body-parser";

const app = express();
dotenv.config();
const corsOptions = {
  origin: process.env.APP_URL,
  credentials: true, 
  optionSuccessStatus: 200,
methods: 'GET, POST',
allowedHeaders: 'Content-Type,Authorization'
};

const PORT = process.env.PORT || 3003;

app.use(cors(corsOptions));
app.use("/toolservice", toolSceme);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get("/toolservice", (req, res) => {
  res.json({ message: "Welcome to Intreskol scheme service" });
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
