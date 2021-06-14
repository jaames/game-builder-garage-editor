export type Vec2 = [number, number];

export type Vec3 = [number, number, number];

export class GameNodon {

  get [Symbol.toStringTag]() { return 'Nodon' };

  public id: number = 0;
  public type: string = 'Invalid';

  public settings: number[] = [];
  public graphPosFront: Vec2 = [0, 0];
  public graphPosTop: Vec2 = [0, 0];
  public hasWorldTransform: boolean = false;
  public size: Vec3 = [0, 0, 0];
  public position: Vec3 = [0, 0, 0];
  public rotation: Vec3 = [0, 0, 0];
  public unknown: Vec3 = [0, 0, 0];

  constructor(id: number, type: string) {
    this.id = id;
    this.type = type;
  }

}