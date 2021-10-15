# Jogo do Bicho blockchain

This project is a prototype of a brazillian gamble game called "Jogo do Bicho". The game mechanics are well explained in the wikipedia page [Jogo_do_Bicho](https://en.wikipedia.org/wiki/Jogo_do_bicho)

The rewards are not quoted in the wikipedia page, so I will put them here.
Reward to animal gamble: 18x
Reward to ten gamble: 60x
Reward to hundred gamble: 600x


## Random Number Generation

The random number is generated using chainlink VRF contract. 

## Solidity

The related contract is in the smartcontracts folder with some tests, and also deployed in polygon mubai testnet and rinkeby ethereum testnet with remix. The reason the contracts are not in mainnets is that i have not enough money to sustain a gamble game by myself.

## Available Scripts

This project was bootstrapped with Create-React-App, so you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
