import { FixedSizeArray } from '../../utils';
import { GameFile } from '../../formats';
import { ActorType } from './ActorTypes';
import { NodonSettingMap } from './NodonSettings';

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

export enum NodonCategory {
  Unknown = 0,
  Input,
  Middle,
  MiddleLayout,
  Output,
  Object,
};

export enum NodonTag {

};

export class Nodon {
  get [Symbol.toStringTag]() { return this.label };

  type: ActorType = ActorType.Invalid;
  
  label: string = '';

  category: NodonCategory = NodonCategory.Unknown;

  tag: NodonTag[] = [];

  game: GameFile | null = null;

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
  isLocked: boolean = false
  // human-friendly nodon property accessors
  settings: NodonSettingMap<this>;
  // nodon properties -- these are used internally for storing individual nodon properties
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

  getSettingValues() {
    if (!this.settings)
      return {};
    return Object.fromEntries(
      Object.entries(this.settings)
      .map(([key, setting]) => [setting.label, (this as any)[key]])
    );
  }
}