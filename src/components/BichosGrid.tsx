// Layout.tsx
import { ReactNode } from "react";
import React, { useState } from 'react';
import { Button, Flex, Select, Text, Box, Input, Img } from "@chakra-ui/react";
import ConnectToWalletButton from "./ConnectToWalletButton";
import { useEthers, useEtherBalance, useContractCall } from "@usedapp/core";
import "@fontsource/roboto";
import Web3 from 'web3';
import BN from 'bn.js'
import { AbiItem } from "web3-utils";
import BetCard from "./BetCard";
import {ChainsLayout} from "../chains/chains"

interface BichosLayout {
    title: string;
    image: string;
    selected: boolean;
}

type setBetValueFunction = (a: string) => void;

declare global {
    type Dictionary<T> = { [key: string]: T };
 }

export default function BichosGrid(props: {betType: number | undefined;
                                            setBetValue: setBetValueFunction;
                                            betValue: string | undefined; 
                                            network: ChainsLayout;
                                        } ) {

    const withBorder = {
        borderWidth : "3px",
        borderStyle: "solid transparent",
        borderColor: "red",
        margin: "10px"
    }

    const withoutBorder = {
        borderWidth : "0px",
        borderStyle: "solid transparent",
        borderColor: "red",
        margin: "15px"
    }

    const bichosImages: Dictionary<BichosLayout> = {
            1 : {
                title : "Avestruz",
                image : '01_avestruz.jpg',
                selected: false,
            },
            2 : {
                title : "Águia",
                image : '02_aguia.jpg',
                selected: false,
            },
            3 : {
                title : "Burro",
                image : '03_burro.jpg',
                selected: false,
            },
            4 : {
                title : "Borboleta",
                image : '04_borboleta.jpg',
                selected: false,
            },
            5 : {
                title : "Cachorro",
                image : '05_tuanlol.jpg',
                selected: false,
            },
            6 : {
                title : "Cabra",
                image : '06_cabra.jpg',
                selected: false,
            },
            7 : {
                title : "Carneiro",
                image : '07_carneiro.jpg',
                selected: false,
            },
            8 : {
                title : "Camelo",
                image : '08_camelo.jpg',
                selected: false,
            },
            9 : {
                title : "Cobra",
                image : '09_cobra.jpg',
                selected: false,
            },
            10 : {
                title : "Coelho",
                image : '10_coelho.jpg',
                selected: false,
            },
            11 : {
                title : "Cavalo",
                image : '11_cavalo.jpg',
                selected: false,
            },
            12 : {
                title : "Elefante",
                image : '12_elefante.jpg',
                selected: false,
            },
            13 : {
                title : "Galo",
                image : '13_galo.jpg',
                selected: false,
            },
            14 : {
                title : "Gato",
                image : '14_gato.jpg',
                selected: false,
            },
            15 : {
                title : "Jacaré",
                image : '15_jacare.jpg',
                selected: false,
            },
            16 : {
                title : "Leão",
                image : '16_leao.jpg',
                selected: false,
            },
            17 : {
                title : "Macaco",
                image : '17_macaco.jpg',
                selected: false,
            },
            18 : {
                title : "Porco",
                image : '18_porco.jpg',
                selected: false,
            },
            19 : {
                title : "Pavão",
                image : '19_pavao.jpg',
                selected: false,
            },
            20 : {
                title : "Peru",
                image : '20_peru.jpg',
                selected: false,
            },
            21 : {
                title : "Touro",
                image : '21_touro.jpg',
                selected: false,
            },
            22 : {
                title : "Tigre",
                image : '22_tigre.jpg',
                selected: false,
            },
            23 : {
                title : "Urso",
                image : '23_urso.jpg',
                selected: false,
            },
            24 : {
                title : "Veado",
                image : '24_veado.jpg',
                selected: false,
            },
            25 : {
                title : "Vaca",
                image : '25_vaca.jpg',
                selected: false,
            },
        }

     const [bichos, setBichos] = useState(bichosImages);

     const handleBichosClick = (e: React.MouseEvent) => {
        const target = e.target as any;
        const id = target.id;
        let newBichos = Object.assign({}, bichos)

        console.log(newBichos)
        Object.keys(newBichos).map(icon => {
            if(icon === id){
                newBichos[icon].selected = true;
            }
            else{
                newBichos[icon].selected = false;
            }
        })
        setBichos(newBichos)
        props.setBetValue(newBichos[id].title)
    }

  return (
      <Flex alignItems="center">
        <Flex
        marginTop="2vw"
        flexFlow="row wrap"
        align-items="flex-start"
        justifyContent="center">
        {Object.keys(bichos).map(icon => (
            <div style={ bichos[icon].selected ? withBorder : withoutBorder } key={`icon ${icon}`}>
            <Img
                id={icon}
                src={bichos[icon].image} 
                w="130px"
                h="130px"
                onClick={handleBichosClick}
            />
            </div>
        ))}
        </Flex>
        <BetCard name="Bicho" betValue={props.betValue} betPlaceholder="Bicho" multiplier="18" betType={props.betType} setBetValue={props.setBetValue} network={props.network}/>
    </Flex>
  )
}