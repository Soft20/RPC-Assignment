import sqlite3 from 'sqlite3';
const sql = sqlite3.verbose();
const db = new sql.Database(':memory:');

const names = ['Dora', 'Rasmus', 'Adam', 'Pernille', 'Stephan', 'Kurt'];

const initialize = async () => {
	db.serialize(async () => {
		db.run('CREATE TABLE customers (name TEXT, balance Int)');

		var stmt = db.prepare('INSERT INTO customers VALUES (?, ?)');

		for (var i = 0; i < names.length; i++) {
			stmt.run(names[i], Math.round(Math.random() * (100000 - 5000) + 5000));
		}

		stmt.finalize();

		db.each('SELECT rowid AS id, name, balance FROM customers', (err, row) => {
			console.log(row.id + ': ' + row.name + ': ' + row.balance);
		});

		// getCustomer(1);
		// getBalance(1);
		// addDeposit(1, 100000);
		// addWithdrawal(1, 100000);
	});

	db.close();
};

// export default initialize;
initialize();

function getCustomer(id: number) {
	db.get(`SELECT * FROM customers WHERE rowid = ${id}`, (err, row) => {
		console.log(row);
	});
}
function getBalance(id: number) {
	db.get(`SELECT balance FROM customers WHERE rowid = ${id}`, (err, row) => {
		console.log(row);
	});
}

function addDeposit(id: number, amount: number) {
	db.get(`UPDATE customers SET balance = balance + ${amount} WHERE rowid = ${id}`);
	getCustomer(id);
}

function addWithdrawal(id: number, amount: number) {
	db.get(`UPDATE customers SET balance = balance - ${amount} WHERE rowid = ${id}`);
	getCustomer(id);
}
