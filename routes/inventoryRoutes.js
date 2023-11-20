<!DOCTYPE html>
<html>
<head>
    <title>Inventory List</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 80%;
            margin: auto;
            overflow: hidden;
        }

        h1 {
            background: #50b3a2;
            color: white;
            padding: 10px 0;
            text-align: center;
        }

        ul {
            list-style: none;
            padding: 0;
        }

        li {
            background: #fff;
            margin: 5px 0;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Inventory List</h1>
        <ul>
            <% inventoryItems.forEach(function(item) { %>
                <li><%= item.name %> - <%= item.quantity %></li>
            <% }); %>
        </ul>
    </div>
</body>
</html>

