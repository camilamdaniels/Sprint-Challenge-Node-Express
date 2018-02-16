const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');

const STATUS_USER_ERROR = 422;

const server = express();
server.use(bodyParser.json());

let current = {};
let currentValue = 0;
let yesterday = {};
let yesterdayValue = 0;

let compare;

const currentURL = 'https://api.coindesk.com/v1/bpi/currentprice.json';
fetch(currentURL).then(res => res.json()).then(json => current = json);
const currentDataShort = (info) => {
	newResult = {
		date: info.time.updated,
		value: `The current BPI value in USD is $${info.bpi.USD.rate_float}.`
	};
	currentValue = info.bpi.USD.rate_float;
	return newResult;
};


const yesterdayURL = 'https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday';
fetch(yesterdayURL).then(res => res.json()).then(json => yesterday = json);
const yesterdayDataShort = (info) => {
	const valueProperty = Object.getOwnPropertyNames(info.bpi)[0];

	newResult = {
		date: info.time.updated,
		value: `Yesterday's BPI value in USD is $${info.bpi[valueProperty]}.`
	};
	yesterdayValue = info.bpi[valueProperty];
	return newResult;
};

server.get('/compare/yesterday', (req, res) => {
	const data = yesterdayDataShort(yesterday);
	res.json(data);
});

server.get('/compare/current', (req, res) => {
	const data = currentDataShort(current);
	res.json(data);
});

server.get('/compare', (req, res) => {
	currentDataShort(current);
	yesterdayDataShort(yesterday);
	let difference = currentValue - yesterdayValue;
	compare = {
		value: `The change in BPI value between yesterday and today is $${difference}.`
	};
	res.json(compare);
});

module.exports = { server };