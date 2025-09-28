import { Entity, EntityIdentifier } from "@serenityjs/core";

import { RandomStrollGoal } from "./ai/goals/random-stroll";
import { MobEntityTrait } from "./mob-entity";

class CreeperMob extends MobEntityTrait {
  public static readonly identifier: string = "minecraft:creeper";

  public static readonly types: Array<EntityIdentifier> = [
    EntityIdentifier.Creeper,
  ];

  public constructor(entity: Entity) {
    super(entity);

    this.goalSelector.addGoal(5, new RandomStrollGoal(this, 1));
  }
}

export default CreeperMob;
