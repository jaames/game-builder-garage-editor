import { FixedSizeArray } from '../utils';
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

export function NodonFactory(type: ActorType) {
  if (type === ActorType.PlzTextureNode)
    return new PlzTextureNode();

  if (type === ActorType.ConstantNode)
    return new ConstantNode();

  if (type === ActorType.TimerNode)
    return new TimerNode();

  else
    return new Nodon(type);
}

export class Nodon {
  get [Symbol.toStringTag]() { return 'Nodon' };
  // actor type
  public type: ActorType = ActorType.Invalid;
  // unique id
  public id: number = 0;
  // canvas position - increments by 100 for every grid unit
  public canvasPos: [number, number, number] = [0, 0, 0]; // x, y, z
  // initial canvas size for every nodon (?) seems to be 2 grid units
  public canvasSize: [number, number, number] = [2, 2, 2]; // x, y, z
  // canvas scale multiplies nodon's canvas size
  public canvasScale: [number, number, number] = [0, 0, 0]; // x, y, z
  // rotation only happens in front view?
  public canvasRotate: number = 0;
  // canvas z-index
  public canvasSortIndex: number = 0;
  // can node be edited
  public isLocked: boolean = false;
  // nodon properties -- these are used differently for storing individual nodon properties
  public props: NodonProps = {
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
  }
}

// example for nodon type with properties mapped to human-readable attributes
// this would require manually researching every single possible nodon type...
export class PlzTextureNode extends Nodon {
  constructor() {
    super(ActorType.PlzTextureNode);
  }
  public get textureIdx() { return this.props.i32[0] }
  public set textureIdx(value: number) { this.props.i32[0] = value }

  public get textureFaceFlags() { return this.props.u32[0] }
  public set textureFaceFlags(value: number) { this.props.u32[0] = value }

  public get size() { return this.props.vec3[0] }
  public set size(value: NodonVec3) { this.props.vec3[0] = value }

  public get position() { return this.props.vec3[1] }
  public set position(value: NodonVec3) { this.props.vec3[1] = value }
}

export class ConstantNode extends Nodon {
  constructor() {
    super(ActorType.ConstantNode);
  }
  public get value() { return this.props.f32[0] }
  public set value(value: number) { this.props.f32[0] = value }
}

export class TimerNode extends Nodon {
  constructor() {
    super(ActorType.TimerNode);
  }
  public get outputAfter() { return this.props.f32[0] }
  public set outputAfter(value: number) { this.props.f32[0] = value }
  
  public get continueOutput() { return this.props.f32[1] } // TODO: double check this
  public set continueOutput(value: number) { this.props.f32[1] = value }
}