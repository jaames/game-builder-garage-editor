import { ActorType } from './ActorTypes';

export interface Cost {
  fixedInvisible: number;
  fixedVisible: number;
  moveInvisible: number;
  moveVisible: number;
};

export interface ActorCost extends Cost {
  type: ActorType;
  subType?: string;
};

export const COST_MAX: Cost = {
  fixedInvisible: 2000,
  fixedVisible: 2000,
  moveInvisible: 2000,
  moveVisible: 2000,
};

export const COST_CONNECTION: Cost = {
  fixedInvisible: 1,
  fixedVisible: 1,
  moveInvisible: 1,
  moveVisible: 1,
};

export const COST_CONNECTION_BIND: Cost = { // not 100% sure what this is
  fixedInvisible: 1.5,
  fixedVisible: 1.5,
  moveInvisible: 1.5,
  moveVisible: 1.5,
};

export const COST_ACTORS: ActorCost[] = [
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.FoundIrMarkerNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.StickTiltedNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.IsControllerSwingedNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.IsConsoleSwingedNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.IsControllerSurfaceUpwardNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.IsConsoleSurfaceUpwardNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.ButtonPressedNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.IsTouchNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.VibrateNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.GaugeNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.FlashNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.Move2dNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.AlwaysOnNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlaySoundScaleNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.EmitIrLedNode
  },
  {
    fixedInvisible: 2.5,
    fixedVisible: 2.5,
    moveInvisible: 2.5,
    moveVisible: 2.5,
    type: ActorType.AndNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.NotNode
  },
  {
    fixedInvisible: 1.5,
    fixedVisible: 1.5,
    moveInvisible: 1.5,
    moveVisible: 1.5,
    type: ActorType.TimerNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CounterNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.RoundTripCounterNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.IntegerCounterNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.SpoitNode
  },
  {
    fixedInvisible: 0,
    fixedVisible: 0,
    moveInvisible: 0,
    moveVisible: 0,
    type: ActorType.CommentNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlayBgmNode
  },
  {
    fixedInvisible: 2.5,
    fixedVisible: 2.5,
    moveInvisible: 2.5,
    moveVisible: 2.5,
    type: ActorType.CalculationNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.ConstantNode
  },
  {
    fixedInvisible: 2.5,
    fixedVisible: 2.5,
    moveInvisible: 2.5,
    moveVisible: 2.5,
    type: ActorType.AtanNode
  },
  {
    fixedInvisible: 3,
    fixedVisible: 3,
    moveInvisible: 3,
    moveVisible: 3,
    type: ActorType.TrigonometricNode
  },
  {
    fixedInvisible: 2.5,
    fixedVisible: 2.5,
    moveInvisible: 2.5,
    moveVisible: 2.5,
    type: ActorType.SquareRootNode
  },
  {
    fixedInvisible: 2.5,
    fixedVisible: 2.5,
    moveInvisible: 2.5,
    moveVisible: 2.5,
    type: ActorType.ComparisonNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.QuantizationNode
  },
  {
    fixedInvisible: 1.5,
    fixedVisible: 1.5,
    moveInvisible: 1.5,
    moveVisible: 1.5,
    type: ActorType.MappingNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.TriggerNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.WireWarpInNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.WireWarpOutNode
  },
  {
    fixedInvisible: 1.5,
    fixedVisible: 1.5,
    moveInvisible: 1.5,
    moveVisible: 1.5,
    type: ActorType.IsRotateControllerNode
  },
  {
    fixedInvisible: 1.5,
    fixedVisible: 1.5,
    moveInvisible: 1.5,
    moveVisible: 1.5,
    type: ActorType.IsRotateConsoleNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.AngleDistanceNode
  },
  {
    fixedInvisible: 1.5,
    fixedVisible: 1.5,
    moveInvisible: 1.5,
    moveVisible: 1.5,
    type: ActorType.ControllerRotationAngleNode
  },
  {
    fixedInvisible: 1.5,
    fixedVisible: 1.5,
    moveInvisible: 1.5,
    moveVisible: 1.5,
    type: ActorType.ConsoleRotationAngleNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.RandomNode
  },
  {
    fixedInvisible: 1.5,
    fixedVisible: 1.5,
    moveInvisible: 1.5,
    moveVisible: 1.5,
    type: ActorType.IntegerRandomNode
  },
  {
    fixedInvisible: 0,
    fixedVisible: 0,
    moveInvisible: 0,
    moveVisible: 0,
    type: ActorType.OnStartNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.PlzObjBreakCountNode
  },
  {
    fixedInvisible: 4.5,
    fixedVisible: 5.5,
    moveInvisible: 5,
    moveVisible: 6,
    type: ActorType.PlzRigidNode
  },
  {
    fixedInvisible: 5.5,
    fixedVisible: 6.5,
    moveInvisible: 6,
    moveVisible: 7,
    type: ActorType.PlzCommentRigidNode
  },
  {
    fixedInvisible: 5.5,
    fixedVisible: 6.5,
    moveInvisible: 6,
    moveVisible: 7,
    type: ActorType.PlzScoreRigidNode
  },
  {
    fixedInvisible: 10,
    fixedVisible: 13,
    moveInvisible: 10,
    moveVisible: 13,
    type: ActorType.PlzMoveRigidNode
  },
  {
    fixedInvisible: 10,
    fixedVisible: 13,
    moveInvisible: 10,
    moveVisible: 13,
    type: ActorType.PlzRotateRigidNode
  },
  {
    fixedInvisible: 8,
    fixedVisible: 8,
    moveInvisible: 8,
    moveVisible: 8,
    type: ActorType.PlzStretchRigidNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 6,
    moveInvisible: 4,
    moveVisible: 6,
    type: ActorType.PlzPullForceNode
  },
  {
    fixedInvisible: 13.5,
    fixedVisible: 16.5,
    moveInvisible: 15,
    moveVisible: 18,
    type: ActorType.PlzGeneratorFewNode
  },
  {
    fixedInvisible: 54,
    fixedVisible: 66,
    moveInvisible: 60,
    moveVisible: 72,
    type: ActorType.PlzGeneratorNode
  },
  {
    fixedInvisible: 459,
    fixedVisible: 561,
    moveInvisible: 510,
    moveVisible: 612,
    type: ActorType.PlzGeneratorManyNode
  },
  {
    fixedInvisible: 6,
    fixedVisible: 6,
    moveInvisible: 6,
    moveVisible: 6,
    type: ActorType.PlzBindCommanderNode
  },
  {
    fixedInvisible: 50,
    fixedVisible: 50,
    moveInvisible: 50,
    moveVisible: 50,
    type: ActorType.PlzRopeNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 5,
    moveInvisible: 4,
    moveVisible: 5,
    type: ActorType.PlzObjWarpEnterNode
  },
  {
    fixedInvisible: 8,
    fixedVisible: 9,
    moveInvisible: 8,
    moveVisible: 9,
    type: ActorType.PlzObjWarpExitNode
  },
  {
    fixedInvisible: 41,
    fixedVisible: 41,
    moveInvisible: 41,
    moveVisible: 41,
    type: ActorType.PlzFancyRigidNode
  },
  {
    fixedInvisible: 8,
    fixedVisible: 11,
    moveInvisible: 8,
    moveVisible: 11,
    type: ActorType.PlzFancyRigidNode,
    subType: 'WoodBox'
  },
  {
    fixedInvisible: 8,
    fixedVisible: 13,
    moveInvisible: 8,
    moveVisible: 13,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Container'
  },
  {
    fixedInvisible: 8,
    fixedVisible: 11.5,
    moveInvisible: 8,
    moveVisible: 11.5,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Dice'
  },
  {
    fixedInvisible: 8,
    fixedVisible: 10.5,
    moveInvisible: 8,
    moveVisible: 10.5,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Panel'
  },
  {
    fixedInvisible: 10,
    fixedVisible: 19,
    moveInvisible: 10,
    moveVisible: 19,
    type: ActorType.PlzFancyRigidNode,
    subType: 'TreasureBox'
  },
  {
    fixedInvisible: 10,
    fixedVisible: 12,
    moveInvisible: 10,
    moveVisible: 12,
    type: ActorType.PlzFancyRigidNode,
    subType: 'TV'
  },
  {
    fixedInvisible: 10,
    fixedVisible: 39,
    moveInvisible: 10,
    moveVisible: 39,
    type: ActorType.PlzFancyRigidNode,
    subType: 'JoyConR'
  },
  {
    fixedInvisible: 10,
    fixedVisible: 39,
    moveInvisible: 10,
    moveVisible: 39,
    type: ActorType.PlzFancyRigidNode,
    subType: 'JoyConL'
  },
  {
    fixedInvisible: 8,
    fixedVisible: 15,
    moveInvisible: 8,
    moveVisible: 15,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Soccer'
  },
  {
    fixedInvisible: 8,
    fixedVisible: 10,
    moveInvisible: 8,
    moveVisible: 10,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Golf'
  },
  {
    fixedInvisible: 10,
    fixedVisible: 14,
    moveInvisible: 10,
    moveVisible: 14,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Balloon'
  },
  {
    fixedInvisible: 8,
    fixedVisible: 10,
    moveInvisible: 8,
    moveVisible: 10,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Apple'
  },
  {
    fixedInvisible: 8,
    fixedVisible: 11.5,
    moveInvisible: 8,
    moveVisible: 11.5,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Turnip'
  },
  {
    fixedInvisible: 10,
    fixedVisible: 14,
    moveInvisible: 10,
    moveVisible: 14,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Fish'
  },
  {
    fixedInvisible: 15,
    fixedVisible: 30,
    moveInvisible: 15,
    moveVisible: 30,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Kedamaru'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 25,
    moveInvisible: 13,
    moveVisible: 25,
    type: ActorType.PlzFancyRigidNode,
    subType: 'BzkEnemy'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 23,
    moveInvisible: 13,
    moveVisible: 23,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Doll01'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 22,
    moveInvisible: 13,
    moveVisible: 22,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Doll02'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 30,
    moveInvisible: 13,
    moveVisible: 30,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Doll03'
  },
  {
    fixedInvisible: 10,
    fixedVisible: 18,
    moveInvisible: 10,
    moveVisible: 18,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Doll04'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 27,
    moveInvisible: 13,
    moveVisible: 27,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Doll05'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 30,
    moveInvisible: 13,
    moveVisible: 30,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Doll06'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 23,
    moveInvisible: 13,
    moveVisible: 23,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Doll07'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 28,
    moveInvisible: 13,
    moveVisible: 28,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Doll08'
  },
  {
    fixedInvisible: 10,
    fixedVisible: 14,
    moveInvisible: 10,
    moveVisible: 14,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Ring'
  },
  {
    fixedInvisible: 10,
    fixedVisible: 18,
    moveInvisible: 10,
    moveVisible: 18,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Arrow'
  },
  {
    fixedInvisible: 8,
    fixedVisible: 9,
    moveInvisible: 8,
    moveVisible: 9,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Missile'
  },
  {
    fixedInvisible: 8,
    fixedVisible: 12,
    moveInvisible: 8,
    moveVisible: 12,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Pencil'
  },
  {
    fixedInvisible: 12,
    fixedVisible: 15,
    moveInvisible: 12,
    moveVisible: 15,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Tuna'
  },
  {
    fixedInvisible: 12,
    fixedVisible: 13,
    moveInvisible: 12,
    moveVisible: 13,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Chick'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 19,
    moveInvisible: 13,
    moveVisible: 19,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Hippo'
  },
  {
    fixedInvisible: 13,
    fixedVisible: 22,
    moveInvisible: 13,
    moveVisible: 22,
    type: ActorType.PlzFancyRigidNode,
    subType: 'Bear'
  },
  {
    fixedInvisible: 24,
    fixedVisible: 38,
    moveInvisible: 24,
    moveVisible: 38,
    type: ActorType.PlzHumanNode
  },
  {
    fixedInvisible: 45,
    fixedVisible: 105,
    moveInvisible: 45,
    moveVisible: 105,
    type: ActorType.PlzCarNode
  },
  {
    fixedInvisible: 18,
    fixedVisible: 24,
    moveInvisible: 18,
    moveVisible: 24,
    type: ActorType.PlzUfoNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlzPlayerHeightNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlzStartPositionNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlzHandNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlzHeadNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlzCameraPositionNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlzCameraDirectionNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlzCameraLookAtNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlzCameraViewAngleNode
  },
  {
    fixedInvisible: 6,
    fixedVisible: 6,
    moveInvisible: 6,
    moveVisible: 6,
    type: ActorType.PlzWorldEffectNode
  },
  {
    fixedInvisible: 12,
    fixedVisible: 12,
    moveInvisible: 12,
    moveVisible: 12,
    type: ActorType.PlzCameraEffectNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 4,
    moveInvisible: 4,
    moveVisible: 4,
    type: ActorType.PlzSoundEffectNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.PlzPlaySpeedNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.PlzGravityNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.PlzFieldConfigNode
  },
  {
    fixedInvisible: 3.5,
    fixedVisible: 4.5,
    moveInvisible: 3.5,
    moveVisible: 4.5,
    type: ActorType.PlzTouchSensorNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 5.5,
    moveInvisible: 4,
    moveVisible: 5.5,
    type: ActorType.PlzPositionSensorNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 5.5,
    moveInvisible: 4,
    moveVisible: 5.5,
    type: ActorType.PlzSpeedSensorNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 5.5,
    moveInvisible: 4,
    moveVisible: 5.5,
    type: ActorType.PlzAccelerationSensorNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 5.5,
    moveInvisible: 4,
    moveVisible: 5.5,
    type: ActorType.PlzAngleSensorNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 5.5,
    moveInvisible: 4,
    moveVisible: 5.5,
    type: ActorType.PlzRotationSensorNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 5.5,
    moveInvisible: 4,
    moveVisible: 5.5,
    type: ActorType.PlzBreakSensorNode
  },
  {
    fixedInvisible: 4,
    fixedVisible: 5.5,
    moveInvisible: 4,
    moveVisible: 5.5,
    type: ActorType.PlzBrokenSensorNode
  },
  {
    fixedInvisible: 4.5,
    fixedVisible: 5.5,
    moveInvisible: 4.5,
    moveVisible: 5.5,
    type: ActorType.PlzGrabSensorNode
  },
  {
    fixedInvisible: 6,
    fixedVisible: 6,
    moveInvisible: 6,
    moveVisible: 6,
    type: ActorType.PlzJointSingleAxisSliderNode
  },
  {
    fixedInvisible: 7,
    fixedVisible: 7,
    moveInvisible: 7,
    moveVisible: 7,
    type: ActorType.PlzJointSliderNode
  },
  {
    fixedInvisible: 8,
    fixedVisible: 8,
    moveInvisible: 8,
    moveVisible: 8,
    type: ActorType.PlzJointHingeNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.PlzResetNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.PlzExitNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.PlzChangeFileNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.MainconCheckNode
  },
  {
    fixedInvisible: 1,
    fixedVisible: 1,
    moveInvisible: 1,
    moveVisible: 1,
    type: ActorType.AttatchmentCheckNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrCameraZoomNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrWindmillBlowTrigNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrWindmillRotationSpeedNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrBazookaHandlePositionNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrBazookaBulletPositionNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrBazookaIsBulletLoadedNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrBazookaBulletFireTrigNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrBazookaTriggerTrigNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrBazookaVisorAngleNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrPedalInputLevelNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrPedalInputTrigNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrBirdHeadPositionNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrBirdFlappingTrigNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrElephantRelativePositionNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrElephantRelativeRotationNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrDiverRelativePositionNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrDiverRelativeRotationNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrDiverIsCaptureMarkerNode
  },
  {
    fixedInvisible: 2,
    fixedVisible: 2,
    moveInvisible: 2,
    moveVisible: 2,
    type: ActorType.CvrElephantIsCaptureMarkerNode
  },
];

export const COST_ACTORS_MAP = new Map(COST_ACTORS.map(cost => [cost.type, cost]));