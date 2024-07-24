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
/* 
            // DELETE
            db.delete({ id: result.id }, (err, result) => {
              if (err) throw err;
              console.log('Record deleted:', result);

              // Verify deletion
              db.read({ id: result.id }, (err, rows) => {
                if (err) throw err;
                console.log('Record after deletion:', rows);
                 */

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
