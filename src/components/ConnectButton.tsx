import { Dispatch, SetStateAction } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
    NetworkType,
} from "@airgap/beacon-dapp";

type ButtonProps = {
    Tezos: TezosToolkit;
    userAddress: string | undefined;
    setUserAddress: Dispatch<SetStateAction<string | undefined>>;
    wallet: BeaconWallet | undefined;
};

const ConnectButton = ({
    userAddress,
    setUserAddress,
    wallet,
}: ButtonProps): JSX.Element => {
    const connectWallet = async (): Promise<void> => {
        try {
            await wallet!.requestPermissions({
                network: {
                    type: NetworkType.GHOSTNET,
                    rpcUrl: "https://ghostnet.ecadinfra.com",
                },
            });
            const newUserAddress = await wallet!.getPKH();
            setUserAddress(newUserAddress);
        } catch (error) {
            console.log(error);
        }
    };
    const disconnectWallet = async (): Promise<void> => {
        try {
            await wallet!.clearActiveAccount();
            setUserAddress(undefined);
        } catch (error) {
            console.log(error);
        }
    };

    const Connector = <div className="buttons">
        <button type="button" className="button" onClick={connectWallet}>
            <span>
                <i className="fas fa-wallet"></i>連接錢包
            </span>
        </button>
    </div>

    const UserAddressShower = <div className="buttons">
    <button type="button" className="button" onClick={disconnectWallet}>
            <span>
                <i className="fas fa-wallet"></i>{`登出 ${userAddress?.slice(0,2)}...${userAddress?.slice(-4)}`}
            </span>
        </button>
    </div>

    return userAddress?UserAddressShower:Connector;
};

export default ConnectButton;