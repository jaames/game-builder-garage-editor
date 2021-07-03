import { ActorType } from './ActorTypes';
import { Nodon } from './NodonBase';
import { NodonSettingType, nodonSetting } from './NodonSettings';

export class ConstantNode extends Nodon {

  label = 'Constant';

  constructor() {
    super(ActorType.ConstantNode);
  }

  @nodonSetting({
    label: 'Output Value',
    type: NodonSettingType.Number,
    min: -1000,
    max: 1000
  })
  get value() { return this.props.f32[0] }
  set value(value: number) { this.props.f32[0] = value }
}

export class ButtonPressedNode extends Nodon {

  label = 'Button';

  constructor() {
    super(ActorType.ButtonPressedNode);
  }

  // TODO: settings
}

export class StickTiltedNode extends Nodon {

  label = 'Stick';

  constructor() {
    super(ActorType.StickTiltedNode);
  }
  
  @nodonSetting({
    label: 'Range',
    type: NodonSettingType.Range,
    min: 0,
    max: 1
  })
  get range() {
    return [this.props.f32[0], this.props.f32[1]]
  }
  set range(value: [number, number]) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
  }

  // TODO: more settings
}

export class IsTouchNode extends Nodon {

  label = 'If Touched';

  constructor() {
    super(ActorType.IsTouchNode);
  }

  // TODO: settings
}

export class TouchPositionNode extends Nodon {

  label = 'Touch Position';

  constructor() {
    super(ActorType.TouchPositionNode);
  }
}

export class IntegratedSwingedNode extends Nodon {

  label = 'Shake';

  constructor() {
    super(ActorType.IntegratedSwingedNode);
  }

  @nodonSetting({
    label: 'Range',
    type: NodonSettingType.Range,
    min: 0,
    max: 1
  })
  get range() {
    return [this.props.f32[0], this.props.f32[1]]
  }
  set range(value: [number, number]) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
  }

  // i32[3] likely direction

  // TODO: more settings
}

export class IntegratedAxisAngleNode extends Nodon {

  label = 'Tilt';

  constructor() {
    super(ActorType.IntegratedAxisAngleNode);
  }

  @nodonSetting({
    label: 'Range',
    type: NodonSettingType.Range,
    min: 0,
    max: 1
  })
  get range() {
    return [this.props.f32[0], this.props.f32[1]]
  }
  set range(value: [number, number]) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
  }

  // TODO: more settings
}

export class IntegratedSurfaceUpwardNode extends Nodon {

  label = 'If Face Up';

  constructor() {
    super(ActorType.IntegratedSurfaceUpwardNode);
  }

  @nodonSetting({
    label: 'Range',
    type: NodonSettingType.Range,
    min: 0,
    max: 1
  })
  get range() {
    return [this.props.f32[0], this.props.f32[1]]
  }
  set range(value: [number, number]) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
  }

  // TODO: more settings
}

export class IntegratedRotationSpeedNode extends Nodon {

  label = 'Rotation Speed';

  constructor() {
    super(ActorType.IntegratedRotationSpeedNode);
  }

  @nodonSetting({
    label: 'Range',
    type: NodonSettingType.Range,
    min: 0,
    max: 1
  })
  get range() {
    return [this.props.f32[0], this.props.f32[1]]
  }
  set range(value: [number, number]) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
  }

  // TODO: more settings
}

export class FoundIrMarkerNode extends Nodon {

  label = 'IR Motion Camera';

  constructor() {
    super(ActorType.FoundIrMarkerNode);
  }

  // TODO: more settings
}

export class PlzObjBreakCountNode extends Nodon {

  label = 'IR Motion Camera';

  constructor() {
    super(ActorType.PlzObjBreakCountNode);
  }

  // TODO: more settings
}

export class OnStartNode extends Nodon {

  label = 'On Start';

  constructor() {
    super(ActorType.OnStartNode);
  }
}