import {
  Entity,
  EntityIdentifier,
  EntityMovementTrait
} from "@serenityjs/core";

import { MobEntityTrait } from "../../mob";

import { Goal, GoalType } from "./goal";

class LookAtGoal extends Goal {
  /**
   * The entity whose will look at the entity target
   */
  public entity: Entity;

  /**
   * The probability of looking at one target
   */
  public probability: number;

  /**
   * The target entity type the entity will look at
   */
  public targetType: EntityIdentifier;

  /**
   * The target entity that the entity will look at
   */
  public target?: Entity;

  /**
   * This is the max distance the entity will look at the target
   */

  public maxDistance: number;

  /**
   * Look at is the maximum time the entity will look at the target
   */
  public lookTime: number = 0;

  public types: Set<GoalType> = new Set([GoalType.Look]);

  private mob: MobEntityTrait;

  public constructor(
    mob: MobEntityTrait,
    targetType: EntityIdentifier,
    probability: number,
    maxDistance: number
  ) {
    super();
    this.mob = mob;
    this.entity = mob.getEntity();
    this.targetType = targetType;
    this.probability = probability;
    this.maxDistance = maxDistance;
  }

  public get canUse(): boolean {
    if (Math.random() >= this.probability || !this.entity.isAlive) return false;
    // TODO: If mob ai has a target then we need to use the attack target as the look at target.
    this.target = this.mob.getNearest(this.targetType, this.entity.position);

    return this.target != undefined;
  }

  public get canStillUse(): boolean {
    if (!this.target?.isAlive) return false;
    const distanceToTarget = this.target.position.distance(
      this.entity.position
    );

    return distanceToTarget < this.maxDistance && this.lookTime > 0;
  }

  public onStart(): void {
    this.lookTime = Math.ceil((40 + Math.floor(Math.random() * 40)) / 2);
  }

  public onTick(): void {
    if (!this.target || this.lookTime <= 0) return;
    const movementTrait = this.entity.getTrait(EntityMovementTrait);

    if (!movementTrait) return;
    movementTrait.lookAt(this.target.position);
    this.lookTime--;
  }
}

export { LookAtGoal };
