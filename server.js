const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// middleware

// custom middlware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next(); // allows the request to continue to the next middleware or route handler
}

// write a gatekeeper middleware that reads a password from the headers and if the password is "mellon", let it continue. If not, send back status code 401 and a message.

function gateKeeper(req, res, next) {
  console.log("At the gate");

  next();
}

function auth(req, res, next) {
  if (req.url === "/mellon") {
    next();
  } else {
    res.status(404).json({ message: "Password incorrect" });
  }
}

server.use(helmet()); // <<<<<- Used Globally
server.use(express.json()); //built in middleware
server.use(logger);
server.use(gateKeeper);

//endpoints

server.use("/api/hubs", hubsRouter); // the router is local middleware, because it only applies to /api/hubs

server.get("/mellon", auth, (req, res) => {
  console.log("Gate openning...");
  console.log("Gate open!");
  res.send("Welcome!");
});

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/echo", (req, res) => {
  res.send(req.headers);
});

// Used Locally
server.get("/area51", helmet(), (req, res) => {
  res.send(req.headers);
});

module.exports = server;
