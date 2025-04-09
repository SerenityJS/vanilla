import { Entity, EntityMovementTrait } from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";

import { MobEntityTrait } from "../../mob";

import { Goal, GoalType } from "./goal";

class PanicGoal extends Goal {
  public readonly mob: MobEntityTrait;

  private entity: Entity;

  public speedModifier: number;

  private target?: Vector3f;

  public readonly types: Set<GoalType> = new Set([GoalType.Move]);

  public constructor(mob: MobEntityTrait, speedModifier: number) {
    super();
    this.mob = mob;
    this.entity = mob.getEntity();
    this.speedModifier = speedModifier;
  }

  public onStart(): void {
    const entityMovementTrait = this.entity.getTrait(EntityMovementTrait);

    if (!this.mob.navigation || !this.target) return;
    entityMovementTrait.currentValue *= this.speedModifier;

    this.mob.navigation.moveTo(this.target);
  }

  public get canUse(): boolean {
    // TODO: detect if the entity is on fire to look for water
    if (!this.shouldPanic()) return false;
    this.target = this.getRandomPosition(10, 10);
    return true;
  }

  public get canStillUse(): boolean {
    return !this.mob.navigation.isDone();
  }

  public onStop(): void {
    const entityMovementTrait = this.entity.getTrait(EntityMovementTrait);

    if (!entityMovementTrait) return;
    entityMovementTrait.currentValue = entityMovementTrait.defaultValue;
  }

  private getRandomPosition(maxX: number, maxZ: number): Vector3f {
    return new Vector3f(
      Math.random() * maxX + 5,
      this.entity.position.y - this.entity.hitboxHeight,
      Math.random() * maxZ + 5
    ).floor();
  }

  private shouldPanic(): boolean {
    return this.entity.lastAttacker !== null;
  }
}

export { PanicGoal };
