import { Mixin } from 'ts-mixer';
import { ActorType } from './ActorTypes';
import { Nodon, NodonVec3 } from './NodonBase';

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

export function isPhysicalNode(nodon: Nodon) {
  return PHYSICAL_NODON_TYPES.includes(nodon.type);
}

export function nodonHasTransform(nodon: Nodon): nodon is NodonTransformMixin {
  return nodon.hasOwnProperty('hasTransform');
}

export function nodonHasColor(nodon: Nodon): nodon is NodonColorMixin {
  return nodon.hasOwnProperty('hasColor');
}

export function nodonHasShape(nodon: Nodon): nodon is NodonShapeMixin {
  return nodon.hasOwnProperty('hasShape');
}

export class NodonTransformMixin extends Nodon {
  hasTransform =  true;

  get worldSize() { return this.props.vec3[0] }
  set worldSize(value: NodonVec3) { this.props.vec3[0] = value }

  get worldPosition() { return this.props.vec3[1] }
  set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

  get worldRotation() { 
    return [this.props.f32[0], this.props.f32[1], this.props.f32[2]]
  }
  set worldRotation(value: NodonVec3) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
    this.props.f32[2] = value[2];
  }
}

export class NodonColorMixin extends Nodon {
  hasColor = true;

  get color() { 
    return this.props.u32[2] as NodonRigidColor;
  }
  set color(value: NodonRigidColor) {
    this.props.u32[2] = value;
  }
  get colorName() {
    return NodonRigidColor[this.color];
  }
}

export class NodonShapeMixin extends Nodon {
  hasShape = true;

  get shape() {
    return this.props.i32[0] as NodonRigidShape;
  }
  set shape(value: NodonRigidShape) {
    this.props.i32[0] = value;
  }
  get shapeName() {
    return NodonRigidShape[this.shape];
  }
}

export class PlzHumanNode extends Mixin(Nodon, NodonTransformMixin, NodonColorMixin) {

  label = 'Person';

  constructor() {
    super(ActorType.PlzHumanNode);
  }
}

export class PlzCarNode extends Mixin(Nodon, NodonTransformMixin, NodonColorMixin) {

  label = 'Car';

  constructor() {
    super(ActorType.PlzCarNode);
  }
}

export class PlzUfoNode extends Mixin(Nodon, NodonTransformMixin, NodonColorMixin) {

  label = 'UFO';

  constructor() {
    super(ActorType.PlzUfoNode);
  }
}

export class PlzRigidNode extends Mixin(Nodon, NodonTransformMixin, NodonColorMixin, NodonShapeMixin) {

  label = 'Object';

  constructor() {
    super(ActorType.PlzRigidNode);
  }
}

export class PlzMoveRigidNode extends Mixin(Nodon, NodonTransformMixin, NodonColorMixin) {

  label = 'Moving Object';

  constructor() {
    super(ActorType.PlzMoveRigidNode);
  }

  hasShape = true;

  get shape() {
    return this.props.i32[1] as NodonRigidShape;
  }
  set shape(value: NodonRigidShape) {
    this.props.i32[1] = value;
  }
  get shapeName() {
    return NodonRigidShape[this.shape];
  }
}

export class PlzRotateRigidNode extends Mixin(Nodon, NodonTransformMixin, NodonColorMixin) {

  label = 'Rotating Object';

  constructor() {
    super(ActorType.PlzRotateRigidNode);
  }

  hasShape = true;

  get shape() {
    return this.props.i32[1] as NodonRigidShape;
  }
  set shape(value: NodonRigidShape) {
    this.props.i32[1] = value;
  }
  get shapeName() {
    return NodonRigidShape[this.shape];
  }
}

export class PlzStretchRigidNode extends Mixin(Nodon, NodonTransformMixin, NodonColorMixin, NodonShapeMixin) {

  label = 'Extending Object';

  constructor() {
    super(ActorType.PlzStretchRigidNode);
  }
}

export class PlzScoreRigidNode extends Mixin(Nodon, NodonTransformMixin, NodonColorMixin) {

  label = 'Number Object';

  constructor() {
    super(ActorType.PlzScoreRigidNode);
  }
}

export class PlzCommentRigidNode extends Mixin(Nodon, NodonTransformMixin, NodonColorMixin) {

  label = 'Text';

  constructor() {
    super(ActorType.PlzCommentRigidNode);
  }
}

export class PlzFancyRigidNode extends Mixin(Nodon, NodonTransformMixin) {

  label = 'Fancy Object';

  constructor() {
    super(ActorType.PlzFancyRigidNode);
  }

  // TODO: map out object types
  get objectType() { 
    return this.props.u32[2];
  }
  set objectType(value: number) {
    this.props.u32[2] = value;
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

  getTexture() {
    return this.game.textures[this.textureIdx];
  }
}