import {
  P5CanvasInstance,
  ReactP5Wrapper,
  SketchProps
} from "@p5-wrapper/react";
import { useCreature, isSamePoint, addPointPair, CreatureState, BezierVertex, Angle, Skin } from "../hooks/useCreature";
type Point = { x: number, y: number, [key: string]: number };
type Angeles = {
  leftHand:number[],
  rightHand:number[],
  leftLeg:number[],
  rightLeg:number[],
  [key:string]:number[],
};

type MySketchProps = SketchProps & {
  creatureState: CreatureState;
};

type SketchComponentProps = {
  skin:Skin;
}

const getAnimationStateCounter = (steps: number) => {
  const MAX = steps * 10;
  let animationState = 0;
  const getState = () => {
    const STATE = Math.floor(animationState / 10);
    return STATE;
  };
  const addState = () => {
    animationState == MAX ? animationState = 0 : animationState += 1;
  }
  return { get: getState, add: addState };
}

function sketch(p5: P5CanvasInstance<MySketchProps>) {
  let creatureState: CreatureState;
  let right = true;
  const creature = () => { };
  const AnimationState = getAnimationStateCounter(4);
  const UpAndDownItemKeys = new Set([`body`, `leftEye`, `rightEye`, `mouth`,`head`,`tail`]);
  const Rotates:Angeles = {leftHand:[0,1/32,1/16,1/32],rightHand:[0,-1/32,-1/16,-1/32],leftLeg:[0,1/10,0,1/10],rightLeg:[0,-1/10,0,-1/10],tail:[0,-1/32,-1/16,-1/32]}

  const dist = (fromPoint: Point, toPoint: Point) => {
    return p5.dist(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y);
  };
  const getTan = (fromPoint: Point, toPoint: Point): Angle => {
    const t = dist(fromPoint, toPoint);
    return { x: toPoint.x - fromPoint.x, y: toPoint.y - fromPoint.y, t: t };
  };
  const showBezier = (points: BezierVertex[]) => {
    p5.beginShape();
    points.forEach((point) => {
      if (point.firstPull && point.seccendPull) {
        p5.bezierVertex(
          (right ? point.firstPull.x : -point.firstPull.x),
          point.firstPull.y,
          (right ? point.seccendPull.x : -point.seccendPull.x),
          point.seccendPull.y,
          (right ? point.x : -point.x),
          point.y
        );
      } else {
        p5.vertex((right ? point.x : -point.x), point.y);
      }
    });
    p5.endShape();
  };
  const showCircle = (points: Point[], root: Point) => {
    for (let point of points) {
      const drowPoint = addPointPair(root, point);
      p5.circle(drowPoint.x, drowPoint.y, point.r);
    }
  }
  const getNewLocationBySpeed = () => {
    const newLocation = {
      x: creatureState.state.location.x + p5.map(creatureState.state.speed, 0, creatureState.state.angle.t, 0, creatureState.state.angle.x),
      y: creatureState.state.location.y + p5.map(creatureState.state.speed, 0, creatureState.state.angle.t, 0, creatureState.state.angle.y)
    };
    return newLocation;
  }

  
  creature.go = () => {
    const target = { x: p5.mouseX, y: p5.mouseY };
    right = (target.x < creatureState.state.location.x);
    const angle = getTan(creatureState.state.location, target);
    creatureState.go(target, angle);
  };

  creature.move = () => {
    const tempState = { ...creatureState.state };
    // Check if movement is enabled and the current position is not the target position
    if (!tempState.moving || isSamePoint(tempState.location, tempState.target)) return;

    // Calculate distances
    const distanceToTarget = dist(creatureState.state.location, creatureState.state.target);

    // Adjust speed based on distance traveled
    if (distanceToTarget < 20) {
      tempState.speed--;
    } else if (tempState.addSpeed * 10 > tempState.speed) {
      tempState.speed += tempState.addSpeed;
    }
    creatureState.updateSpeed(tempState.speed);

    // Apply the calculated speed
    const newLocation = getNewLocationBySpeed();
    creatureState.move(newLocation);

    // Check if the target is reached
    if (p5.abs(distanceToTarget) < 10) {
      creatureState.stop()
    }
  };
  creature.show = () => {
    // console.info(creatureState.state.Items);
    for (let key of Object.keys(creatureState.state.roots)) {
      if (key in creatureState.state.Items) {
        const itemsArray = creatureState.state.Items[key];
        if (!itemsArray) return;
        // temp location
        const location = { ...creatureState.state.location };
        UpAndDownItemKeys.has(key) ? location.y += AnimationState.get() : {};
        for (let item of itemsArray) {
          const root = {
            x: right ? creatureState.state.roots[key].x : -creatureState.state.roots[key].x,
            y: creatureState.state.roots[key].y
          };
          const drawPoint = addPointPair(location, root);
          if (item.type == 'bezier') {
            p5.push();
            // Translate to the origin of the shape
            p5.translate(drawPoint.x, drawPoint.y);
            // Rotate around the origin
            if(creatureState.state.moving){
              const angles = Rotates[key];
              angles?p5.rotate(p5.PI * angles[AnimationState.get()]):{};
            }
            showBezier(item.points);
            p5.pop();
          } else if (item.type == 'circle') {
            showCircle(item.points, drawPoint);
          }
        }
      }
    }
    creature.move();
  }

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth * 4 / 5, p5.windowHeight * 4 / 5);
  };

  p5.updateWithProps = (props:MySketchProps) => {
    if (props.creatureState) {
      if (creatureState == undefined){
        creatureState = props.creatureState;
        creatureState.move({ x: p5.width / 2, y: p5.height / 2 + 200 });
      }else{
        creatureState = props.creatureState;
      }
    }
  };

  p5.draw = () => {
    p5.background(100);
    creature.show();
    AnimationState.add();
  };

  p5.mousePressed = () => {
    creature.go();
  }
}

export function Sketch(props:SketchComponentProps) {
  const [creatureState] = useCreature(props.skin);
  console.info(props.skin);
  return <ReactP5Wrapper sketch={sketch} creatureState={creatureState} />;
}