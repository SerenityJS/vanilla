import {
  Entity,
  EntityIdentifier,
  EntityInventoryTrait,
  ItemIdentifier,
  Player
} from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";

import { MobEntityTrait } from "../../mob";

import { Goal, GoalType } from "./goal";

class TemptGoal extends Goal {
  private mob: MobEntityTrait;

  private entity: Entity;

  private speedModifier: number;

  private calmTimer: number;

  private items: Array<ItemIdentifier>;

  private player?: Player;

  public readonly types: Set<GoalType> = new Set([
    GoalType.Move,
    GoalType.Look
  ]);

  public constructor(
    mob: MobEntityTrait,
    speedModifier: number,
    items: Array<ItemIdentifier>
  ) {
    super();
    this.mob = mob;
    this.entity = mob.getEntity();
    this.speedModifier = speedModifier;
    this.items = items;
    this.calmTimer = 0;
  }

  public get canUse(): boolean {
    if (this.calmTimer == 0) {
      this.player = this.mob.getNearest(
        EntityIdentifier.Player,
        this.entity.position,
        this.itemTemptPredicate.bind(this)
      ) as Player;
      return this.player !== undefined;
    }
    this.calmTimer--;
    return false;
  }

  public get canStillUse(): boolean {
    // TODO: Add scare check
    return this.canUse;
  }

  public onTick(): void {
    if (!this.player) return;
    const distanceToTarget = this.entity.position.distance(
      this.player?.position
    );

    if (distanceToTarget < 2.5) return this.mob.navigation.stop();
    this.mob.movement.currentValue *= this.speedModifier;
    const end = this.player.position
      .subtract(new Vector3f(0, this.player.hitboxHeight - 0.2, 0))
      .floor();

    /* this.mob.lookAtControl.setTarget(this.player, 1, 40); */
    this.mob.navigation.moveTo(end);
  }

  public onStop(): void {
    this.mob.navigation.stop();
    this.mob.movement.reset();
    this.calmTimer = 50;
  }

  private itemTemptPredicate(entity: Entity) {
    const playerInventory = entity.getTrait(EntityInventoryTrait);
    const selectedItem = playerInventory.getHeldItem();

    if (!selectedItem) return false;
    const selectedItemType = selectedItem.identifier;
    return this.items.some((itemType) => selectedItemType == itemType);
  }
}

export { TemptGoal };
