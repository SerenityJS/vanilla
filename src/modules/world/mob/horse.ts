import { Entity, EntityIdentifier } from "@serenityjs/core";

import { MobEntityTrait } from "./mob";
import { PanicGoal } from "./ai/goals/panic";
import { RandomStrollGoal } from "./ai/goals/random-stroll";

class HorseMob extends MobEntityTrait {
  public static readonly identifier: string = "minecraft:horse";

  public static readonly types: Array<EntityIdentifier> = [
    EntityIdentifier.Horse
  ];

  public constructor(entity: Entity) {
    super(entity);

    this.goalSelector.addGoal(3, new PanicGoal(this, 1.2));
    this.goalSelector.addGoal(6, new RandomStrollGoal(this, 0.7));
  }
}

export default HorseMob;
