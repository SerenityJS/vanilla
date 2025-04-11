import { Entity, EntityIdentifier, ItemIdentifier } from "@serenityjs/core";

import { PanicGoal } from "./ai/goals/panic";
import { RandomStrollGoal } from "./ai/goals/random-stroll";
import { TemptGoal } from "./ai/goals/tempt";
import { MobEntityTrait } from "./mob";

class PigTrait extends MobEntityTrait {
  public static readonly identifier = "minecraft:pig";

  public static readonly types: Array<EntityIdentifier> = [
    EntityIdentifier.Pig
  ];

  public constructor(entity: Entity) {
    super(entity);

    this.goalSelector.addGoal(1, new PanicGoal(this, 0.4));
    this.goalSelector.addGoal(
      4,
      new TemptGoal(this, 1.2, [
        ItemIdentifier.Carrot,
        ItemIdentifier.CarrotOnAStick
      ])
    );
    this.goalSelector.addGoal(6, new RandomStrollGoal(this, 0.1));

    /* this.goalSelector.addGoal(
      7,
      new LookAtGoal(entity, EntityIdentifier.Player, 0.02, 6)
    ); */
  }
}

export default PigTrait;
