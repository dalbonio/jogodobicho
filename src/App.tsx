// App.tsx
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "./components/Layout";
import ConnectToWalletButton from "./components/ConnectToWalletButton";
import React, { useState, useEffect } from 'react';
import Header from "./components/Header"
import Game from "./components/Game"
import {chains, ChainsLayout} from "./chains/chains"

export default function App() {
  const [network, setNetwork] = useState(chains[1])

  function handleChainChanged(_chainId: any) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
    if(_chainId)
      setNetwork(chains[_chainId]);
    else
      setNetwork(chains[1]);
      alert("The selected network in metamask is not supported")
  }

  if(!window.ethereum){
    alert("metamask nao esta instalado");
  }
  else{
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.request({ method: 'eth_chainId' }).then( (_chainId : any) => {
      chains[_chainId] ? setNetwork(chains[_chainId]) : setNetwork(chains["0x1"])
      if(chains[_chainId]){
        if(chains[_chainId].supported)
          setNetwork(chains[_chainId])
        else
          setNetwork(chains["0x1"])
      }
      else{
        setNetwork(chains["0x1"])

        //really bad user feedback, but serves its purpose to a non deployable demonstrative app
        alert("network not supported")
      }
    });
  }

  return (
    <ChakraProvider>
      <Layout>
       <Header network={network}/>
       <Game network={network}/>
      </Layout>
    </ChakraProvider>
  )
}
