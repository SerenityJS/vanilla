import { Entity, EntityIdentifier } from "@serenityjs/core";

import { RandomStrollGoal } from "./ai/goals/random-stroll";
import { MobEntityTrait } from "./mob-entity";

class WitchMob extends MobEntityTrait {
  public static readonly identifier: string = "minecraft:witch";

  public static readonly types: Array<EntityIdentifier> = [
    EntityIdentifier.Witch,
  ];

  public constructor(entity: Entity) {
    super(entity);
    this.goalSelector.addGoal(4, new RandomStrollGoal(this, 1));
    // Again, too many unimplemented stuff
  }
}

export default WitchMob;
