export interface IBankAPI {
	getCustomer: (id: number) => string;
	getBalance: (id: number) => number;
	addDeposit: (id: number, amount: number) => number;
	addWithdrawal: (id: number, amount: number) => number;
	getDatabaseSize: () => string;
}
