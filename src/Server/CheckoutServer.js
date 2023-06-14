const express = require("express");
const app = express();

const mysql = require("mysql2");
const cors = require("cors");
const { useRef, useState } = require("react");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "admin",
  database: "checkout",
});

const insertOrder = (name) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO Orders (name, date) VALUES (?, NOW())";
    db.query(query, [name], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const insertProduct = (product_name, product_price, product_quantity) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO Products (product_name, product_price, product_quantity) VALUES (?, ?, ?)";
    db.query(
      query,
      [product_name, product_price, product_quantity],
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const insertOrderItem = (orderId, productId) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO ORDER_ITEM (product_id,  order_id) VALUES(?,?)";
    db.query(query, [productId, orderId], (err, result) => {
      if (err) {
        console.log(err);
      }
    });
  });
};

app.post("/create", async (req, res) => {
  const name = req.body.name;
  const product_name = req.body.product_name;
  const product_price = req.body.product_price;
  const product_quantity = req.body.product_quantity;

  try {
    console.log(name, product_name, product_price, product_quantity);

    const orderResult = await insertOrder(name);
    const orderId = orderResult.insertId;
    console.log("OrderID:", orderId);

    const productResult = await insertProduct(
      product_name,
      product_price,
      product_quantity
    );
    const productId = productResult.insertId;
    console.log("productID:", productId);

    await insertOrderItem(orderId, productId);
    console.log(orderId, productId);
    res.send("Values Inserted");
  } catch (err) {
    console.error("Error executing queries:", err);
    res.status(500).send("Error occurred");
  }
});

app.listen(3001, () => {
  console.log("Server Running");
});
