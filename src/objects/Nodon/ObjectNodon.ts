
// // TODO: investigate all of these, could be wrong
// export enum PlzFieldConfigNodeShape {
//   Plane = 0,
//   Cube = 1,
//   None = 5,
// };

// export class PlzFieldConfigNode extends NodonBase {
//   constructor() {
//     super(ActorType.PlzFieldConfigNode);
//   }

//   get shape() { return this.props.i32[0] as PlzFieldConfigNodeShape }
//   set shape(value: PlzFieldConfigNodeShape) { this.props.i32[0] = value }
//   get shapeName() { return PlzFieldConfigNodeShape[this.shape] }

//   get size() { return [this.props.u32[1], this.props.u32[2], this.props.u32[3]] }
//   set size(value: NodonVec3) { 
//     this.props.u32[1] - value[0];
//     this.props.u32[2] - value[1];
//     this.props.u32[3] - value[2];
//   }
// }

// export class PlzTpsCamera extends NodonBase {
//   constructor() {
//     super(ActorType.PlzTpsCamera);
//   }

//   get fov() { return this.props.f32[0] }
//   set fov(value: number) { this.props.f32[0] = value }

//   get horizontalTrackRate() { return this.props.f32[1] }
//   set horizontalTrackRate(value: number) { this.props.f32[1] = value }

//   get verticalTrackRate() { return this.props.f32[2] }
//   set verticalTrackRate(value: number) { this.props.f32[2] = value }

//   get rotateX() { return this.props.f32[3] }
//   set rotateX(value: number) { this.props.f32[3] = value }

//   get rotateY() { return this.props.f32[4] }
//   set rotateY(value: number) { this.props.f32[4] = value }

//   get worldPosition() { return this.props.vec3[1] }
//   set worldPosition(value: NodonVec3) { this.props.vec3[1] = value }

//   get offsetDistance() { return this.props.vec3[2] }
//   set offsetDistance(value: NodonVec3) { this.props.vec3[2] = value }

// }