import { ActorType } from './ActorTypes';
import { Nodon, NodonVec3 } from './NodonBase';
import { NodonSettingType, nodonSetting } from './NodonSettings';

export enum NodonRigidColor {
  Auto = 0,
  Blue,
  Red,
  Green,
  Yellow,
  LightBlue,
  Pink,
  LimeGreen,
  Orange,
  Purple,
  Brown,
  White,
  Black
};

export enum NodonRigidShape {
  Cube = 0,
  Cylinder,
  Sphere
};

export enum NodonRigidMaterial {
  Normal = 0,
  Bouncy,
  Slippery,
  Floaty,
  ZeroGravity
};

export interface NodonWithTransform extends Nodon {
  hasTransform: boolean;
  worldSize: NodonVec3;
  worldPosition: NodonVec3;
  worldRotation: NodonVec3;
};

export interface NodonWithColor extends Nodon {
  hasColor: boolean;
  color: NodonRigidColor;
};

export interface NodonWithShape extends Nodon {
  hasShape: boolean;
  shape: NodonRigidShape;
};

export interface NodonWithMaterial extends Nodon {
  hasMaterial: boolean;
  material: NodonRigidMaterial;
};

export const PHYSICAL_NODON_TYPES = [
  ActorType.PlzHumanNode,
  ActorType.PlzCarNode,
  ActorType.PlzUfoNode,
  ActorType.PlzRigidNode,
  ActorType.PlzMoveRigidNode,
  ActorType.PlzRotateRigidNode,
  ActorType.PlzStretchRigidNode,
  ActorType.PlzScoreRigidNode,
  ActorType.PlzCommentRigidNode,
  ActorType.PlzFancyRigidNode,
  ActorType.PlzTextureNode,
];

export function isPhysicalNode(nodon: Nodon) {
  return PHYSICAL_NODON_TYPES.includes(nodon.type);
}

export function nodonHasTransform(nodon: Nodon): nodon is NodonWithTransform {
  return nodon.hasOwnProperty('hasTransform');
}

export function nodonHasColor(nodon: Nodon): nodon is NodonWithColor {
  return nodon.hasOwnProperty('hasColor');
}

export function nodonHasShape(nodon: Nodon): nodon is NodonWithShape {
  return nodon.hasOwnProperty('hasShape');
}

export function nodonHasMaterial(nodon: Nodon): nodon is NodonWithMaterial {
  return nodon.hasOwnProperty('hasMaterial');
}

export class PlzHumanNode extends Nodon implements NodonWithTransform, NodonWithColor {

  label = 'Person';
  hasColor = true;
  hasTransform =  true;

  constructor() {
    super(ActorType.PlzHumanNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonRigidColor
  })
  get color() { return this.props.u32[2] as NodonRigidColor }
  set color(value: NodonRigidColor) { this.props.u32[2] = value }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzCarNode extends Nodon implements NodonWithTransform, NodonWithColor {

  label = 'Car';
  hasColor = true;
  hasTransform =  true;

  constructor() {
    super(ActorType.PlzCarNode);
  }
  
  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonRigidColor
  })
  get color() { return this.props.u32[2] as NodonRigidColor }
  set color(value: NodonRigidColor) {  this.props.u32[2] = value }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzUfoNode extends Nodon implements NodonWithTransform, NodonWithColor {

  label = 'UFO';
  hasColor = true;
  hasTransform = true;

  constructor() {
    super(ActorType.PlzUfoNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonRigidColor
  })
  get color() {return this.props.u32[2] as NodonRigidColor }
  set color(value: NodonRigidColor) { this.props.u32[2] = value }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzRigidNode extends Nodon implements NodonWithTransform, NodonWithColor, NodonWithShape, NodonWithMaterial {

  label = 'Object';
  hasColor = true;
  hasShape = true;
  hasMaterial = true;
  hasTransform =  true;

  constructor() {
    super(ActorType.PlzRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Shape',
    enum: NodonRigidShape
  })
  get shape() { return this.props.i32[0] as NodonRigidShape }
  set shape(value: NodonRigidShape) { this.props.i32[0] = value }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonRigidColor
  })
  get color() { return this.props.u32[2] as NodonRigidColor }
  set color(value: NodonRigidColor) { this.props.u32[2] = value }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Material',
    enum: NodonRigidMaterial
  })
  get material() { return this.props.i32[1] as NodonRigidMaterial }
  set material(value: NodonRigidMaterial) { this.props.i32[1] = value }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzMoveRigidNode extends Nodon implements NodonWithTransform, NodonWithColor, NodonWithShape {

  label = 'Moving Object';
  hasColor = true;
  hasShape = true;
  hasTransform =  true;

  constructor() {
    super(ActorType.PlzMoveRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonRigidColor
  })
  get color() { 
    return this.props.u32[2] as NodonRigidColor;
  }
  set color(value: NodonRigidColor) {
    this.props.u32[2] = value;
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Shape',
    enum: NodonRigidShape
  })
  get shape() {
    return this.props.i32[1] as NodonRigidShape;
  }
  set shape(value: NodonRigidShape) {
    this.props.i32[1] = value;
  }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzRotateRigidNode extends Nodon implements NodonWithTransform, NodonWithColor, NodonWithShape {

  label = 'Rotating Object';
  hasColor = true;
  hasShape = true;
  hasTransform =  true;

  constructor() {
    super(ActorType.PlzRotateRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonRigidColor
  })
  get color() { return this.props.u32[2] as NodonRigidColor }
  set color(value: NodonRigidColor) { this.props.u32[2] = value }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Shape',
    enum: NodonRigidShape
  })
  get shape() { return this.props.i32[1] as NodonRigidShape }
  set shape(value: NodonRigidShape) { this.props.i32[1] = value }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzStretchRigidNode extends Nodon implements NodonWithTransform, NodonWithColor, NodonWithShape {

  label = 'Extending Object';
  hasShape = true;
  hasColor = true;
  hasTransform =  true;

  constructor() {
    super(ActorType.PlzStretchRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Shape',
    enum: NodonRigidShape
  })
  get shape() { 
    return this.props.i32[0] as NodonRigidShape;
  }
  set shape(value: NodonRigidShape) {
    this.props.i32[0] = value;
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonRigidColor
  })
  get color() { 
    return this.props.u32[2] as NodonRigidColor;
  }
  set color(value: NodonRigidColor) {
    this.props.u32[2] = value;
  }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzScoreRigidNode extends Nodon implements NodonWithTransform, NodonWithColor {

  label = 'Number Object';
  hasColor = true;
  hasTransform =  true;

  constructor() {
    super(ActorType.PlzScoreRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonRigidColor
  })
  get color() { return this.props.u32[2] as NodonRigidColor }
  set color(value: NodonRigidColor) { this.props.u32[2] = value }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzCommentRigidNode extends Nodon implements NodonWithTransform, NodonWithColor {

  label = 'Text';
  hasColor = true;
  hasTransform =  true;

  constructor() {
    super(ActorType.PlzCommentRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonRigidColor
  })
  get color() { return this.props.u32[2] as NodonRigidColor }
  set color(value: NodonRigidColor) { this.props.u32[2] = value }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzFancyRigidNode extends Nodon implements NodonWithTransform {

  label = 'Fancy Object';
  hasTransform =  true;

  constructor() {
    super(ActorType.PlzFancyRigidNode);
  }

  // TODO: map out object types
  // @nodonSetting({
  //   type: NodonSettingType.Enum,
  //   label: 'Object'
  //   enum: ...
  // })
  get objectType() { 
    return this.props.u32[2];
  }
  set objectType(value: number) {
    this.props.u32[2] = value;
  }

  @nodonSetting({
    type: NodonSettingType.Size,
    label: 'Size'
  })
  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  @nodonSetting({
    type: NodonSettingType.Rotation,
    label: 'Rotation'
  })
  get worldRotation() {
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]];
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class PlzTextureNode extends Nodon {

  label = 'Texture';

  constructor() {
    super(ActorType.PlzTextureNode);
  }
  get textureIdx() { return this.props.i32[0] }
  set textureIdx(value: number) { this.props.i32[0] = value }

  get textureFaceFlags() { return this.props.u32[0] }
  set textureFaceFlags(value: number) { this.props.u32[0] = value }

  get size() { return this.props.vec3[0] }
  set size(value: NodonVec3) { this.props.vec3[0] = value }

  get position() { return this.props.vec3[1] }
  set position(value: NodonVec3) { this.props.vec3[1] = value }
}