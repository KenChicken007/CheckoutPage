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
  database: "Checkout_Page",
});

const insertOrder = (name) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO Orders (name, date) VALUES (?, CURDATE())";
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
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const updatePrice = (orderId) => {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE Orders SET total_price = ( SELECT SUM(product_price*product_quantity) FROM Products WHERE Products.product_id IN ( SELECT product_id FROM Order_Item WHERE Order_Item.order_id = Orders.order_id ) )  WHERE order_id = ?";
    db.query(query, [orderId], (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const updateOrder = () => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE orders SET name = ? WHERE order_id = ? ";
  });
};

app.post("/create", async (req, res) => {
  const name = req.body.name;
  const productList = req.body.productList;

  try {
    const orderResult = await insertOrder(name);
    const orderId = orderResult.insertId;
    console.log("OrderID:", orderId);

    const promise = productList.map(async (product) => {
      const productResult = await insertProduct(
        product.name,
        product.price,
        product.quantity
      );

      const productId = productResult.insertId;
      console.log("productID: ", productId);

      await insertOrderItem(orderId, productId);
      await updatePrice(orderId);
    });

    await Promise.all(promise);

    res.send("Values Inserted");
  } catch (err) {
    console.error("Error executing queries:", err);
    res.status(500).send("Error occurred");
  }
});

app.get("/list", (req, res) => {
  db.query("SELECT * FROM Orders", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/final", (req, res) => {
  db.query("SELECT * FROM Orders", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/products/:orderId", (req, res) => {
  const orderID = req.params.orderId;

  const query = `SELECT product_name,product_quantity,product_price
                  FROM  Products WHERE product_id IN 
                  (SELECT product_id FROM order_item WHERE order_id = ?)`;

  db.query(query, [orderID], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Server Running");
});
