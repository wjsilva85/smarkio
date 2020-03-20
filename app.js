"use strict";

/**
 * Task descriptions are found on "todo.txt"
 * This is Wellington José da Silva Node.js test
 * Feel free to call me anytime: 11 9 4781-9890 (Also WhatsApp)
 * ".env" file is not added to ".gitignore" file just because this is a test
 * Execute "npm install" command before running
 */

// Enviroment setup
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Express server setup
const express = require("express");
const app = express();

// Body-parser setup
const bodyParser = require("body-parser");
// Set max upload size
app.use(
  bodyParser.urlencoded({
    limit: "1mb",
    extended: true,
    parameterLimit: 1000
  })
);

app.use(
  bodyParser.json({
    limit: "1mb"
  })
);

// Morgan Setup
// This is used to log activities on console
const morgan = require("morgan");
app.use(morgan("short"));

// Routes

//Address related requests
app.use(require("./src/controller/address"));

app.get("/", (req, res) => {
  res.send("This awesome script is running! - Wellington Smarkio Test");
});

// Server start
const port = process.env.PORT || 3000;
const rootUrl = process.env.ROOTURL || "http://localhost";
app.listen(port, _ => {
  console.log(
    `Server is up and listening on ${rootUrl}:${port}. - Wellington Smarkio Test`
  );

  console.log(
    "Open in Google Chrome to give it a Try: ",
    "http://localhost:3000/getaddress?zipcode=03640-010&name=wellington"
  );
});

// Note: HTTPS not ready. Use NGINX for HTTPS request
