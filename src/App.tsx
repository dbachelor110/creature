import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import "./App.css";
import ConnectButton from "./components/ConnectButton";
// import Incubator from "./components/Incubator";
import From from "./components/Form";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { useSkin } from "./hooks/useSkin";
import { Sketch } from "./components/Sketch";
const App = () => {
  const [Tezos] = useState<TezosToolkit>(
    new TezosToolkit("https://ghostnet.ecadinfra.com")
  );
  const [wallet, setWallet] = useState<BeaconWallet | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
  const [skin, setSkin] = useSkin(Tezos);
  const [testSkin, _setTestSkin] = useState({v1:0,v2:0,v3:0,v4:0});
  const [incubating, setIncubating] = useState(false);
  const setTestSkin = (skin:string)=>_setTestSkin({v1:parseInt(skin[0]),v2:parseInt(skin[1]),v3:parseInt(skin[2]),v4:parseInt(skin[3])});

  const connectButton = <ConnectButton
    Tezos={Tezos}
    userAddress={userAddress}
    setUserAddress={setUserAddress}
    setWallet={setWallet}
    wallet={wallet}
  />;
  const sketchOrForm = ()=>{
    if (incubating){
      return userAddress ? <From setSkin={setSkin} setIncubating={setIncubating}/> : <From setSkin={setTestSkin} setIncubating={setIncubating}/>;
    }else{
      return userAddress ? <Sketch skin={skin}/> : <Sketch skin={testSkin}/>;
    }
    
  }
  // const incubator = <Incubator setSkin={setSkin} />;
  const app = <>
    <div className="Incubator">
    {connectButton}
    <button type="button" onClick={()=>setIncubating(true)}>{userAddress ?`   孵化  `:`體驗孵化`}</button>
    </div>
    {sketchOrForm()}
  </>;
  return app;
};

export default App;