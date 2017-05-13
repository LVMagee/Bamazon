// Require & connect section

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	// password: "password",
	database: "Bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
	if (err) throw err;
	// console.log("connected as id " + connection.threadId);
});

// function to start the store
var start = function() {
 // Query's mysql database
 connection.query("SELECT * FROM products", function(err, res) {
 	if (err) throw err;
// creates a nice looking table to display store sale items
var table = new Table({
	head: ["ID", "Product Name", "Price", "Quantity"]
});
// pushes items in data base to the table
for (var i = 0; i < res.length; i++) {
	table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
}
console.log(table.toString());
// askes the user what they would like to buy and how many
inquirer.prompt([{
	name: "itemId",
	type: "input",
	message: "What is the item ID you would like to buy?",
	validate: function(value) {
		if (isNaN(value) == false) {
			return true;
		} else {
			return false;
		}
	}
}, {
	name: "quantity",
	type: "input",
	message: "How many of this item would you like to buy?",
	validate: function(value) {
		if (isNaN(value) == false) {
			return true;
		} else {
			return false;
		}
	}
// query's the database for stock
}]).then(function(answer) {
	
		// Query the database for info about the item including the quantity currently in stock. 
		connection.query('SELECT product_name, price, stock_quantity FROM products WHERE ?', {item_ID: answer.itemid})

		console.log('\n  You have selected to buy ' + answer.quantity + ' ' + res[answer.itemId - 1].product_name + ' ' + ' at $' + res[answer.itemId - 1].price + ' each');
		if (res[answer.itemId - 1].stock_quantity >= answer.quantity) {
				//If enough inventory to complete order, process order by updating database inventory and notifying customer that order is complete. 
				var itemQuantity = res[answer.itemId - 1].stock_quantity - answer.quantity;
			// updates database quantity
			connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [itemQuantity, (answer.itemId)], function(err,res) {
				if (err) throw err;
				
			});	
			// tallys total
			var cost = res[answer.itemId - 1].price * answer.quantity;
			console.log('\n  Order fulfilled! Your cost is $' + cost + '\n');

			start();

		} else {
				//If not enought inventory notify customer and prompt customer for desire to shop more
				console.log('\n  Sorry, Insufficient quantity to fulfill your order!\n');
				// Order not completed
				start();
			}
		});
});	

}


start();





