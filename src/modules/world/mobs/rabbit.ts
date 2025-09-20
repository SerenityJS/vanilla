import { Entity, EntityIdentifier, ItemIdentifier } from "@serenityjs/core";

import { MobEntityTrait } from "./mob-entity";
import { PanicGoal } from "./ai/goals/panic";
import { TemptGoal } from "./ai/goals/tempt";

class RabbitMob extends MobEntityTrait {
  public static readonly identifier: string = "minecraft:rabbit";

  public static readonly types: Array<EntityIdentifier> = [
    EntityIdentifier.Rabbit,
  ];

  public constructor(entity: Entity) {
    super(entity);
    this.goalSelector.addGoal(1, new PanicGoal(this, 2.2));
    this.goalSelector.addGoal(
      3,
      new TemptGoal(this, 1, [
        ItemIdentifier.GoldenCarrot,
        ItemIdentifier.Carrot,
        ItemIdentifier.Dandelion,
      ])
    );
    // Weird shit goin on with the rabbit random stroll
  }
}

export default RabbitMob;
