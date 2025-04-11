import {
  Entity,
  EntityIdentifier,
  EntityInteractMethod,
  EntityMovementTrait,
  EntityTrait,
  Player
} from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";

import { GoalSelector } from "./ai/goals/goal-selector";
import { GroundMobNavigation } from "./navigation/ground";
import { LookAtControl } from "./control/look";

// ? Mob stands for AI Entity.

class MobEntityTrait extends EntityTrait {
  protected readonly goalSelector: GoalSelector = new GoalSelector();

  public readonly navigation: GroundMobNavigation;

  public readonly movement: EntityMovementTrait;

  public readonly lookAtControl: LookAtControl;

  public target?: Entity;

  public noActionTime: bigint = 0n;

  public constructor(entity: Entity) {
    super(entity);
    this.movement = entity.addTrait(EntityMovementTrait);
    this.navigation = entity.addTrait(GroundMobNavigation);
    this.lookAtControl = new LookAtControl(this);
  }

  public onTick(): void {
    this.noActionTime++;
    const currentTick = this.entity.world.currentTick;

    if (currentTick % 2n == 0n) {
      this.goalSelector.onTick();
    } else {
      this.goalSelector.tickGoals(false);
    }
    this.lookAtControl.onTick();
  }

  public onInteract(_: Player, method: EntityInteractMethod): void {
    if (method != EntityInteractMethod.Attack) return;
    this.noActionTime = 0n;
  }

  public getEntity(): Entity {
    return this.entity;
  }

  public getNearest(
    type: EntityIdentifier,
    center: Vector3f,
    predicate?: (entity: Entity) => boolean
  ): Entity | undefined {
    let nearest: Entity | undefined;
    let distance: number = Infinity;

    for (const entity of this.entity.dimension.getEntities()) {
      if (entity.type.identifier !== type) continue;
      const distanceToCenter = entity.position.distance(center);

      if (distanceToCenter > distance || !predicate?.(entity)) continue;
      distance = distanceToCenter;
      nearest = entity;
    }
    return nearest;
  }
}

export { MobEntityTrait };
