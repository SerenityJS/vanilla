import {
  Astar,
  EntityMovementTrait,
  EntityTrait,
  Node
} from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";

import { WalkEvaluator } from "../ai";

class GroundMobNavigation extends EntityTrait {
  public static readonly identifier: string = "minecraft:navigation.ground";

  private path: Array<Node> = [];

  private currentNode?: Node;

  public moveTo(position: Vector3f): void {
    this.path = this.computePath(new Node(position));
    this.currentNode = this.path.shift();
  }

  public onTick(): void {
    if (this.isDone() || !this.currentNode) return;
    const entityMovementTrait = this.entity.getTrait(EntityMovementTrait);

    if (entityMovementTrait?.positionTarget !== null) return;

    entityMovementTrait.moveTowards(this.currentNode);

    this.currentNode = this.path.shift();
  }

  public stop(): void {
    this.path = [];
    this.currentNode = undefined;
  }

  public isDone(): boolean {
    return this.path.length == 0;
  }

  public computePath(end: Node): Array<Node> {
    const nodeEvaluator = new WalkEvaluator(this.entity);
    const pathfinder = new Astar(nodeEvaluator);

    const startTime = performance.now();
    const start = this.entity.position.floor();
    const path = pathfinder.findPath(new Node(start), end, 59);
    const endTime = performance.now();
    console.log(`Pathfinding took ${endTime - startTime}ms`);
    return path;
  }
}

export { GroundMobNavigation };
