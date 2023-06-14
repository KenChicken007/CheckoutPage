create database Checkout;
use Checkout;
create table Orders (order_id int not null auto_increment primary key, name varchar(50) not null, date date);
alter table Orders add total_price decimal(6,2);

drop table Customers;
create table Products (product_id int not null auto_increment primary key, product_name varchar(255), product_quantity int, product_price decimal(6,2) );

create table order_item (
		order_id int, 
        product_id int,
        foreign key (order_id) references Orders(order_id),
        foreign key (product_id) references Products(product_id)
        );
drop database Checkout;
show tables;

select * from Orders;
select date('date') from Orders;
select TIME('date') from Orders;
select CURRENT_TIMESTAMP();
INSERT INTO Orders (name, time) VALUES ("Abheesh kumar", CURRENT_TIMESTAMP());
select * from products;
select * from order_item;

UPDATE Orders
SET total_price = (
  SELECT SUM(product_price)
  FROM Products
  WHERE Products.product_id IN (
    SELECT product_id
    FROM Order_Item
    WHERE Order_Item.order_id = Orders.order_id
  )
)
WHERE order_id = 1;

SELECT Orders.order_id, Orders.date, Orders.name, Products.product_id, Products.product_name, Products.product_price, Products.product_quantity
FROM Orders
JOIN Order_Item ON Orders.order_id = Order_Item.order_id
JOIN Products ON Order_Item.product_id = Products.product_id
WHERE Orders.order_id = 3;



TRUNCATE TABLE Order_Item;
DELETE FROM Orders;
alter table orders auto_increment = 1;
alter table products auto_increment = 1;
DELETE FROM Products;

-- Create trigger for products table
DELIMITER $$
CREATE TRIGGER after_products_insert
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    -- Retrieve product_id from the newly inserted row
    SET @product_id = NEW.product_id;

    -- Insert into order_item table
    INSERT INTO order_item (order_id, product_id)
    SELECT MAX(order_id), @product_id
    FROM orders;
END$$
DELIMITER ;

-- Create trigger for orders table
DELIMITER $$
CREATE TRIGGER after_orders_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    -- Retrieve order_id from the newly inserted row
    SET @order_id = NEW.order_id;

    -- Insert into order_item table
    INSERT INTO order_item (order_id, product_id)
    SELECT @order_id, MAX(product_id)
    FROM products;
END$$
DELIMITER ;
