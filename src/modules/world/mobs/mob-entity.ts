import {
  Entity,
  EntityIdentifier,
  EntityInteractMethod,
  EntityMovementTrait,
  EntityTrait,
  Player,
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

  /**
   * Gets the entity associated with this mob.
   * @returns The entity associated with this mob.
   */
  public getEntity(): Entity {
    return this.entity;
  }

  /**
   * Sets the climate variant property based on the biome the entity is in.
   */
  public setClimateVariant(): void {
    const entity = this.getEntity();
    // Get the chunk the entity is in
    const entityChunk = entity.getChunk();
    // Get the biome at the entity's position
    const biome = entityChunk.getBiome(entity.position);

    // Set the climate variant property based on the biome
    // TODO: Expand this to cover all biomes
    switch (biome) {
      default:
        //entity.setSharedProperty("minecraft:climate_variant", "temperate");

        // Add a random climate variant for default biomes
        // TODO: Remove this later, just for testing purposes
        const temperatures = ["temperate", "cold", "warm"];
        const randomIndex = Math.floor(Math.random() * temperatures.length);
        entity.setSharedProperty(
          "minecraft:climate_variant",
          temperatures[randomIndex]!
        );
    }
  }

  /**
   * Gets the entity associated with this mob.
   * @param type The type of entity to find.
   * @param center The center position to search around.
   * @param predicate An optional predicate to filter entities.
   * @returns The nearest entity of the specified type, or undefined if none is found.
   */
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
