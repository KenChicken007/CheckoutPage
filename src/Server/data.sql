create database checkout_page;
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
select curdate();
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
describe orders;
alter table Orders modify paid varchar(5) default "false";

update Orders set paid = "True" where order_id = 3692;
select * from orders;

UPDATE Products
JOIN order_item ON Products.product_id = order_item.product_id
JOIN orders ON order_item.order_id = orders.order_id
SET Products.product_name = 'Nestle', Products.product_quantity = 10, Products.product_price = 1000
WHERE orders.order_id = 16;

select * from products;

select * from order_item;
delete from orders where total_price IS null;
select * from orders;
select current_timestamp();
delete from orders where order_id between 59 and 3630;

SELECT Orders.order_id, Orders.date, Orders.name, Products.product_id, Products.product_name, Products.product_price, Products.product_quantity
FROM Orders
JOIN Order_Item ON Orders.order_id = Order_Item.order_id
JOIN Products ON Order_Item.product_id = Products.product_id
WHERE Orders.order_id = 3697;
 
SELECT t1.*
FROM orders t1
LEFT JOIN (
  SELECT order_id
  FROM orders
  ORDER BY order_id DESC
  LIMIT 10
) AS t2 ON t1.order_id = t2.order_id
WHERE t2.order_id IS NULL;

-- This query selects all those rows that don't match the order_id of the recent 10
-- We place the order_id from recent 10 rows in t2 and select all the rows from t1 whose order_id is null in t2
-- thus filtering the rows in t2
SELECT t1.* FROM orders t1 LEFT JOIN ( SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 10) AS t2 ON t1.order_id = t2.order_id WHERE t2.order_id IS NULL order by order_id desc;

select * from orders;

select count(*)/10 from orders;