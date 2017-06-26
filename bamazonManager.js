// Import npm packages
var mysql = require('mysql');
var inquirer = require('inquirer');

// Establish mysql connection to database
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'Thouman1',
	database: 'bamazon_db'
});

// Confirm connection
connection.connect(function(err){
	if(err) throw err;
	console.log("Connected as: " + connection.threadId + '\n');
})

// Function to show all items in database
function viewProducts(){
	connection.query('SELECT * FROM products', function(err, res){
		if(err) throw err;
		for(var key in res){
			console.log("Item Id: " + res[key].item_id);
			console.log("Product Name: " + res[key].product_name);
			console.log("Price: " + res[key].price);
			console.log("Quantity: " + res[key].stock_quantity);
			console.log();
		}
	})
}

// Function to show items with low quantity of < 5
function viewLowInventory(){
	connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res){
		if(err) throw err;
		for(var key in res){
			console.log("Item Id: " + res[key].item_id);
			console.log("Product Name: " + res[key].product_name);
			console.log("Price: " + res[key].price);
			console.log("Quantity: " + res[key].stock_quantity);
			console.log();
		}
	})
}

// Function to add quantity to an existing item
function addToInventory(moreOf, moreTo){
	connection.query('UPDATE products SET stock_quantity = stock_quantity + ' + moreOf + ' WHERE item_id = ' + moreTo, function(err, res){
		if(err) throw err;
	})
}

// Add a new item to the database with prompted fields
function addNewItem(deptName, itemId, newItem, newPrice, newItemQuant){
	var post = {department_name:deptName, item_id:itemId, product_name:newItem, price: newPrice, stock_quantity: newItemQuant};
	connection.query('INSERT INTO products SET ?' , post, function(err, res){
		if(err) throw err;
	})
}

// To ensure connection confirmation function plays first
setTimeout(mainMenu, 2000);

// The main menu of the program
function mainMenu(){

	inquirer.prompt([
	{
		type: 'list',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
		name: 'mainMenu',
		message: "Please choose from the following selections."
	}
	// Depending on user's response the correspoing function will run
		]).then(function(response){
			if(response.mainMenu == 'View Products for Sale'){
				console.log("View Products");
				viewProducts();
			}
			else if(response.mainMenu == 'View Low Inventory'){
				console.log("View Low Inventory");
				viewLowInventory();	
			}
			else if(response.mainMenu == 'Add to Inventory'){
				console.log("Add to Inventory");
				inquirer.prompt([
				{
					name: 'moreTo',
					message: "What item number would you like to add to?"
				},
				{
					name: 'moreOf',
					message: "How much would you like to add?"
				}
					]).then(function(reply){
						var moreOf = reply.moreOf;
						var moreTo = reply.moreTo;
						addToInventory(moreOf, moreTo);
						connection.destroy();
					})
			}
			else if(response.mainMenu == 'Add New Product'){
				console.log("Add New Product");
				inquirer.prompt([
				{
					name: 'deptName',
					message: 'Enter the department name for the item.'
				},
				{
					name: 'itemId',
					message: 'Enter the new item number.'
				},
				{
					name: 'newItem',
					message: 'Enter the new item name.'
				},
				{
					name: 'newPrice',
					message: 'Enter the price of the item.'
				},
				{
					name: 'newItemQuant',
					message: 'Enter the quantity of the item to add.'
				}
					]).then(function(updating){
						var deptName = updating.deptName;
						var itemId = updating.itemId;
						var newItem = updating.newItem;
						var newPrice = updating.newPrice;
						var newItemQuant = updating.newItemQuant;
						addNewItem(deptName, itemId, newItem, newPrice, newItemQuant);
						connection.destroy();
					})
			}
		})
} // End of main menu function