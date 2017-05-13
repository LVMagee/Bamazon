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

// function which prompts the user for what action they should take
var start = function() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, res) {
  	if (err) throw err;

  	var table = new Table({
  		head: ["ID", "Product Name", "Price", "Quantity"]
  	});

  	for (var i = 0; i < res.length; i++) {
  		table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]);
  	}

  	console.log(table.toString());
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
  		name: "Quantity",
  		type: "input",
  		message: "How many of this item would you like to buy?",
  		validate: function(value) {
  			if (isNaN(value) == false) {
  				return true;
  			} else {
  				return false;
  			}
  		}

  	}]).then(function(answer) {
		// Query the database for info about the item including the quantity currently in stock. 
		connection.query('SELECT product_name, price, stock_quantity FROM products WHERE ?', {Item_ID: answer.id}, function(err,res) {
			
			console.log('\n  You would like to buy ' + answer.quantity + ' ' + res[0].product_name + ' ' + ' at $' + res[0].price + ' each');
			if (res[0].stock_quantity >= answer.quantity) {
				//If enough inventory to complete order, process order by updating database inventory and notifying customer that order is complete. 
				var itemQuantity = res[0].stock_quantity - answer.quantity;

				connection.query("UPDATE products SET ? WHERE ?", [{
					stock_quantity: itemQuantity
				},{
					item_id: answer.id
				}], function(err,res) {
					if (err) throw err;
				})	


				var cost = res[0].price * answer.quantity;
				console.log('\n  Order fulfilled! Your cost is $' + cost + '\n');
				// Order completed
				start();

			} else {
				//If not enought inventory notify customer and prompt customer for desire to shop more
				console.log('\n  Sorry, Insufficient quantity to fulfill your order!\n');
				// Order not completed
				start();
			}
		});
	});	
  })
}


start();





