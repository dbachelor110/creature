import { useState, useEffect, useCallback } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { Skin } from "./useCreature";
type skinSettor = (skin: string) => Promise<void>;
type useSkinOutput = [Skin, skinSettor];

const env = "KT1C8eVAxajftvXLHTV6nQUz2Xmyh9HbV589";
// await (async()=>{
//     const response = await fetch("/env.json");
//     const file:{Creature:string} = await response.json();
//     console.log(file.Creature);
//     return file.Creature;
// })();

const useSkin = (
    Tezos: TezosToolkit
):useSkinOutput => {
    const [Creature] = useState<string>(env);
    const [skin, _setSkin] = useState<Skin>({v1:0,v2:0,v3:0,v4:0});

    const updateSkin = useCallback(async () => {
        try{
          const contract = await Tezos.contract.at(Creature);
          const skin_op:string = await contract.contractViews.get_skin().executeView({ viewCaller: Creature });
          console.info(skin_op);
          if(parseInt(skin_op[0]) >= 0){
            const newSkin = {v1:parseInt(skin_op[0]),v2:parseInt(skin_op[1]),v3:parseInt(skin_op[2]),v4:parseInt(skin_op[3])};
            console.info(newSkin);
            _setSkin(newSkin);
          }
        } catch (error) {
          console.log(error);
        }
    },[Creature, Tezos.contract]);

    const setSkin = useCallback(async (skin: string) => {
        try{
            const contract = await Tezos.wallet.at(Creature);
            const incubate_op = await contract.methodsObject.incubate(skin).send();
            await incubate_op.confirmation();
        }
        catch (error) {
          console.log(error);
        }
        finally {await updateSkin();}
    }, [Creature, Tezos.wallet, updateSkin]);

    useEffect(() => {
        updateSkin();
    }, [updateSkin]);

    return [skin, setSkin];
};

export { useSkin }