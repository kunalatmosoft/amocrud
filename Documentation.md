# Project Documentation

```
npm install amocrud express
```
### server.js

```javascript
const express = require('express');
const SQLiteCRUD = require('amocrud'); // Import the library
const app = express();
const port = 3000;
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Define the database file path and schema
const dbFilePath = 'test.db';
const tableName = 'users';
const schema = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  name: 'TEXT',
  email: 'TEXT'
};

// Create an instance of the CRUD library
const db = new SQLiteCRUD(dbFilePath, tableName, schema);

// API endpoints for CRUD operations

// Create
app.post('/api/create', (req, res) => {
  db.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Read all users
app.get('/api/users', (req, res) => {
  db.read({}, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Read a single user
app.get('/api/read/:id', (req, res) => {
  db.read({ id: req.params.id }, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update
app.put('/api/update/:id', (req, res) => {
  db.update({ id: req.params.id }, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Delete
app.delete('/api/delete/:id', (req, res) => {
  db.delete({ id: req.params.id }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Initialize the table
db.createTable(() => console.log('Table created'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

```

### public/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SQLite CRUD Operations</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>SQLite CRUD Operations</h1>
  <div id="app">
    <h2>Add User</h2>
    <form id="addUserForm">
      <input type="text" id="name" placeholder="Name" required>
      <input type="email" id="email" placeholder="Email" required>
      <button type="submit">Add User</button>
    </form>

    <h2>Update User</h2>
    <form id="updateUserForm">
      <input type="number" id="updateId" placeholder="User ID" required>
      <input type="text" id="updateName" placeholder="New Name">
      <input type="email" id="updateEmail" placeholder="New Email">
      <button type="submit">Update User</button>
    </form>

    <h2>All Users</h2>
    <button onclick="showAllUsers()">Show All Users</button>
    <div id="userList" class="user-list"></div>
    
    <div id="output"></div>
  </div>
  <script src="app.js"></script>
</body>
</html>

```

### public/styles.css

```css
body {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
}

#app {
  margin: 0 auto;
  max-width: 900px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out;
}

h1 {
  color: #333;
}

h2 {
  color: #555;
  margin-top: 20px;
}

form {
  margin: 20px 0;
}

input {
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: calc(50% - 24px);
  box-sizing: border-box;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007BFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.user-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 250px;
  padding: 15px;
  text-align: left;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.user-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.user-card button.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.user-card button.delete-btn:hover {
  background: #c82333;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

```

### public/app.js

```javascript
const outputDiv = document.getElementById('output');
const userListDiv = document.getElementById('userList');

document.getElementById('addUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  const response = await fetch('/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });
  const result = await response.json();
  outputDiv.innerText = `Record created: ${JSON.stringify(result)}`;
  document.getElementById('addUserForm').reset();
  await showAllUsers(); // Refresh the user list
});

document.getElementById('updateUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('updateId').value;
  const name = document.getElementById('updateName').value;
  const email = document.getElementById('updateEmail').value;

  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;

  const response = await fetch(`/api/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  outputDiv.innerText = `Record updated: ${JSON.stringify(result)}`;
  document.getElementById('updateUserForm').reset();
  await showAllUsers(); // Refresh the user list
});

async function showAllUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();
  userListDiv.innerHTML = users.map(user =>
    `<div class="user-card">
      <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
      <h3>${user.name}</h3>
      <p>Email: ${user.email}</p>
      <p>ID: ${user.id}</p>
    </div>`
  ).join('');
}

async function deleteUser(id) {
  const response = await fetch(`/api/delete/${id}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  outputDiv.innerText = `Record deleted: ${JSON.stringify(result)}`;
  await showAllUsers(); // Refresh the user list
}

```