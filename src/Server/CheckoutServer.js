const express = require("express");
const app = express();

const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "admin",
  database: "checkout",
});

app.post("/create", (req, res) => {
  const name = req.body.name;

  db.query("INSERT INTO Customers(name) VALUES(?)", [name], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Values Inserted");
    }
  });
});
