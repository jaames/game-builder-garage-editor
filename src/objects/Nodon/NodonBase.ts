import { FixedSizeArray } from '../../utils';
import { GameFile } from '../../formats';
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

export class Nodon {
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