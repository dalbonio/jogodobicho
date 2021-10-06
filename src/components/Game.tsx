// Layout.tsx
import { ReactNode } from "react";
import React, { useState } from 'react';
import { Button, Flex, Select, Text, Box, Input } from "@chakra-ui/react";
import ConnectToWalletButton from "./ConnectToWalletButton";
import BetCard from "./BetCard";
import "@fontsource/roboto";

export default function Game() {

    const [estimatedProfit, setEstimatedProfit] = useState(parseFloat("0").toFixed(6));

    const handleEstimatedProfit = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const value = e.target.value.toString();
        if( value === "" ){
            setEstimatedProfit(parseFloat("0").toFixed(6))
        }
        else{
            setEstimatedProfit(`${(parseFloat(value) * 60).toFixed(6)}`)
        }
    }


  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      w="50%"
      marginTop="5%"
      bg="gray.800"
    >
        <Flex
            w="50%"
            flexDirection="row"
            justifyContent="space-between">
            <Text 
                color="white"
                border="1px solid transparent"
                borderColor="white"
                _hover={{
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "blue.400",
                    backgroundColor: "gray.700",
                }}
                borderRadius="xl"
                m="1px"
                px={3}
            >Bicho</Text>
            <Text 
                color="white"
                border="1px solid transparent"
                borderColor="white"
                _hover={{
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "blue.400",
                    backgroundColor: "gray.700",
                }}
                borderRadius="xl"
                m="1px"
                px={3}
            >Dezena</Text>
            <Text 
                color="white"
                border="1px solid transparent"
                borderColor="white"
                _hover={{
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "blue.400",
                    backgroundColor: "gray.700",
                }}
                borderRadius="xl"
                m="1px"
                px={3}
            >Centena</Text>
        </Flex>
        <BetCard name="Dezena"/>
    </Flex>
  )
}