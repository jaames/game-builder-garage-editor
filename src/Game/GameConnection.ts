export class GameConnection {

  public id = 0;
  public toId = 0;
  public toSocket = 0;
  public fromId = 0;
  public fromSocket = 0;

  constructor(id: number, toId: number, toSocket: number, fromId: number, fromSocket: number) {
    this.id = id;
    this.toId = toId;
    this.toSocket = toSocket;
    this.fromId = fromId;
    this.fromSocket = fromSocket;
  }

}