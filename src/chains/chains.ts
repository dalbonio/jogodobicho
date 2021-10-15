export interface ChainsLayout {
    name: string;
    currency: string;
    supported: boolean;
    address: string;
  }

export const chains : Dictionary<ChainsLayout> = {
        "0x1": {
            name: "Ethereum Mainnet",
            currency: "ETH",
            supported: false,
            address: ""
        },
        "0x4": {
            name: "Rinkeby Test Network",
            currency: "RIN",
            supported: true,
            address: "0x2a832012C97c33A9fbc3bFaB526e550c25994704",
        },
        "0x13881": {
            name: "Matic(Polygon) Testnet",
            currency: "tMATIC",
            supported: true,
            address: "0x649AE8aBA65DcA5652e9ae26FeF4991CDEA2a221",
        },
}