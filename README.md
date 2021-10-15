# Jogo do Bicho Blockchain

This project is a prototype of a brazillian gamble game called "Jogo do Bicho". The game mechanics are well explained in the wikipedia page [Jogo_do_Bicho](https://en.wikipedia.org/wiki/Jogo_do_bicho)

The rewards are not quoted in the wikipedia page, so I will put them here.\
Reward to animal gamble: 18x\
Reward to ten gamble: 60x\
Reward to hundred gamble: 600x


## Random Number Generation

The random number is generated using chainlink VRF contract. 

## Solidity

The related contract was created using Truffle development kit, and is in the smartcontracts folder.\
There are also contracts deployed in `Polygon Mumbai Testnet` and `Rinkeby Ethereum Testnet` with remix. And the reason the contracts are not in mainnets is that i have not enough money to sustain a gamble game by myself.

## Available Scripts Website
This project was bootstrapped with Create-React-App, so you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts SmartContracts
The contracts were created using Truffle, so you can run:

### `truffle compile`

Compile all the used contracts

### `truffle test`

Launches the test runner in the interactive watch mode.
