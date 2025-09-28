import { Entity, EntityMovementTrait } from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";

import { MobEntityTrait } from "../../mob-entity";

import { Goal, GoalType } from "./goal";

class RandomStrollGoal extends Goal {
  private readonly entity: Entity;

  private mob: MobEntityTrait;

  private interval: number = 0;

  private speedModifier: number = 0;

  private targetPosition?: Vector3f;

  private checkNoActionTime: boolean;

  private forceTrigger: boolean = false;

  public types: Set<GoalType> = new Set([GoalType.Move]);

  public constructor(
    mob: MobEntityTrait,
    speedModifier: number,
    interval: number = 120,
    checkNoActionTime: boolean = false
  ) {
    super();
    this.entity = mob.getEntity();
    this.mob = mob;

    this.speedModifier = speedModifier;
    this.interval = interval;
    this.checkNoActionTime = checkNoActionTime;
  }

  public onStart(): void {
    const movementTrait = this.entity.getTrait(EntityMovementTrait);

    if (!this.mob.navigation || !this.targetPosition) return;
    movementTrait.currentValue = this.speedModifier;
    this.mob.navigation.moveTo(this.targetPosition);
  }

  public onStop(): void {
    const movementTrait = this.entity.getTrait(EntityMovementTrait);

    if (!this.mob.navigation || !movementTrait) return;
    movementTrait.reset();
    this.mob.navigation.stop();
  }

  public get canUse(): boolean {
    if (!this.forceTrigger) {
      if (this.checkNoActionTime && this.mob.noActionTime >= 100) return false;
      if (Math.floor(Math.random() * Math.ceil(this.interval / 2)) != 0)
        return false;
    }
    const random = this.getRandomPosition(15, 12);
    this.targetPosition = random;
    this.forceTrigger = false;
    return true;
  }

  public get canStillUse(): boolean {
    return !this.mob.navigation.isDone();
  }

  private getRandomPosition(maxX: number, maxZ: number): Vector3f {
    return new Vector3f(
      Math.random() * maxX + maxX / 2,
      this.entity.position.y,
      Math.random() * maxZ + maxZ / 2
    ).floor();
  }

  public trigger(): void {
    this.forceTrigger = true;
  }
}

export { RandomStrollGoal };
