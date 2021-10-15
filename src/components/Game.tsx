// Layout.tsx
import { ReactNode } from "react";
import React, { useState } from 'react';
import { Button, Flex, Select, Text, Box, Input } from "@chakra-ui/react";
import ConnectToWalletButton from "./ConnectToWalletButton";
import BetCard from "./BetCard";
import BichosGrid from "./BichosGrid"
import {chains, ChainsLayout} from "../chains/chains"
import "@fontsource/roboto";


export default function Game(props: {network: ChainsLayout} ) {

    const [betComponents, setBetComponents] = useState([true, false, false]);
    const [betType, setBetType] = useState(1)
    const [betValue, setBetValue] = useState("")

    const handleMenuClick = (e: React.MouseEvent ) => {
        const target = e.target as any;
        const id = target.id;
        if( id === "btnBicho" ){
            setBetComponents([true, false, false])
            setBetType(1)
        }
        else if(id === "btnDezena" ){
            setBetComponents([false, true, false])
            setBetType(2)
        }
        else if(id === "btnCentena"){
            setBetComponents([false, false ,true])
            setBetType(3)
        }
    }


  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      w="60%"
      marginTop="5%"
      bg="gray.800"
    >
        <Flex
            w="50%"
            flexDirection="row"
            justifyContent="space-between">
            <Button 
                border="1px solid transparent"
                id="btnBicho"
                borderColor="white"
                _hover={{
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "blue.400",
                    backgroundColor: "gray.700",
                }}
                onClick={handleMenuClick}
                borderRadius="xl"
                m="1px"
                px={3}
            >Bicho</Button>
            <Button 
                border="1px solid transparent"
                borderColor="white"
                id="btnDezena"
                _hover={{
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "blue.400",
                    backgroundColor: "gray.700",
                }}
                borderRadius="xl"
                onClick={handleMenuClick}
                m="1px"
                px={3}
            >Dezena</Button>
            <Button 
                border="1px solid transparent"
                borderColor="white"
                id="btnCentena"
                _hover={{
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "blue.400",
                    backgroundColor: "gray.700",
                }}
                borderRadius="xl"
                onClick={handleMenuClick}
                m="1px"
                px={3}
            >Centena</Button>
        </Flex>
        <Box display={betComponents[0] ? "flex" : "none"}>
            <BichosGrid betType={betType} setBetValue={setBetValue} betValue={betValue} network={props.network} />
        </Box>
        <Box display={betComponents[1] ? "flex" : "none"}>
            <BetCard name="Dezena" betValue={""} betPlaceholder="01" multiplier="60" betType={betType} setBetValue={setBetValue} network={props.network}/>
        </Box>
        <Box display={betComponents[2] ? "flex" : "none"}>
            <BetCard name="Centena" betValue={""} betPlaceholder="001" multiplier="600" betType={betType} setBetValue={setBetValue} network={props.network}/>
        </Box>

    </Flex>
  )
}