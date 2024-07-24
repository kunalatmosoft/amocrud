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
