# RPC Assignment
_System Integration, fall 2020_

_Adam Lass_  
_Pernille Lørup_  
_Rasmus Helsgaun_  
_Stephan Djurhuus_  

## Objectives

Banks collect data about their customers, services, and transactions. The data comes in various formats from different sources and platforms, such as mobile and web apps, ATP machines, shops, but after some processing, it is stored permanently in SQL databases.

Your task is to create
- [x] a server application that can open, read, and process banking data in text format and store it in a database,
- [x] a client application, which provides the source data in files and receives a report about the current size of the database.
- [x] The applications should illustrate the use of RPC.

You can choose
* the business case (what kind of data is collected)
* the format of the collected data: txt, csv, html, xml, or json
* the type of the SQL database

You can work in groups.
The solution of this task brings five credits to each active participant.

## Installation
_bash_
```bash
yarn install
```

## Execution

#### Server
_bash_
```bash
yarn server
```

#### Client
_bash_
```bash
yarn client
```

## About
This Project uses a RPC connection with an `IBankAPI` interface. The interface is shared between the server and client, which makes it possible to call server functions from the client.

This interface is found @ [src/common.ts](src/common.ts)

_typescript_
```javascript
interface IBankAPI {
	getCustomer: (id: number) => string;
	getBalance: (id: number) => number;
	addDeposit: (id: number, amount: number) => number;
	addWithdrawal: (id: number, amount: number) => number;
}
```