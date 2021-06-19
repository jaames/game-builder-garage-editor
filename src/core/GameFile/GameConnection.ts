export class GameConnection {

  get [Symbol.toStringTag]() { return 'Nodon Connection' };

  public id = 0;
  public idA = 0;
  public idB = 0;
  public socketA = 0;
  public socketB = 0;

  constructor(id: number, idA: number, socketA: number, idB: number, socketB: number) {
    this.id = id;
    this.idA = idA;
    this.idB = idB;
    this.socketA = socketA;
    this.socketB = socketB;
  }

}