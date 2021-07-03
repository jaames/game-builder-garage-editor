import { ActorType } from './ActorTypes';
import { Nodon, NodonCategory, NodonTag } from './NodonBase';
import { NodonSettingType, nodonSetting } from './NodonSettings';

export class TpbPlaySoundNode extends Nodon {

  label = 'Play Sound';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.TpbPlaySoundNode);
  }

  // TODO: settings
}

export class TpbPlayBgmNode extends Nodon {

  label = 'Background Music';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.TpbPlayBgmNode);
  }

  // TODO: settings
}

export class VibrateNode extends Nodon {

  label = 'Vibration';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.VibrateNode);
  }

  @nodonSetting({
    label: 'Frequency',
    type: NodonSettingType.Number,
    min: 40,
    max: 1280
  })
  get value() { return this.props.i32[3] }
  set value(value: number) { this.props.i32[3] = value }

  // TODO: more settings
}

export class PlzGravityNode extends Nodon {

  label = 'Reduce Gravity';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.PlzGravityNode);
  }
}

export class PlzPlaySpeedNode extends Nodon {

  label = 'Slow Time';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.PlzPlaySpeedNode);
  }
}

export class PlzResetNode extends Nodon {

  label = 'Retry';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.PlzResetNode);
  }
}

export class PlzExitNode extends Nodon {

  label = 'End Game';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.PlzExitNode);
  }
}

export class PlzChangeFileNode extends Nodon {

  label = 'Swap Game';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.PlzChangeFileNode);
  }

  // TODO: settings
}

export class GaugeNode extends Nodon {

  label = 'Marker Display';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.GaugeNode);
  }

  // TODO: settings
}

export class Move2dNode extends Nodon {

  label = '2D Marker Display';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.Move2dNode);
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

  // u32[0] is size, but needs to be cast to float
}

export class AlwaysOnNode extends Nodon {

  label = 'Continuous Marker Display';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.AlwaysOnNode);
  }

  // TODO: settings
}

export class EmitIrLedNode extends Nodon {

  label = 'IR Light';

  category = NodonCategory.Output;

  constructor() {
    super(ActorType.EmitIrLedNode);
  }

  // TODO: settings
}