import { ActorType } from './ActorTypes';
import { Nodon } from './NodonBase';
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
} from './PhysicalNodon';


export function NodonFactory(type: ActorType) {
  switch (type) {
    // Physical Nodon (visible within the world)
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
    default: 
      return new Nodon(type);
  }
}