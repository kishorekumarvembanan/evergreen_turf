const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://evergreenturf.netlify.app'
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

const adminRoutes = require("./routes/admin");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error: ", err));

app.use("/api/booking", require("./routes/booking"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
