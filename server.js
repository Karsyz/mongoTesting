const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const passport = require("passport");
// const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
// const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
// require("./config/passport")(passport);

//Connect To Database
connectDB()

// Deploy on cyclic requires .then notation because serverless
// mongoose.connect(process.env.DB_STRING, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// })
// .then(() => {
//   // listen for requests
//   app.listen(process.env.PORT, () => {
//     console.log(`Server is listening on port ${process.env.PORT}`)
//   })
// })
// .catch((error) => {
//   console.log(error)
// })

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});