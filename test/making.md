Sure, let's rewrite the project for `crudlib` with a clean structure. We'll include a basic SQLite CRUD library, a test script, and a `package.json` setup. Here’s a step-by-step guide:

### 1. Project Structure

```
crudlib/
│
├── package/
│   ├── src/
│   │   └── crud.js
│   ├── test/
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── crudlib-test/  (optional test project folder)
```

### 2. Create the Library

**`crudlib/package/src/crud.js`**

```js
const sqlite3 = require('sqlite3').verbose();

class SQLiteCRUD {
  constructor(dbFilePath, tableName, schemaDefinition) {
    this.dbFilePath = dbFilePath;
    this.tableName = tableName;
    this.schemaDefinition = schemaDefinition;
    this.db = new sqlite3.Database(this.dbFilePath, (err) => {
      if (err) {
        console.error('Error opening database', err);
      }
    });

    this.createTable();
  }

  createTable(callback) {
    const columns = Object.keys(this.schemaDefinition)
      .map(key => `${key} ${this.schemaDefinition[key]}`)
      .join(', ');

    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${this.tableName} (${columns})`;

    this.db.run(createTableSQL, (err) => {
      if (err) {
        console.error('Error creating table', err);
      } else {
        console.log('Table created or already exists');
        if (callback) callback();
      }
    });
  }

  create(data, callback) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const insertSQL = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;

    this.db.run(insertSQL, values, function (err) {
      if (err) {
        console.error('Error inserting data', err);
        callback(err);
      } else {
        callback(null, { id: this.lastID, ...data });
      }
    });
  }

  read(query, callback) {
    const whereClause = Object.keys(query)
      .map(key => `${key} = ?`)
      .join(' AND ');

    const readSQL = `SELECT * FROM ${this.tableName}${whereClause ? ' WHERE ' + whereClause : ''}`;
    const values = Object.values(query);

    this.db.all(readSQL, values, (err, rows) => {
      if (err) {
        console.error('Error reading data', err);
        callback(err);
      } else {
        callback(null, rows);
      }
    });
  }

  update(query, updateData, callback) {
    const setClause = Object.keys(updateData)
      .map(key => `${key} = ?`)
      .join(', ');

    const whereClause = Object.keys(query)
      .map(key => `${key} = ?`)
      .join(' AND ');

    const updateSQL = `UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause}`;
    const values = [...Object.values(updateData), ...Object.values(query)];

    this.db.run(updateSQL, values, function (err) {
      if (err) {
        console.error('Error updating data', err);
        callback(err);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  delete(query, callback) {
    const whereClause = Object.keys(query)
      .map(key => `${key} = ?`)
      .join(' AND ');

    const deleteSQL = `DELETE FROM ${this.tableName} WHERE ${whereClause}`;
    const values = Object.values(query);

    this.db.run(deleteSQL, values, function (err) {
      if (err) {
        console.error('Error deleting data', err);
        callback(err);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database', err);
      } else {
        console.log('Database closed');
      }
    });
  }
}

module.exports = SQLiteCRUD;
```

**`crudlib/package/src/index.js`**

```js
const SQLiteCRUD = require('./crud');

module.exports = SQLiteCRUD;
```

### 3. Create the Test Script

**`crudlib/package/test/index.js`**

```js
const SQLiteCRUD = require('crudlib'); // Import the library

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

// Test CRUD operations
function runTests() {
  console.log('Running CRUD tests...');

  db.createTable(() => {
    // CREATE
    db.create({ name: 'John Doe', email: 'john@example.com' }, (err, result) => {
      if (err) throw err;
      console.log('Record created:', result);

      // READ
      db.read({ id: result.id }, (err, rows) => {
        if (err) throw err;
        console.log('Record read:', rows);

        // UPDATE
        db.update({ id: result.id }, { email: 'john.doe@example.com' }, (err, result) => {
          if (err) throw err;
          console.log('Record updated:', result);

          // DELETE
          db.delete({ id: result.id }, (err, result) => {
            if (err) throw err;
            console.log('Record deleted:', result);

            // Verify deletion
            db.read({ id: result.id }, (err, rows) => {
              if (err) throw err;
              console.log('Record after deletion:', rows);

              // Close the database
              db.close();
            });
          });
        });
      });
    });
  });
}

runTests();
```

### 4. Create `package.json`

**`crudlib/package/package.json`**

```json
{
  "name": "crudlib",
  "version": "1.0.0",
  "description": "A simple CRUD library for SQLite",
  "main": "src/index.js",
  "scripts": {
    "test": "node test/index.js"
  },
  "dependencies": {
    "sqlite3": "^5.0.0"
  },
  "devDependencies": {},
  "author": "",
  "license": "ISC"
}
```

### 5. Install Dependencies and Test

1. **Navigate to the `crudlib` package folder**:

   ```bash
   cd crudlib/package
   ```

2. **Link dependencies**:

   ```bash
   npm link
   ```

3. **Run the test script in test folder cd/test**:

   ```bash
   npm link amocrud
   ```

This setup provides a simple SQLite CRUD library and a test script to validate its functionality. The `index.js` test script ensures that the table is created, and CRUD operations are performed in sequence.