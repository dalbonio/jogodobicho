// App.tsx
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "./components/Layout";
import ConnectToWalletButton from "./components/ConnectToWalletButton";
import Header from "./components/Header"
import Game from "./components/Game"

export default function App() {
  return (
    <ChakraProvider>
      <Layout>
       <Header />
       <Game />
      </Layout>
    </ChakraProvider>
  )
}
