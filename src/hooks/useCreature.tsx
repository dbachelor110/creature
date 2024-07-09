import { items } from "../lib/items";
import { useState } from "react";
export type Point = { x: number, y: number };
export type BezierVertex = Point & {
    firstPull?: undefined | Point;
    seccendPull?: undefined | Point;
}
export type Angle = { x: number, y: number, t: number };
export type Skin = { v1: number, v2: number, v3: number, v4: number };
export type CreatureItems = {
    head?: any,
    body?: any,
    accessorie?: any,
    leftHand?: any,
    rightHand?: any,
    leftLeg?: any,
    rightLeg?: any,
    leftEye?: any,
    rightEye?: any,
    mouth?: any,
    roots?: {
        [key: string]: {
            x: number;
            y: number;
        }
    };
    [key:string]:any;
};
export type CreatureState = {
    (): void;
    state: {
        Items: CreatureItems,
        location: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
        moving: false,
        speed: 1,
        addSpeed: 1,
        angle: { x: 0, y: 0, t: 0 },
        roots: { [key: string]: Point },
    };
    go(target: Point, angle: Angle): void;
    move(location: Point): void;
    updateSpeed(speed: number): void;
    stop(): void;
    setSkin(v1: number, v2: number, v3: number, v4: number): void;
}
export const addPointPair = (rootPoint: Point, addPoint: Point) => {
    return { x: rootPoint.x + addPoint.x, y: rootPoint.y + addPoint.y };
};
export const isSamePoint = (aPoint: Point, bPoint: Point) => {
    return aPoint.x == bPoint.x && aPoint.y == bPoint.y;
};

const getItemsBySkin = (skin: Skin) => {
    const Items: CreatureItems = {};
    if(skin.v1==1&&skin.v2==1){
        Items.head = [items.heads.dic];
        Items.body = [items.bodys.dic, items.bodys.dicDodo];
        Items.roots = items.bodys.dic.roots;
        Items.accessorie = [items.accessories.horn];
        Items.leftHand = [items.leftHands.dic];
        Items.rightHand = [items.rightHands.dic];
        Items.leftLeg = [items.leftLegs.dic];
        Items.rightLeg = [items.rightLegs.dic];
        Items.leftEye = [items.eyes.circle];
        Items.rightEye = [items.eyes.circle];
        Items.mouth = [items.mouths.dic];
    }else if(skin.v1==1&&skin.v2==2){
        Items.head = [items.heads.bird];
        Items.body = [items.bodys.bird];
        Items.mo1 = [items.accessories.mo1];
        Items.mo2 = [items.accessories.mo2];
        Items.mo3 = [items.accessories.mo3];
        Items.roots = items.bodys.bird.roots;
        // Items.accessorie = [items.accessories.horn];
        // Items.leftHand = [items.rightLegs.bird1,items.rightLegs.bird2,items.rightLegs.bird3];
        // Items.rightHand = [items.rightHands.dic];
        Items.leftLeg = [items.rightLegs.bird1,items.rightLegs.bird2,items.rightLegs.bird3];
        Items.rightLeg = [items.rightLegs.bird1,items.rightLegs.bird2,items.rightLegs.bird3];
        Items.leftEye = [items.eyes.circle];
        Items.rightEye = [items.eyes.circle];
        Items.mouth = [items.mouths.bird];
    }
    else if(skin.v1==2&&skin.v2==1){
        Items.head = [items.heads.drang];
        Items.body = [items.bodys.drang];
        Items.roots = items.bodys.drang.roots;
        // Items.accessorie = [items.accessories.horn];
        Items.leftHand = [items.rightHands.drang];
        Items.rightHand = [items.rightHands.drang];
        Items.leftLeg = [items.rightLegs.drang];
        Items.rightLeg = [items.rightLegs.drang];
        Items.leftEye = [items.eyes.dot];
        Items.rightEye = [items.eyes.dot];
        Items.mouth = [items.mouths.line];
        Items.tail = [items.tails.drang];
    }
    else if(skin.v1==2&&skin.v2==2){
        Items.head = [items.heads.cat];
        Items.body = [items.bodys.cat];
        Items.roots = items.bodys.cat.roots;
        // Items.accessorie = [items.accessories.horn];
        Items.leftHand = [items.rightHands.cat];
        Items.rightHand = [items.rightHands.cat];
        Items.leftLeg = [items.rightLegs.cat];
        Items.rightLeg = [items.rightLegs.cat];
        Items.leftEye = [items.eyes.circle];
        Items.rightEye = [items.eyes.circle];
        Items.mouth = [items.mouths.cat];
        Items.tail = [items.tails.cat];
        Items.rEar = [items.accessories.earR];
        Items.lEar = [items.accessories.earL];
    }
    else if(skin.v1==0&&skin.v2==0){
        Items.body = [items.bodys.egg];
        Items.roots = items.bodys.egg.roots;
        Items.leftLeg = [items.rightLegs.bird2];
        Items.rightLeg = [items.rightLegs.bird2];
        Items.mouth = [items.mouths.egg];
        Items.dot1 = [items.eyes.circle];
        Items.dot2 = [items.eyes.circle];
        Items.dot3 = [items.eyes.circle];

    }
    // if (skin.v1 > 1) {
    //     Items.head = [items.heads.dic];
    // } else {
    //     Items.body = [items.bodys.dic, items.bodys.dicDodo];
    //     Items.roots = items.bodys.dic.roots;
    // }

    // // accessorie
    // if (skin.v2 > 1) {
    //     Items.accessorie = [items.accessories.horn];
    // }

    // // Hand & Leg
    // if (skin.v3 > 1) {
    //     Items.leftHand = [items.leftHands.dic];
    //     Items.rightHand = [items.rightHands.dic];
    //     Items.leftLeg = [items.leftLegs.dic];
    //     Items.rightLeg = [items.rightLegs.dic];
    // }

    // // Eye & Mouth
    // if (skin.v4 > 1) {
    //     Items.leftEye = [items.eyes.circle];
    //     Items.rightEye = [items.eyes.circle];
    //     Items.mouth = [items.mouths.dic];
    // }
    return Items;
}
export const useCreature = (skin: Skin) => {
    const [Items, _setItems] = useState(getItemsBySkin(skin));
    const [location, _setLocation] = useState({ x: 0, y: 0 });
    const [target, _setTarget] = useState({ x: 0, y: 0 });
    const [moving, _setMoving] = useState(false);
    const [speed, _setSpeed] = useState(1);
    const [addSpeed, _setAddSpeed] = useState(1);
    const [angle, _setAngle] = useState({ x: 0, y: 0, t: 0 });
    const [roots, _setRoots] = useState(Items.roots);

    const creatureState = {
        Skin:skin,
        Items: Items,
        location: location,
        target: target,
        moving: moving,
        speed: speed,
        addSpeed: addSpeed,
        angle: angle,
        roots: roots,
    }

    const creature = () => { };
    creature.state = creatureState;
    creature.go = (target: Point, angle: Angle) => {
        _setMoving(true);
        _setTarget(target);
        _setAngle(angle);
    };
    creature.move = (location: Point) => _setLocation(location);
    creature.updateSpeed = (speed: number) => _setSpeed(speed);
    creature.stop = () => {
        _setLocation(target);
        _setSpeed(1);
        _setMoving(false);
    };
    // creature.setSkin = (v1: number, v2: number, v3: number, v4: number) => {
    //     _setSkin({ v1: v1, v2: v2, v3: v3, v4: v4 });
    // }
    return [creature];
}