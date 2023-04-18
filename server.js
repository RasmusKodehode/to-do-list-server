const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const express = require("express");
const { logger } = require("./middleware/logEvents");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");

const app = express();

const PORT = process.env.PORT || 3500;

app.use(logger);
app.use(cors());
app.use(cors(corsOptions));
app.use(errorHandler);
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.use("/tasks", require("./routes/api/tasks"));



app.get("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "view", "404.html"));
    } else if (req.accepts("json")) {
        res.json({error: "404 json Not found"});
    } else if (req.accepts("txt")) {
        res.type({error: "404 text Not Found"});
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})