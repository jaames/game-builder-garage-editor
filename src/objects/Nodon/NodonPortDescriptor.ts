export enum NodonPortType {
  Upper,
  Lower,
};

export enum NodonPortDirection {
  In,
  Out,
};

export interface NodonValuePortDescriptor {
  portId: number;
  direction: NodonPortDirection;
  label: string;
  valueType?: any;
};

export interface NodonConnectionPortDescriptor {
  portId: number;
};

export type NodonPortDescriptor = 
  | NodonValuePortDescriptor
  | NodonConnectionPortDescriptor
;

export interface NodonPortMap {
  [NodonPortType.Upper]?: NodonConnectionPortDescriptor;
  [NodonPortType.Lower]?: NodonConnectionPortDescriptor;
  [name: string]: NodonPortDescriptor;
};