// Layout.tsx
import { ReactNode } from "react";
import React, { useState } from 'react';
import { Button, Flex, Select, Text, Box, Input } from "@chakra-ui/react";
import ConnectToWalletButton from "./ConnectToWalletButton";
import { useEthers, useEtherBalance, useContractCall } from "@usedapp/core";
import "@fontsource/roboto";
import Web3 from 'web3';
import BN from 'bn.js'
import { AbiItem } from "web3-utils";
import {chains, ChainsLayout} from "../chains/chains"

const bichosDict = {
    "Avestruz" : 1,
    "Águia" : 2,
    "Burro" : 3,
    "Borboleta" : 4,
    "Cachorro" : 5,
    "Cabra" : 6,
    "Carneiro" : 7,
    "Camelo" : 8,
    "Cobra" : 9,
    "Coelho" : 10,
    "Cavalo" : 11,
    "Elefante" : 12,
    "Galo" : 13,
    "Gato" : 14,
    "Jacaré" : 15,
    "Leão" : 16,
    "Macaco" : 17,
    "Porco" : 18,
    "Pavão" : 19,
    "Peru" : 20,
    "Touro" : 21,
    "Tigre" : 22,
    "Urso" : 23,
    "Veado" : 24,
    "Vaca" : 25,
} as any;

declare global {
    interface Window {
        ethereum:any;
    }
}

type setBetValueFunction = (a: string) => void;

export default function BetCard(props: { 
                                    name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
                                    betValue: string | undefined; 
                                    betPlaceholder: string | undefined; 
                                    multiplier: string | undefined;
                                    betType: number | undefined;
                                    setBetValue: setBetValueFunction;
                                    network: ChainsLayout
                                }) {

    const [estimatedProfit, setEstimatedProfit] = useState(parseFloat("0").toFixed(6));
    const [moneyValue, setMoneyValue] = useState("0");

    const handleEstimatedProfit = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const value = e.target.value.toString();
        setMoneyValue(value);
        if( value === "" ){
            setEstimatedProfit(parseFloat("0").toFixed(6))
        }
        else{
            setEstimatedProfit(`${(parseFloat(value) * parseFloat(props.multiplier as string)).toFixed(6)}`)
        }
    }

    const handleBetValue = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const value = e.target.value.toString();
        props.setBetValue(value);
    }

    const handleMakeBetButton = () => {
        const value = bichosDict[`${props.betValue}`] ? bichosDict[`${props.betValue}`] : props.betValue;
        makeBet(moneyValue, value);
    }

    const makeBet = async (moneyValue: string, betValue: string) => {
        const abi = [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "participant",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amountBet",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amountWon",
                        "type": "uint256"
                    }
                ],
                "name": "BetResult",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "n1",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "n2",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "n3",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "n4",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "n5",
                        "type": "uint256"
                    }
                ],
                "name": "Numbers",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "Received",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "bet",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "randomSeed",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "winAmount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "randomResult",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "time",
                        "type": "uint256"
                    }
                ],
                "name": "Result",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "address",
                        "name": "admin",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "Withdraw",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_betType",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "bet",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "random",
                        "type": "uint256"
                    }
                ],
                "name": "changeResult",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "checkBalance",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getRandomNumber",
                "outputs": [
                    {
                        "internalType": "bytes32",
                        "name": "requestId",
                        "type": "bytes32"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "payBets",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "requestId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "randomness",
                        "type": "uint256"
                    }
                ],
                "name": "rawFulfillRandomness",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "stateMutability": "payable",
                "type": "receive"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "withdrawEther",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "name": "withdrawLink",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "admin",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "balance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "bets",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "userAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "betType",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "bet",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "betAmount",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "currentDayResult",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "maxValueByType",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "minValueByType",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "randomResult",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "rewardMultiplierPerType10factor",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "rewardTotalAmount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalPlayers",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ] as any;
        const contractAddress = props.network.address;
        if(!window.ethereum){
            alert("metamask nao esta instalado");
            return;
        }
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        const NameContract = new web3.eth.Contract(abi, contractAddress);
        try{
            NameContract.methods.bet(props.betType, betValue).send({from: address, value: Web3.utils.toWei(moneyValue, "ether")});
        }
        catch(err){
            console.log(err)
        }
    }
    let valueProperty = {} as any;

    if(props.betValue){
        valueProperty.value = props.betValue
    }

  return (
        <Flex
        flexDirection="column"
        alignItems="center">
        <Box
            marginTop="5vw"
            display="flex"
            flexDirection="column"
            border="1px solid transparent"
            borderColor="white"
            alignItems="center"
            borderRadius="xl"
            justifyContent="space-between"
            h="150px"
            w="300px">
            <Text color="white">{props.name}</Text>
            <Input color="white" placeholder={props.betPlaceholder} w="100px" onChange={handleBetValue} {...valueProperty} disabled={false}/>
            <Flex 
                w="90%"
                flexFlow="row wrap"
                justifyContent="space-between"
                alignItems="center">
                <Input color="white" placeholder={parseFloat("0").toFixed(6)} w="100px" onChange={handleEstimatedProfit}/>
                <Box
                    display="flex"
                    flexFlow="column nowrap"
                    alignItems="center">
                    <Text color="white">Ganhos Estimados:</Text>
                    <Text color="white">{estimatedProfit}</Text>
                </Box>
            </Flex>
        </Box>
        <Button marginTop="15px" w="300px" onClick={handleMakeBetButton}>Apostar</Button>
        </Flex>
  )
}
