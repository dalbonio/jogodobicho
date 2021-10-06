// Layout.tsx
import { ReactNode } from "react";
import { Flex, Text } from "@chakra-ui/react";
import ConnectToWalletButton from "./ConnectToWalletButton";
import "@fontsource/roboto";

export default function Header() {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      w="60%"
      marginTop="10px"
      justifyContent="space-between"
      bg="gray.800"
    >
          <Flex
            flexDirection="row"
            alignItems="center">
            <img alt="" src="doge.png" width="70px" height="70px"/>
            <Text marginLeft="15px" fontFamily="Roboto" color="white">JogoDoBicho </Text>
          </Flex>
          <ConnectToWalletButton />
    </Flex>
  )
}