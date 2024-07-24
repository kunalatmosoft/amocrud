# Documentation

```
npm install amocrud
```

```javascript

const SQLiteCRUD = require('amocrud'); // Import the library

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
async function runTests() {
  try {
    console.log('Running CRUD tests...');

    // Create table before running CRUD operations
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
                db.db.close((err) => {
                  if (err) throw err;
                  console.log('Database closed');
                });
              });
            });
          });
        });

  } catch (error) {
    console.error('Error running tests:', error);
  }
}

runTests();
```

Here's a detailed `README.md` for the `amocrud` library, including usage instructions:

**`amocrud/package/README.md`**

```markdown
# amocrud

`amocrud` is a simple and lightweight CRUD (Create, Read, Update, Delete) library for SQLite in Node.js. It provides an easy-to-use API for performing basic database operations on SQLite databases.

## Features

- **Create**: Insert new records into a table.
- **Read**: Query records from a table.
- **Update**: Modify existing records.
- **Delete**: Remove records from a table.

## Installation

You can install `amocrud` via npm:

```bash
npm install amocrud
```

## Usage

Here is a step-by-step guide to using `amocrud` in your Node.js project:

1. **Require the Library**

   ```js
   const SQLiteCRUD = require('amocrud');
   ```

2. **Initialize the Library**

   Create an instance of `SQLiteCRUD` by specifying the path to the SQLite database file, the table name, and the schema definition.

   ```js
   const dbFilePath = 'path/to/your/database.db';
   const tableName = 'users';
   const schema = {
     id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
     name: 'TEXT NOT NULL',
     email: 'TEXT NOT NULL UNIQUE'
   };

   const db = new SQLiteCRUD(dbFilePath, tableName, schema);
   ```

3. **Create Records**

   Insert new records into the table.

   ```js
   const user = { name: 'John Doe', email: 'john.doe@example.com' };

   db.create(user, (err, result) => {
     if (err) {
       console.error('Error inserting data:', err);
     } else {
       console.log('Record created:', result);
     }
   });
   ```

4. **Read Records**

   Query records from the table based on a condition.

   ```js
   db.read({ name: 'John Doe' }, (err, rows) => {
     if (err) {
       console.error('Error reading data:', err);
     } else {
       console.log('Record(s) found:', rows);
     }
   });
   ```

5. **Update Records**

   Modify existing records based on a condition.

   ```js
   db.update({ name: 'John Doe' }, { email: 'john.doe@newdomain.com' }, (err, result) => {
     if (err) {
       console.error('Error updating data:', err);
     } else {
       console.log('Record updated:', result);
     }
   });
   ```

6. **Delete Records**

   Remove records based on a condition.

   ```js
   db.delete({ name: 'John Doe' }, (err, result) => {
     if (err) {
       console.error('Error deleting data:', err);
     } else {
       console.log('Record deleted:', result);
     }
   });
   ```

7. **Close the Database**

   When you're done, make sure to close the database connection.

   ```js
   db.close();
   ```

## API

### `SQLiteCRUD(dbFilePath, tableName, schemaDefinition)`

- **`dbFilePath`**: Path to the SQLite database file.
- **`tableName`**: Name of the table to operate on.
- **`schemaDefinition`**: An object defining the schema of the table.

### `create(data, callback)`

- **`data`**: An object containing the data to be inserted.
- **`callback`**: A function to be called after the operation completes. It receives an error (if any) and the result of the operation.

### `read(query, callback)`

- **`query`**: An object specifying the query conditions.
- **`callback`**: A function to be called after the operation completes. It receives an error (if any) and the rows returned from the query.

### `update(query, updateData, callback)`

- **`query`**: An object specifying the conditions for the rows to be updated.
- **`updateData`**: An object containing the data to update.
- **`callback`**: A function to be called after the operation completes. It receives an error (if any) and the result of the operation.

### `delete(query, callback)`

- **`query`**: An object specifying the conditions for the rows to be deleted.
- **`callback`**: A function to be called after the operation completes. It receives an error (if any) and the result of the operation.

### `close()`

- Closes the database connection.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contributing

If you would like to contribute to `amocrud`, please fork the repository and submit a pull request.

## Contact

For any questions or issues, please open an issue on [GitHub](https://github.com/kunalatmosoft/amocrud/issues).

```

Make sure to replace placeholders such as `path/to/your/database.db`, `yourusername`, and `kunalSingh <your.email@example.com>`