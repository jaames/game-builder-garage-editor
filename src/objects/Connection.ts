export class Connection {

  get [Symbol.toStringTag]() { return 'Nodon Connection' };

  id = 0;
  idA = 0;
  idB = 0;
  portA = 0;
  portB = 0;

  constructor(id: number, idA: number, portA: number, idB: number, portB: number) {
    this.id = id;
    this.idA = idA;
    this.idB = idB;
    this.portA = portA;
    this.portB = portB;
  }

}