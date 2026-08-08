const express = require("express");
require("dotenv").config();
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());


app.use("/users",require('./routes/userRoutes'));
app.use("/stocks", require('./routes/stockRoutes'));
app.use("/retail",require('./routes/retailRoutes'));
app.use("/manager",require('./routes/managerRoutes'));
app.use("/notifications",require('./routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;