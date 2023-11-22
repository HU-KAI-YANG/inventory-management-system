Restaurant management system

Group: 4
Name: Hu Kaiyang
Student ID: 12969893

Application link: https://s381f-project-inventory-management-system.onrender.com

********************************************
Start：
npm install
npm start

And visit: localhost:1001

********************************************
# Register
Through the register interface, people can register a user account to access inventory management system.

User need to input username and password at register page.

After successful register, user can login at login page.

********************************************
# Login
Through the login interface, each user can access the restaurant information management system by entering their username and password.

Each user has a userID and password;
[
	{username: user1, password: test1},
	{username: user2, password: test2},
	{username: user3, password: test3}

]

After successful login, userid is stored in seesion.

********************************************
# Logout
In the home page, each user can log out their account by clicking logout.

********************************************
# CRUD service
- Create
-	A inventory document may contain the following attributes with an example: 
	1)	Name, a string represent inventory name.
	2)	Quantity, a number represent inventory number.

Inventory Name and Quantity is mandatory.

Create operation is post request, and all information is in body of request.

********************************************
# CRUD service
- Read
-  There are two options to read and find all inventories or searching by inventory name.

1) List all information
	By default, entering inventory.ejs will display all data;

2) Searching by inventory name or quantity
	Fill in the name or quantity in the input box to search for specific inventories;

********************************************
# CRUD service
- Update
- Users can update inventory fields, but only quantity can be updated.

********************************************
# CRUD service
- Delete
- The user can delete the inventory through the delete interface.

********************************************
# Restful
In this project, there are four HTTP request types, post, get, put and delete.
- Post 
	Post request is used for insert.
	Path URL: /api/inventory
	Test: ```curl -X POST -H "Content-Type: application/json" --data '{"name": "Tea", "quantity": 12}' http://localhost:1001/api/inventory```

- Get
	Get request is used for find.
	Path URL: /api/inventory?name=&gt=
	Test: ```curl -X GET http://localhost:1001/api/inventory```

- Put
	Put request is used for update.
	Path URL: /api/inventory/:inventoryName
	Test: ```curl -X PUT -H "Content-Type: application/json" --data '{"name": "Tea", "quantity": 15}' http://localhost:1001/api/inventory/Tea```

- Delete
	Delete request is used for deletion.
	Path URL: /api/inventory/:inventoryName
	Test: ```curl -X DELETE http://localhost:1001/api/inventory/Tea```

For all restful CRUD services, login should be done at first, If a user tries to access services before logging in, they will be redirected to the index page.
