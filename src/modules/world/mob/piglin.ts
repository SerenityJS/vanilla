/* eslint-disable prettier/prettier */
import { Entity, EntityIdentifier } from "@serenityjs/core";

import { MobEntityTrait } from "./mob";
import { RandomStrollGoal } from "./ai/goals/random-stroll";

class PiglinMob extends MobEntityTrait {
  public static readonly identifier: string = "minecraft:piglin";
  public static readonly types: Array<EntityIdentifier> = [
    EntityIdentifier.Piglin
  ]

  public constructor(entity: Entity) {
    super(entity);

    this.goalSelector.addGoal(10, new RandomStrollGoal(this, 0.6));
    // This has to many unimplemented goals omfg
  }
}

export default PiglinMob;
