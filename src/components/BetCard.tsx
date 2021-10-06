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

declare global {
    interface Window {
        ethereum:any;
    }
}


export default function BetCard(props: { name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) {

    const [estimatedProfit, setEstimatedProfit] = useState(parseFloat("0").toFixed(6));
    const [moneyValue, setMoneyValue] = useState("0");
    const [betValue, setBetValue] = useState("0");

    const handleEstimatedProfit = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const value = e.target.value.toString();
        setMoneyValue(value);
        if( value === "" ){
            setEstimatedProfit(parseFloat("0").toFixed(6))
        }
        else{
            setEstimatedProfit(`${(parseFloat(value) * 60).toFixed(6)}`)
        }
    }

    const handleBetValue = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const value = e.target.value.toString();
        setBetValue(value);
    }

    const handleMakeBetButton = () => {

        makeBet(moneyValue, betValue);
    }

    const makeBet = async (moneyValue: string, betValue: string) => {
        const abi: AbiItem | AbiItem[] = [];
        const contractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
        if(!window.ethereum){
            alert("metamask nao esta instalado");
            return;
        }
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        const NameContract = new web3.eth.Contract(abi, contractAddress);
        NameContract.methods.makeBet(betValue).send({from: address, value: Web3.utils.toWei(moneyValue, "ether")});
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
            <Input color="white" placeholder="Dezena" w="100px" onChange={handleBetValue}/>
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