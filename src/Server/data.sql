use checkout_page;
     
DELETE FROM Order_Item;
alter table products auto_increment = 0;
DELETE FROM Orders;
DELETE FROM Products;

CREATE TABLE orders (
  order_id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  date date DEFAULT NULL,
  total_price decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (order_id)
);

CREATE TABLE products (
  product_id int NOT NULL AUTO_INCREMENT,
  product_name varchar(255) DEFAULT NULL,
  product_quantity int DEFAULT NULL,
  product_price decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (product_id)
);

CREATE TABLE order_item (
  order_id int DEFAULT NULL,
  product_id int DEFAULT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (order_id),
  FOREIGN KEY (product_id) REFERENCES Products (product_id)
);

Drop table Products;
describe order_item;
show tables;
ALTER TABLE order_item DROP foreign key product_id;
SHOW CREATE TABLE order_item;
alter table products drop primary key;

ALTER TABLE order_item DROP FOREIGN KEY product_id;

show tables;

UPDATE Products
JOIN order_item ON Products.product_id = order_item.product_id
JOIN orders ON order_item.order_id = orders.order_id
SET Products.product_name = 'Nestle', Products.product_quantity = 10, Products.product_price = 1000
WHERE orders.order_id = 16;

select * from products;

select * from order_item;

select * from orders;

SELECT Orders.order_id, Orders.date, Orders.name, Products.product_id, Products.product_name, Products.product_price, Products.product_quantity
FROM Orders
JOIN Order_Item ON Orders.order_id = Order_Item.order_id
JOIN Products ON Order_Item.product_id = Products.product_id
WHERE Orders.order_id = 7;

select * from products;