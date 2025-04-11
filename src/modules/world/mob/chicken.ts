import { Entity, ItemIdentifier } from "@serenityjs/core";

import { PanicGoal } from "./ai/goals/panic";
import { TemptGoal } from "./ai/goals/tempt";
import { RandomStrollGoal } from "./ai/goals/random-stroll";
import { MobEntityTrait } from "./mob";

class ChickenMob extends MobEntityTrait {
  public static readonly identifier: string = "minecraft:chicken";

  public constructor(entity: Entity) {
    super(entity);
    this.goalSelector.addGoal(1, new PanicGoal(this, 1.5));

    this.goalSelector.addGoal(
      4,
      new TemptGoal(this, 1, [
        ItemIdentifier.Wheat,
        ItemIdentifier.BeetrootSoup,
        ItemIdentifier.MelonSeeds,
        ItemIdentifier.PumpkinSeeds
      ])
    );

    this.goalSelector.addGoal(6, new RandomStrollGoal(this, 1));
  }
}

export default ChickenMob;
