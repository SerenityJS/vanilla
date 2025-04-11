import { Entity, EntityIdentifier, ItemIdentifier } from "@serenityjs/core";

import { PanicGoal } from "./ai/goals/panic";
import { TemptGoal } from "./ai/goals/tempt";
import { RandomStrollGoal } from "./ai/goals/random-stroll";
import { MobEntityTrait } from "./mob";

class CowMob extends MobEntityTrait {
  public static readonly identifier: string = "minecraft:cow";

  public static readonly types: Array<EntityIdentifier> = [
    EntityIdentifier.Cow
  ];

  public constructor(entity: Entity) {
    super(entity);

    this.goalSelector.addGoal(1, new PanicGoal(this, 1.25));

    this.goalSelector.addGoal(
      4,
      new TemptGoal(this, 1.25, [ItemIdentifier.Wheat])
    );

    this.goalSelector.addGoal(6, new RandomStrollGoal(this, 0.8));
  }
}

export default CowMob;
