import { createClient } from '@node-rpc/client';
import { jsonSerializer } from '@node-rpc/client/dist/serializers/jsonSerializer';
import { axiosXHR } from '@node-rpc/client/dist/xhr/axios';
import { IBankAPI } from './common';

const token = 'secret';

const api = createClient<IBankAPI>({
	endpoint: 'http://localhost:3000',
	serializer: jsonSerializer,
	xhr: axiosXHR,
	getAuth: () => token,
});

async function run() {
	// getting customer with id 1
	console.log('\n getting customer with id 1');
	console.log(await api.getCustomer(1).call({ cache: { time: 60000, saveResponse: false } }));

	// getting balance from customer with id 2
	console.log('\n balance from customer with id 2');
	console.log(await api.getBalance(2).call({ cache: { time: 60000, saveResponse: false } }));

	// making a deposit from customer with id 3
	console.log('\n deposit from customer with id 3');
	console.log(await api.addDeposit(3, 1000000).call({ cache: { time: 60000, saveResponse: false } }));

	// making a withdrawal from customer with id 4
	console.log('\n withdrawal from customer with id 4');
	console.log(await api.addWithdrawal(4, 1000000).call({ cache: { time: 60000, saveResponse: false } }));

	// get size of database
	console.log('\n database size');
	console.log(await api.getDatabaseSize().call({ cache: { time: 60000, saveResponse: false } }));
}

run();
