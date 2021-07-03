import { ActorType } from './ActorTypes';
import { Nodon, NodonVec3, NodonCategory, NodonTag } from './NodonBase';
import { NodonSettingType, nodonSetting } from './NodonSettings';

export enum NodonColor {
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

export enum NodonShape {
  Cube = 0,
  Cylinder,
  Sphere
};

export enum NodonMaterial {
  Normal = 0,
  Bouncy,
  Slippery,
  Floaty,
  ZeroGravity
};

export enum NodonAxis {
  X = 0,
  Y = 1,
  Z = 2
};

export interface NodonWithTransform extends Nodon {
  hasTransform: boolean;
  worldSize: NodonVec3;
  worldPosition: NodonVec3;
  worldRotation: NodonVec3;
};

export interface NodonWithColor extends Nodon {
  hasColor: boolean;
  color: NodonColor;
};

export interface NodonWithShape extends Nodon {
  hasShape: boolean;
  shape: NodonShape;
};

export interface NodonWithMaterial extends Nodon {
  hasMaterial: boolean;
  material: NodonMaterial;
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

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzHumanNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonColor
  })
  get color() { return this.props.i32[2] as NodonColor }
  set color(value: NodonColor) { this.props.i32[2] = value }

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

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzCarNode);
  }
  
  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonColor
  })
  get color() { return this.props.i32[2] as NodonColor }
  set color(value: NodonColor) {  this.props.i32[2] = value }

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

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzUfoNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonColor
  })
  get color() {return this.props.i32[2] as NodonColor }
  set color(value: NodonColor) { this.props.i32[2] = value }

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

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Shape',
    enum: NodonShape
  })
  get shape() { return this.props.i32[0] as NodonShape }
  set shape(value: NodonShape) { this.props.i32[0] = value }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonColor
  })
  get color() { return this.props.u32[2] as NodonColor }
  set color(value: NodonColor) { this.props.u32[2] = value }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Material',
    enum: NodonMaterial
  })
  get material() { return this.props.i32[1] as NodonMaterial }
  set material(value: NodonMaterial) { this.props.i32[1] = value }

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

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzMoveRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonColor
  })
  get color() { 
    return this.props.u32[3] as NodonColor;
  }
  set color(value: NodonColor) {
    this.props.u32[3] = value;
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Shape',
    enum: NodonShape
  })
  get shape() {
    return this.props.i32[1] as NodonShape;
  }
  set shape(value: NodonShape) {
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

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzRotateRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonColor
  })
  get color() { 
    return this.props.u32[3] as NodonColor;
  }
  set color(value: NodonColor) {
    this.props.u32[3] = value;
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Shape',
    enum: NodonShape
  })
  get shape() { return this.props.i32[1] as NodonShape }
  set shape(value: NodonShape) { this.props.i32[1] = value }

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

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzStretchRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Shape',
    enum: NodonShape
  })
  get shape() { 
    return this.props.i32[0] as NodonShape;
  }
  set shape(value: NodonShape) {
    this.props.i32[0] = value;
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonColor
  })
  get color() { 
    return this.props.u32[1] as NodonColor;
  }
  set color(value: NodonColor) {
    this.props.u32[1] = value;
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

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzScoreRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonColor
  })
  get color() { return this.props.u32[1] as NodonColor }
  set color(value: NodonColor) { this.props.u32[1] = value }

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

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzCommentRigidNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Color',
    enum: NodonColor
  })
  get color() { return this.props.u32[1] as NodonColor }
  set color(value: NodonColor) { this.props.u32[1] = value }

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

  category = NodonCategory.Object;

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

  category = NodonCategory.Object;

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

export class PlzIntegratedEffectNode extends Nodon {

  label = 'Effect';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzIntegratedEffectNode);
  }

  // TODO: settings (u32[0] seems to be effect type?)
}

export class PlzTouchSensorNode extends Nodon {

  label = 'Touch Sensor';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzTouchSensorNode);
  }

  // TODO: settings
}

export class PlzJointSingleAxisSliderNode extends Nodon {

  label = 'Slide Connector';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzJointSingleAxisSliderNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Axis',
    enum: NodonAxis
  })
  get axis() { 
    return this.props.u32[0] as NodonAxis;
  }
  set axis(value: NodonAxis) {
    this.props.u32[0] = value;
  }

  @nodonSetting({
    label: 'Range',
    type: NodonSettingType.Range,
    min: -100,
    max: 100
  })
  get inputRange() {
    return [this.props.f32[0], this.props.f32[1]]
  }
  set inputRange(value: [number, number]) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
  }

  // is stored, but not presented in-game?
  // @nodonSetting({
  //   type: NodonSettingType.Size,
  //   label: 'Size'
  // })
  // get worldSize() { return this.props.vec3[0] }
  // set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }
}

export class PlzBreakSensorNode extends Nodon {

  label = 'Destroying Sensor';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzBreakSensorNode);
  }

  // TODO: settings
}

export class PlzJointSliderNode extends Nodon {

  label = 'Free Slide Connector';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzJointSliderNode);
  }

  // TODO: settings
}

export class PlzBrokenSensorNode extends Nodon {

  label = 'Destroyed Sensor';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzBrokenSensorNode);
  }

  // TODO: settings
}

export class PlzJointHingeNode extends Nodon {

  label = 'Hinge Connector';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzJointHingeNode);
  }

  @nodonSetting({
    type: NodonSettingType.Enum,
    label: 'Axis',
    enum: NodonAxis
  })
  get axis() { 
    return this.props.u32[0] as NodonAxis;
  }
  set axis(value: NodonAxis) {
    this.props.u32[0] = value;
  }

  @nodonSetting({
    label: 'Range',
    type: NodonSettingType.Range,
    min: -180,
    max: 180
  })
  get inputRange() {
    return [this.props.f32[0], this.props.f32[1]]
  }
  set inputRange(value: [number, number]) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
  }

  // is stored, but not presented in-game?
  // @nodonSetting({
  //   type: NodonSettingType.Size,
  //   label: 'Size'
  // })
  // get worldSize() { return this.props.vec3[0] }
  // set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  @nodonSetting({
    type: NodonSettingType.Position,
    label: 'Position'
  })
  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }
}

export class PlzGrabSensorNode extends Nodon {

  label = 'Grabbed Sensor';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzGrabSensorNode);
  }

  // TODO: settings
}

export class PlzRopeNode extends Nodon {

  label = 'Rope Connector';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzRopeNode);
  }

  @nodonSetting({
    type: NodonSettingType.Number,
    label: 'String Stiffness',
    min: 0,
    max: 1,
  })
  get stiffness() { 
    return this.props.f32[0];
  }
  set stiffness(value) {
    this.props.f32[0] = value;
  }

  @nodonSetting({
    type: NodonSettingType.Number,
    label: 'String Length',
    min: 0.1,
    max: 10,
  })
  get length() { 
    return this.props.f32[3];
  }
  set length(value) {
    this.props.f32[3] = value;
  }
  // TODO: more settings
}

export class PlzPositionSensorNode extends Nodon {

  label = 'Location Sensor';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzPositionSensorNode);
  }

  // TODO: settings
}

export class PlzGeneratorFewNode extends Nodon {

  label = 'Launch Object (1)';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzGeneratorFewNode);
  }

  // TODO: settings
}

export class PlzGeneratorNode extends Nodon {

  label = 'Launch Object (10)';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzGeneratorNode);
  }

  // TODO: settings
}

export class PlzGeneratorManyNode extends Nodon {

  label = 'Launch Object (100)';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzGeneratorManyNode);
  }

  // TODO: settings
}

export class PlzSpeedSensorNode extends Nodon {

  label = 'Speed Sensor';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzSpeedSensorNode);
  }

  // TODO: settings
}

export class PlzBindCommanderNode extends Nodon {

  label = 'Destroy Object';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzBindCommanderNode);
  }

  // TODO: settings
}

export class PlzAccelerationSensorNode extends Nodon {

  label = 'Acceleration Sensor';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzAccelerationSensorNode);
  }

  // TODO: settings
}

export class PlzObjWarpEnterNode extends Nodon {

  label = 'Teleport Object Entrance';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzObjWarpEnterNode);
  }

  // TODO: settings
}

export class PlzObjWarpExitNode extends Nodon {

  label = 'Teleport Object Exit';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzObjWarpExitNode);
  }

  // TODO: settings
}

export class PlzAngleSensorNode extends Nodon {

  label = 'Angle Sensor';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzAngleSensorNode);
  }

  // TODO: settings
}

export class PlzRotationSensorNode extends Nodon {

  label = 'Rotation Speed Sensor';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzRotationSensorNode);
  }

  // TODO: settings
}

export class PlzPullForceNode extends Nodon {

  label = 'Attract Object';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzPullForceNode);
  }

  // TODO: settings
}

export class PlzEasyCamera extends Nodon {

  label = 'Game Screen';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzEasyCamera);
  }

  // TODO: settings
}

// TODO: investigate all of these, could be wrong
export enum PlzFieldConfigNodeShape {
  Plane = 0,
  Cube = 1,
  None = 5,
};

export class PlzFieldConfigNode extends Nodon {

  label = 'World';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzFieldConfigNode);
  }

  get shape() { return this.props.i32[0] as PlzFieldConfigNodeShape }
  set shape(value: PlzFieldConfigNodeShape) { this.props.i32[0] = value }

  get size() { return [this.props.u32[1], this.props.u32[2], this.props.u32[3]] }
  set size(value: NodonVec3) { 
    this.props.u32[1] - value[0];
    this.props.u32[2] - value[1];
    this.props.u32[3] - value[2];
  }

  // TODO: more settings
}

export class PlzTpsCamera extends Nodon {

  label = 'Camera';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzTpsCamera);
  }

  get fov() { return this.props.f32[0] }
  set fov(value: number) { this.props.f32[0] = value }

  get horizontalTrackRate() { return this.props.f32[1] }
  set horizontalTrackRate(value: number) { this.props.f32[1] = value }

  get verticalTrackRate() { return this.props.f32[2] }
  set verticalTrackRate(value: number) { this.props.f32[2] = value }

  get rotateX() { return this.props.f32[3] }
  set rotateX(value: number) { this.props.f32[3] = value }

  get rotateY() { return this.props.f32[4] }
  set rotateY(value: number) { this.props.f32[4] = value }

  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  get offsetDistance() { return this.props.vec3[2] }
  set offsetDistance(value: NodonVec3) { this.props.vec3[2] = value }

  // TODO: more settings

}

export class PlzHeadNode extends Nodon {

  label = 'Head';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzHeadNode);
  }

  // TODO: settings
}

export class PlzHandNode extends Nodon {

  label = 'Hand';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzHandNode);
  }

  // TODO: settings
}

export class PlzCameraPositionNode extends Nodon {

  label = 'Camera Position';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzCameraPositionNode);
  }

  // TODO: settings
}

export class PlzCameraLookAtNode extends Nodon {

  label = 'Camera Target';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzCameraLookAtNode);
  }

  // TODO: settings
}

export class PlzCameraDirectionNode extends Nodon {

  label = 'Camera Direction';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzCameraDirectionNode);
  }
}

export class PlzCameraViewAngleNode extends Nodon {

  label = 'Camera Field Of View';

  category = NodonCategory.Object;

  constructor() {
    super(ActorType.PlzCameraViewAngleNode);
  }

  @nodonSetting({
    type: NodonSettingType.Number,
    label: 'Field Of View',
    min: 10,
    max: 120,
  })
  get fov() { 
    return this.props.f32[0];
  }
  set fov(value) {
    this.props.f32[0] = value;
  }
}