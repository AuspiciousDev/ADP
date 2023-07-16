require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const credentials = require("./middleware/credentials");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const PORT = process.env.LOCAL_PORT || 4600;

// Connect to MongoDB
connectDB();

//set the template engine
app.set("view engine", "ejs");

// custom middleware logger
app.use(logger);

// handle options credentials check - before CORS!
// and fetch cookies credentials  requirements
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.json());
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));
// middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.resolve(__dirname, "public")));

app.use("/", require("./routes/root"));

// ? PUBLIC ROUTES
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// ! Require JWT Token to access data
// app.use(verifyJWT);

// ? PRIVATE ROUTES
app.use("/api/enrollments", require("./routes/api/enrolledRoute"));
app.use("/api/students", require("./routes/api/studentRoute"));
app.use("/api/subjects", require("./routes/api/subjectRoute"));
app.use("/api/teachers", require("./routes/api/teacherRoute"));
app.use("/api/schedules", require("./routes/api/scheduleRoute"));
app.use("/api/strands", require("./routes/api/strandRoute"));
app.use("/api/sections", require("./routes/api/sectionRoute"));
app.use("/api/levels", require("./routes/api/levelRoute"));
app.use("/api/departments", require("./routes/api/departmentRoute"));
app.use("/api/schoolyears", require("./routes/api/schoolYearRoute"));
app.use("/api/loginHistory", require("./routes/api/loginHistoryRoute"));
app.use("/api/users", require("./routes/api/userRoute"));

app.use(errorHandler);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "page", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
