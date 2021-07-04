import { ActorType } from './ActorTypes';
import { Nodon, NodonCategory, NodonTag } from './NodonBase';
import { NodonSettingType, nodonSetting } from './NodonSettingDescriptor';
import { NodonPortMap, NodonPortType } from './NodonPortDescriptor';

export enum CalculationNodeMethod {
  Add = 0,
  Minus,
  Multiply,
  Divide
};

export class CalculationNode extends Nodon {

  label = 'Calculator';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.CalculationNode);
  }

  @nodonSetting({
    label: 'Calculation Method',
    type: NodonSettingType.Enum,
    enum: CalculationNodeMethod
  })
  get method() { return this.props.i32[0] }
  set method(value: number) { this.props.i32[0] = value }
}

export class MappingNode extends Nodon {

  label = 'Map';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.MappingNode);
  }

  @nodonSetting({
    label: 'Input Range',
    type: NodonSettingType.Range,
    min: -1000,
    max: 1000
  })
  get inputRange() {
    return [this.props.f32[2], this.props.f32[3]]
  }
  set inputRange(value: [number, number]) {
    this.props.f32[2] = value[0];
    this.props.f32[3] = value[1];
  }

  @nodonSetting({
    label: 'Output Range',
    type: NodonSettingType.Range,
    min: -1000,
    max: 1000
  })
  get outputRange() {
    return [this.props.f32[0], this.props.f32[1]]
  }
  set outputRange(value: [number, number]) {
    this.props.f32[0] = value[0];
    this.props.f32[1] = value[1];
  }

  // TODO; more settings
}

export class QuantizationNode extends Nodon {

  label = 'Digitize';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.QuantizationNode);
  }

  @nodonSetting({
    label: 'Number of Stages',
    type: NodonSettingType.Number,
    min: 2,
    max: 50
  })
  get stage() { return this.props.i32[0] }
  set stage(value: number) { this.props.i32[0] = value }
}

export class SquareRootNode extends Nodon {

  label = 'Square Root';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.SquareRootNode);
  }
}

export class AbsoluteValueNode extends Nodon {

  label = 'Absolute Value';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.AbsoluteValueNode);
  }
}

export class NegationNode extends Nodon {

  label = 'Inversion';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.NegationNode);
  }
}

export class TriggerNode extends Nodon {

  label = 'Trigger From 0';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.TriggerNode);
  }
}

export class AtanNode extends Nodon {

  label = 'Position -> Angle';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.AtanNode);
  }
}

export class TrigonometricNode extends Nodon {

  label = 'Angle -> Position';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.TrigonometricNode);
  }
}

export class AngleDistanceNode extends Nodon {

  label = 'Angle Difference';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.AngleDistanceNode);
  }
}

export class ComparisonNode extends Nodon {

  label = 'Comparison';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.ComparisonNode);
  }

  // TODO: i32[0] stores comparison method
}

export class AndNode extends Nodon {

  label = 'AND';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.AndNode);
  }
  
}

export class NotNode extends Nodon {

  label = 'NOT';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.NotNode);
  }
  
}

export class FlagNode extends Nodon {

  label = 'Flag';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.FlagNode);
  }
  
}

export class TpbCounterNode extends Nodon {

  label = 'Counter';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.TpbCounterNode);
  }

  @nodonSetting({
    label: 'Starting Value',
    type: NodonSettingType.Number,
    min: -1000,
    max: 1000
  })
  get startValue() { return this.props.i32[3] }
  set startValue(value: number) { this.props.i32[3] = value }
  
  // TODO: more settings

}

export class IntegerRandomNode extends Nodon {

  label = 'Random';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.IntegerRandomNode);
  }

  @nodonSetting({
    label: 'Output Range',
    type: NodonSettingType.Number,
    min: -1000,
    max: 1000
  })
  get outputRange() { return this.props.i32[0] }
  set outputRange(value: number) { this.props.i32[0] = value }
  
  // TODO: more settings

}

export class TimerNode extends Nodon {

  label = 'Timer';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.TimerNode);
  }

  @nodonSetting({
    label: 'Output After How Many Seconds?',
    type: NodonSettingType.Number,
    min: 0,
    max: 100
  })
  get outputAfter() { return this.props.f32[0] }
  set outputAfter(value: number) { this.props.f32[0] = value }

  @nodonSetting({
    label: 'Continue Output For How Long?',
    type: NodonSettingType.Number,
    min: 0,
    max: 100
  })
  get continueFor() { return this.props.f32[1] }
  set continueFor(value: number) { this.props.f32[1] = value }

}

export class SpoitNode extends Nodon {

  label = 'Target';

  category = NodonCategory.Middle;

  constructor() {
    super(ActorType.SpoitNode);
  }

  // TODO: settings

}

export class CommentNode extends Nodon {

  label = 'Comment';

  category = NodonCategory.MiddleLayout;

  constructor() {
    super(ActorType.CommentNode);
  }

  // TODO: i32[0] is comment string idx

}


export class WireWarpInNode extends Nodon {

  label = 'Wormhole Entrance';

  category = NodonCategory.MiddleLayout;

  constructor() {
    super(ActorType.WireWarpInNode);
  }

  // TODO: settings

}


export class WireWarpOutNode extends Nodon {

  label = 'Wormhole Exit';

  category = NodonCategory.MiddleLayout;

  constructor() {
    super(ActorType.WireWarpOutNode);
  }

  // TODO: settings

}
