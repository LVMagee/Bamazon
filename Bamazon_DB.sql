CREATE DATABASE Bamazon_DB;

USE Bamazon_DB;

CREATE TABLE products (
 item_id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(100) NULL,
 department_name VARCHAR(50) NULL,
 price DECIMAL(10, 2),
 stock_quantity INTEGER(10),
 PRIMARY KEY (item_id)
);

select * from Bamazon_DB.products;

insert into Bamazon_db.products (product_name, department_name, price, stock_quantity)
values ("Happy Face XLarge T-Shirt", "Clothing", 12.95, 100),
("Guardians of the Galaxy DVD", "Media", 14.76, 50),
("Mickey Mouse Watch", "Jewelry", 45.67, 90),
("Robotic Vacuum Cleaner", "Electronics", 324.99, 135),
("3-in-1 Harness Booster Car Seat", "Baby Products", 92.99, 85),
("Powerbeats3 Wireless In-Ear Headphones", "Electronics", 129.99, 10),
("Natural Earth MOVA Globe", "Office Supplies", 144.99, 9),
("Nanoblock Lion", "Toys", 11.99, 1),
("Marvel Comics Deadpool 1/6 Scale Plastic Painted Figure", "Toys", 280.28, 65),
("DESK DONUT Push Pin Holder", "Office Supplies", 13.75, 112);