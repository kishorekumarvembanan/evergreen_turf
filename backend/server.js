const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'https://your-frontend-url.com',  // Update this with your actual frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error: ", err));

app.use("/api/booking", require("./routes/booking"));
app.use("/api/payment", require("./routes/payment"));


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
