export class GameConnection {

  get [Symbol.toStringTag]() { return 'Nodon Connection' };

  public id = 0;
  public toNodeId = 0;
  public toSocket = 0;
  public fromNodeId = 0;
  public fromSocket = 0;

  constructor(id: number, toId: number, toSocket: number, fromId: number, fromSocket: number) {
    this.id = id;
    this.toNodeId = toId;
    this.toSocket = toSocket;
    this.fromNodeId = fromId;
    this.fromSocket = fromSocket;
  }

}