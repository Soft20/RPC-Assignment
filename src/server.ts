import { createServer, RPCFunctions } from '@node-rpc/server';
import { jsonDeserializer } from '@node-rpc/server/dist/deserializers/jsonDeserializer';
import { IncomingMessage, ServerResponse } from 'http';
import sqlite3, { Statement } from 'sqlite3';

const sql = sqlite3.verbose();
const db = new sql.Database(':memory:');
const names = ['Dora', 'Rasmus', 'Adam', 'Pernille', 'Stephan', 'Kurt'];

const initialize = async () => {
	return new Promise((res, rej) => {
		try {
			db.serialize(async () => {
				db.run('CREATE TABLE customers (name TEXT, balance Int)');
				var stmt: Statement = db.prepare('INSERT INTO customers VALUES (?, ?)');

				for (var i = 0; i < names.length; i++) {
					stmt.run(names[i], Math.round(Math.random() * (100000 - 5000) + 5000));
				}

				await finalize(stmt);
				await each('SELECT rowid AS id, name, balance FROM customers');

				res();
			});
		} catch (e) {
			rej(e);
		}
	});

	// db.close();
};

import express from 'express';
const app = express();

import { IBankAPI } from './common';

interface IContext {
	lang: string;
}

const bankAPI: RPCFunctions<IBankAPI, IContext> = {
	getCustomer: (id: number) => async () => {
		return await database(`SELECT * FROM customers WHERE rowid = ${id}`);
	},

	getBalance: (id: number) => async () => {
		try {
			return (await database(`SELECT balance FROM customers WHERE rowid = ${id}`)).balance;
		} catch (e) {
			return 'Error';
		}
	},

	addDeposit: (id: number, amount: number) => async () => {
		const result: number = await new Promise((resolve, reject) => {
			db.get(`UPDATE customers SET balance = balance + ${amount} WHERE rowid = ${id}`);

			db.get(`SELECT balance FROM customers WHERE rowid = ${id}`, (err, row) => {
				if (err) reject(err);
				else resolve(row.balance);
			});
		});

		return result;
	},

	addWithdrawal: (id: number, amount: number) => async () => {
		const result: number = await new Promise((resolve, reject) => {
			db.get(`UPDATE customers SET balance = balance - ${amount} WHERE rowid = ${id}`);

			db.get(`SELECT balance FROM customers WHERE rowid = ${id}`, (err, row) => {
				if (err) reject(err);
				else resolve(row.balance);
			});
		});

		return result;
	},

	getDatabaseSize: () => async () => {
		return await database('SELECT SUM("pgsize") AS size FROM "dbstat"');
	},
};

const rpcServer = createServer({
	api: bankAPI,
	deserializer: jsonDeserializer,
});

function database(sql): Promise<any> {
	return new Promise((resolve, reject) => {
		db.get(sql, (err, row) => {
			if (err) reject(err);
			else resolve(row);
		});
	});
}

function each(sql): Promise<any> {
	return new Promise((resolve, reject) => {
		db.each(sql, (err, row: any) => {
			if (err) reject(err);

			console.log(row.id + ': ' + row.name + ': ' + row.balance);
		});
		resolve();
	});
}

function finalize(stmt: Statement): Promise<any> {
	return new Promise((resolve, reject) => {
		stmt.finalize((err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}

const request = async (req: IncomingMessage, res: ServerResponse) => {
	try {
		// call the rpc function and pass the additional context
		const result = await rpcServer.handleAPIRequest(req, { lang: 'en' });

		// send the result back to the client
		res.write(JSON.stringify(result));
		res.end();
	} catch (e) {
		res.write('adam');
		res.end();
	}
};

app.post('/', request);

// starting server
app.listen(3000, async () => {
	console.log('Setting up Database...');
	await initialize(); // adding dummy data to sql database
	console.log('Server running at http://localhost:3000');
});
