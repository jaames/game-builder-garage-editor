import { FixedSizeArray } from '../utils';
import { GameActorType } from './GameActorTypes'; 

export type GameNodonI32Props = FixedSizeArray<number, 5>;

export type GameNodonU32Props = FixedSizeArray<number, 5>;

export type GameNodonF32Props = FixedSizeArray<number, 6>;

export type GameNodonVec3 = FixedSizeArray<number, 3>;

export type GameNodonVec3Props = [
  GameNodonVec3,
  GameNodonVec3,
  GameNodonVec3,
  GameNodonVec3
];

export type GameNodonU64Props = FixedSizeArray<bigint, 3>;

export interface GameNodonProps {
  i32: GameNodonI32Props,
  u32: GameNodonU32Props,
  f32: GameNodonF32Props,
  vec3: GameNodonVec3Props,
  u64: GameNodonU64Props
};

export class GameNodon {

  get [Symbol.toStringTag]() { return 'Nodon' };

  public id: number = 0;
  public type: GameActorType = GameActorType.Invalid;

  public canvasPos: [number, number, number] = [0, 0, 0]; // x, y, z
  public canvasScale: [number, number, number] = [0, 0, 0]; // x, y, z
  public canvasRotate: number = 0;
  public canvasSortIndex: number = 0;
  public isLocked: boolean = false;

  public props: GameNodonProps = {
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

}