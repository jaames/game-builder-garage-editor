// export class ConstantNode extends NodonBase {
//   constructor() {
//     super(ActorType.ConstantNode);
//   }

//   get value() { return this.props.f32[0] }
//   set value(value: number) { this.props.f32[0] = value }
// }

// export class TimerNode extends NodonBase {
//   constructor() {
//     super(ActorType.TimerNode);
//   }

//   get outputAfter() { return this.props.f32[0] }
//   set outputAfter(value: number) { this.props.f32[0] = value }

//   get continueOutput() { return this.props.f32[1] } // TODO: double check this
//   set continueOutput(value: number) { this.props.f32[1] = value }
// }