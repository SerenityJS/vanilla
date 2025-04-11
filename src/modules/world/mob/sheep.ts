import { Entity, EntityIdentifier, ItemIdentifier } from "@serenityjs/core";

import { MobEntityTrait } from "./mob";
import { PanicGoal } from "./ai/goals/panic";
import { TemptGoal } from "./ai/goals/tempt";
import { RandomStrollGoal } from "./ai/goals/random-stroll";

class SheepMob extends MobEntityTrait {
  public static identifier: string = "minecraft:sheep";

  public static readonly types: Array<EntityIdentifier> = [
    EntityIdentifier.Sheep
  ];

  public constructor(entity: Entity) {
    super(entity);

    this.goalSelector.addGoal(1, new PanicGoal(this, 1.25));
    this.goalSelector.addGoal(
      4,
      new TemptGoal(this, 1.25, [ItemIdentifier.Wheat])
    );
    this.goalSelector.addGoal(7, new RandomStrollGoal(this, 0.8));
  }
}

export default SheepMob;
