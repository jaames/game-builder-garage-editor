import { ActorType } from './ActorTypes';
import { Nodon } from './NodonBase';

import {
  ConstantNode,
  ButtonPressedNode,
  StickTiltedNode,
  IsTouchNode,
  TouchPositionNode,
  IntegratedSwingedNode,
  IntegratedAxisAngleNode,
  IntegratedSurfaceUpwardNode,
  IntegratedRotationSpeedNode,
  FoundIrMarkerNode,
  PlzObjBreakCountNode,
  OnStartNode,
} from './InputNodon';

import {
  CalculationNode,
  MappingNode,
  QuantizationNode,
  SquareRootNode,
  AbsoluteValueNode,
  NegationNode,
  TriggerNode,
  AtanNode,
  TrigonometricNode,
  AngleDistanceNode,
  ComparisonNode,
  AndNode,
  NotNode,
  FlagNode,
  TpbCounterNode,
  IntegerRandomNode,
  TimerNode,
  SpoitNode,
  CommentNode,
  WireWarpInNode,
  WireWarpOutNode,
} from './MiddleNodon';

import {
  TpbPlaySoundNode,
  TpbPlayBgmNode, 
  VibrateNode, 
  PlzGravityNode, 
  PlzPlaySpeedNode, 
  PlzResetNode, 
  PlzExitNode, 
  PlzChangeFileNode, 
  GaugeNode, 
  Move2dNode, 
  AlwaysOnNode, 
  EmitIrLedNode, 
} from './OutputNodon';

import {
  PlzHumanNode,
  PlzCarNode,
  PlzUfoNode,
  PlzRigidNode,
  PlzMoveRigidNode,
  PlzRotateRigidNode,
  PlzStretchRigidNode,
  PlzScoreRigidNode,
  PlzCommentRigidNode,
  PlzFancyRigidNode,
  PlzTextureNode,
  PlzIntegratedEffectNode,
  PlzTouchSensorNode,
  PlzJointSingleAxisSliderNode,
  PlzBreakSensorNode,
  PlzJointSliderNode,
  PlzBrokenSensorNode,
  PlzJointHingeNode,
  PlzGrabSensorNode,
  PlzRopeNode,
  PlzPositionSensorNode,
  PlzGeneratorFewNode,
  PlzGeneratorNode,
  PlzGeneratorManyNode,
  PlzSpeedSensorNode,
  PlzBindCommanderNode,
  PlzAccelerationSensorNode,
  PlzObjWarpEnterNode,
  PlzObjWarpExitNode,
  PlzAngleSensorNode,
  PlzRotationSensorNode,
  PlzPullForceNode,
  PlzEasyCamera,
  PlzFieldConfigNode,
  PlzTpsCamera,
  PlzHeadNode,
  PlzHandNode,
  PlzCameraPositionNode,
  PlzCameraLookAtNode,
  PlzCameraDirectionNode,
  PlzCameraViewAngleNode,
} from './ObjectNodon';

// return the appropriate nodon class for a given nodon type
export function NodonFactory(type: ActorType): Nodon {
  switch (type) {

    // Input Nodon
    case ActorType.ConstantNode:
      return new ConstantNode();
    case ActorType.ButtonPressedNode:
      return new ButtonPressedNode();
    case ActorType.StickTiltedNode:
      return new StickTiltedNode();
    case ActorType.IsTouchNode:
      return new IsTouchNode();
    case ActorType.TouchPositionNode:
      return new TouchPositionNode();
    case ActorType.IntegratedSwingedNode:
      return new IntegratedSwingedNode();
    case ActorType.IntegratedAxisAngleNode:
      return new IntegratedAxisAngleNode();
    case ActorType.IntegratedSurfaceUpwardNode:
      return new IntegratedSurfaceUpwardNode();
    case ActorType.IntegratedRotationSpeedNode:
      return new IntegratedRotationSpeedNode();
    case ActorType.FoundIrMarkerNode:
      return new FoundIrMarkerNode();
    case ActorType.PlzObjBreakCountNode:
      return new PlzObjBreakCountNode();
    case ActorType.OnStartNode:
      return new OnStartNode();

    // Middle Nodon

    case ActorType.CalculationNode:
      return new CalculationNode();
    case ActorType.MappingNode:
      return new MappingNode();
    case ActorType.QuantizationNode:
      return new QuantizationNode();
    case ActorType.SquareRootNode:
      return new SquareRootNode();
    case ActorType.AbsoluteValueNode:
      return new AbsoluteValueNode();
    case ActorType.NegationNode:
      return new NegationNode();
    case ActorType.TriggerNode:
      return new TriggerNode();
    case ActorType.AtanNode:
      return new AtanNode();
    case ActorType.TrigonometricNode:
      return new TrigonometricNode();
    case ActorType.AngleDistanceNode:
      return new AngleDistanceNode();
    case ActorType.ComparisonNode:
      return new ComparisonNode();
    case ActorType.AndNode:
      return new AndNode();
    case ActorType.NotNode:
      return new NotNode();
    case ActorType.FlagNode:
      return new FlagNode();
    case ActorType.TpbCounterNode:
      return new TpbCounterNode();
    case ActorType.IntegerRandomNode:
      return new IntegerRandomNode();
    case ActorType.TimerNode:
      return new TimerNode();
    case ActorType.SpoitNode:
      return new SpoitNode();
    case ActorType.CommentNode:
      return new CommentNode();
    case ActorType.WireWarpInNode:
      return new WireWarpInNode();
    case ActorType.WireWarpOutNode:
      return new WireWarpOutNode();

    // Output Nodon
    case ActorType.TpbPlaySoundNode:
      return new TpbPlaySoundNode();
    case ActorType.TpbPlayBgmNode:
      return new TpbPlayBgmNode(); 
    case ActorType.VibrateNode:
      return new VibrateNode(); 
    case ActorType.PlzGravityNode:
      return new PlzGravityNode(); 
    case ActorType.PlzPlaySpeedNode:
      return new PlzPlaySpeedNode(); 
    case ActorType.PlzResetNode:
      return new PlzResetNode(); 
    case ActorType.PlzExitNode:
      return new PlzExitNode(); 
    case ActorType.PlzChangeFileNode:
      return new PlzChangeFileNode(); 
    case ActorType.GaugeNode:
      return new GaugeNode(); 
    case ActorType.Move2dNode:
      return new Move2dNode(); 
    case ActorType.AlwaysOnNode:
      return new AlwaysOnNode(); 
    case ActorType.EmitIrLedNode:
      return new EmitIrLedNode(); 

    // Object Nodon
    case ActorType.PlzHumanNode:
      return new PlzHumanNode();
    case ActorType.PlzCarNode:
      return new PlzCarNode();
    case ActorType.PlzUfoNode:
      return new PlzUfoNode();
    case ActorType.PlzRigidNode:
      return new PlzRigidNode();
    case ActorType.PlzMoveRigidNode:
      return new PlzMoveRigidNode();
    case ActorType.PlzRotateRigidNode:
      return new PlzRotateRigidNode();
    case ActorType.PlzStretchRigidNode:
      return new PlzStretchRigidNode();
    case ActorType.PlzScoreRigidNode:
      return new PlzScoreRigidNode();
    case ActorType.PlzCommentRigidNode:
      return new PlzCommentRigidNode();
    case ActorType.PlzFancyRigidNode:
      return new PlzFancyRigidNode();
    case ActorType.PlzTextureNode:
      return new PlzTextureNode();
    case ActorType.PlzIntegratedEffectNode:
      return new PlzIntegratedEffectNode(); 
    case ActorType.PlzTouchSensorNode:
      return new PlzTouchSensorNode(); 
    case ActorType.PlzJointSingleAxisSliderNode:
      return new PlzJointSingleAxisSliderNode(); 
    case ActorType.PlzBreakSensorNode:
      return new PlzBreakSensorNode(); 
    case ActorType.PlzJointSliderNode:
      return new PlzJointSliderNode(); 
    case ActorType.PlzBrokenSensorNode:
      return new PlzBrokenSensorNode(); 
    case ActorType.PlzJointHingeNode:
      return new PlzJointHingeNode(); 
    case ActorType.PlzGrabSensorNode:
      return new PlzGrabSensorNode(); 
    case ActorType.PlzRopeNode:
      return new PlzRopeNode(); 
    case ActorType.PlzPositionSensorNode:
      return new PlzPositionSensorNode(); 
    case ActorType.PlzGeneratorFewNode:
      return new PlzGeneratorFewNode(); 
    case ActorType.PlzGeneratorNode:
      return new PlzGeneratorNode(); 
    case ActorType.PlzGeneratorManyNode:
      return new PlzGeneratorManyNode(); 
    case ActorType.PlzSpeedSensorNode:
      return new PlzSpeedSensorNode(); 
    case ActorType.PlzBindCommanderNode:
      return new PlzBindCommanderNode(); 
    case ActorType.PlzAccelerationSensorNode:
      return new PlzAccelerationSensorNode(); 
    case ActorType.PlzObjWarpEnterNode:
      return new PlzObjWarpEnterNode(); 
    case ActorType.PlzObjWarpExitNode:
      return new PlzObjWarpExitNode(); 
    case ActorType.PlzAngleSensorNode:
      return new PlzAngleSensorNode(); 
    case ActorType.PlzRotationSensorNode:
      return new PlzRotationSensorNode(); 
    case ActorType.PlzPullForceNode:
      return new PlzPullForceNode(); 
    case ActorType.PlzEasyCamera:
      return new PlzEasyCamera(); 
    case ActorType.PlzFieldConfigNode:
      return new PlzFieldConfigNode(); 
    case ActorType.PlzTpsCamera:
      return new PlzTpsCamera(); 
    case ActorType.PlzHeadNode:
      return new PlzHeadNode(); 
    case ActorType.PlzHandNode:
      return new PlzHandNode(); 
    case ActorType.PlzCameraPositionNode:
      return new PlzCameraPositionNode(); 
    case ActorType.PlzCameraLookAtNode:
      return new PlzCameraLookAtNode(); 
    case ActorType.PlzCameraDirectionNode:
      return new PlzCameraDirectionNode(); 
    case ActorType.PlzCameraViewAngleNode:
      return new PlzCameraViewAngleNode(); 

    default:
      throw new Error(`Unknown Nodon Type: ${ type }`);
  }
}