import { FixedSizeArray } from '../utils';
import { GameFile } from '../formats';
import { ActorType } from './ActorTypes';

export type NodonI32Props = FixedSizeArray<number, 5>;

export type NodonU32Props = FixedSizeArray<number, 5>;

export type NodonF32Props = FixedSizeArray<number, 6>;

export type NodonVec3 = FixedSizeArray<number, 3>;

export type NodonVec3Props = [NodonVec3, NodonVec3, NodonVec3, NodonVec3];

export type NodonU64Props = FixedSizeArray<bigint, 3>;

export interface NodonProps {
  i32: NodonI32Props,
  u32: NodonU32Props,
  f32: NodonF32Props,
  vec3: NodonVec3Props,
  u64: NodonU64Props
};

export enum NodonColor {
  Auto = 0,
  Blue,
  Red,
  Green,
  Yellow,
  LightBlue,
  Pink,
  LimeGreen,
  Orange,
  Purple,
  Brown,
  White,
  Black
};

export function NodonFactory(type: ActorType) {
  switch (type) {
    case ActorType.PlzTpsCamera:
      return new PlzTpsCamera();
    case ActorType.PlzFieldConfigNode:
      return new PlzFieldConfigNode();
    case ActorType.PlzTextureNode:
      return new PlzTextureNode();
    case ActorType.PlzRigidNode:
      return new PlzRigidNode();
    case ActorType.ConstantNode:
      return new ConstantNode();
    case ActorType.TimerNode:
      return new TimerNode();
    default:
      return new NodonBase(type);
  }
}

export class NodonBase {
  // return label when cast to string constant
  get [Symbol.toStringTag]() { return this.label };
  // actor type
  type: ActorType = ActorType.Invalid;
  // label
  label: string = '';
  // parent game
  game: GameFile | null = null;
  // unique id
  id: number = 0;
  // canvas position - increments by 100 for every grid unit
  // range is -96000 to 96000
  canvasPos: [number, number, number] = [0, 0, 0]; // x, y, z
  // initial canvas size for every nodon (?) seems to be 2 grid units
  canvasSize: [number, number, number] = [2, 2, 2]; // x, y, z
  // canvas scale multiplies nodon's canvas size
  canvasScale: [number, number, number] = [0, 0, 0]; // x, y, z
  // canvas rotation, in radians, anticlockwise
  canvasRotate: number = 0;
  // canvas z-index
  canvasSortIndex: number = 0;
  // can node be edited
  isLocked: boolean = false;
  // nodon properties -- these are used differently for storing individual nodon properties
  props: NodonProps = {
    i32: [0, 0, 0, 0, 0],
    u32: [0, 0, 0, 0, 0],
    f32: [0, 0, 0, 0, 0, 0],
    vec3: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    u64: [BigInt(0), BigInt(0), BigInt(0)],
  };

  constructor(type: ActorType = ActorType.Invalid) {
    this.type = type;
    if (!this.label) this.label = type;
  }

  get colorIdx() { return this.props.u32[2] as NodonColor }
  set colorIdx(value: NodonColor) { this.props.u32[2] = value }
  get colorName() { return NodonColor[this.colorIdx]; }

  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }

  getConnections() {
    return this.game.getConnectionsForNodon(this);
  }

  getConnectedNodons() {
    return this.getConnections().map(connection => {
      const nodonA = this.game.getNodonWithId(connection.idA);
      if (nodonA !== this)
        return nodonA;
      const nodonB = this.game.getNodonWithId(connection.idB);
      if (nodonB !== this)
        return nodonB;
    });
  }

  getConnectedNodonsWithActorType(actorType: ActorType) {
    return this.getConnectedNodons().filter(nodon => nodon.type === actorType);
  }
}

// Generic node for all physical object node types
export class PlzNodeBase extends NodonBase {

}


// example for nodon type with properties mapped to human-readable attributes
// this would require manually researching every single possible nodon type...
export class PlzTextureNode extends NodonBase {
  constructor() {
    super(ActorType.PlzTextureNode);
  }
  get textureIdx() { return this.props.i32[0] }
  set textureIdx(value: number) { this.props.i32[0] = value }

  get textureFaceFlags() { return this.props.u32[0] }
  set textureFaceFlags(value: number) { this.props.u32[0] = value }

  get size() { return this.props.vec3[0] }
  set size(value: NodonVec3) { this.props.vec3[0] = value }

  get position() { return this.props.vec3[1] }
  set position(value: NodonVec3) { this.props.vec3[1] = value }

  getTexture() {
    return this.game.textures[this.textureIdx];
  }
}

// TODO: investigate all of these, could be wrong
export enum PlzFieldConfigNodeShape {
  Plane = 0,
  Cube = 1,
  None = 5,
};

export class PlzFieldConfigNode extends NodonBase {
  constructor() {
    super(ActorType.PlzFieldConfigNode);
  }

  get shape() { return this.props.i32[0] as PlzFieldConfigNodeShape }
  set shape(value: PlzFieldConfigNodeShape) { this.props.i32[0] = value }
  get shapeName() { return PlzFieldConfigNodeShape[this.shape] }

  get size() { return [this.props.u32[1], this.props.u32[2], this.props.u32[3]] }
  set size(value: NodonVec3) { 
    this.props.u32[1] - value[0];
    this.props.u32[2] - value[1];
    this.props.u32[3] - value[2];
  }
}

export class PlzTpsCamera extends NodonBase {
  constructor() {
    super(ActorType.PlzTpsCamera);
  }

  get fov() { return this.props.f32[0] }
  set fov(value: number) { this.props.f32[0] = value }

  get horizontalTrackRate() { return this.props.f32[1] }
  set horizontalTrackRate(value: number) { this.props.f32[1] = value }

  get verticalTrackRate() { return this.props.f32[2] }
  set verticalTrackRate(value: number) { this.props.f32[2] = value }

  get rotateX() { return this.props.f32[3] }
  set rotateX(value: number) { this.props.f32[3] = value }

  get rotateY() { return this.props.f32[4] }
  set rotateY(value: number) { this.props.f32[4] = value }

  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  get offsetDistance() { return this.props.vec3[2] }
  set offsetDistance(value: NodonVec3) { this.props.vec3[2] = value }

}

export enum PlzRigidNodeShape {
  Box = 0,
  Cylinder,
  Sphere
};

export class PlzRigidNode extends PlzNodeBase  {
  constructor() {
    super(ActorType.PlzRigidNode);
  }

  get shape() { return this.props.i32[0] as PlzRigidNodeShape }
  set shape(value: PlzRigidNodeShape) { this.props.i32[0] = value }
  get shapeName() { return PlzRigidNodeShape[this.shape] }
}

export class ConstantNode extends NodonBase {
  constructor() {
    super(ActorType.ConstantNode);
  }

  get value() { return this.props.f32[0] }
  set value(value: number) { this.props.f32[0] = value }
}

export class TimerNode extends NodonBase {
  constructor() {
    super(ActorType.TimerNode);
  }

  get outputAfter() { return this.props.f32[0] }
  set outputAfter(value: number) { this.props.f32[0] = value }

  get continueOutput() { return this.props.f32[1] } // TODO: double check this
  set continueOutput(value: number) { this.props.f32[1] = value }
}