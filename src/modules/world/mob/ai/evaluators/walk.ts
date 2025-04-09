import { Node, NodeEvaluator, Entity } from "@serenityjs/core";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { Vector2f, Vector3f } from "@serenityjs/protocol";

class WalkEvaluator extends NodeEvaluator {
  private entityBounds: Vector2f;

  private logger = new Logger("WalkEvaluator", LoggerColors.Green);

  public constructor(entity: Entity) {
    super(entity);

    this.entityBounds = new Vector2f(
      Math.round(entity.hitboxWidth - 1),
      Math.round(entity.hitboxHeight - 1)
    );

    console.log(this.entityBounds);
  }

  public *getNeighbors(node: Node): Generator<Node> {
    for (let nx = -1; nx <= 1; nx++) {
      for (let nz = -1; nz <= 1; nz++) {
        const offset = new Vector3f(nx, 0, nz);
        const neighbor = new Node(node.add(offset));
        const neighborBlock = this.getBlock(neighbor);

        // If the neighbor is solid then try to use the node above it if its valid
        if (neighborBlock.isSolid) {
          const aboveNode = new Node(neighbor.add(new Vector3f(0, 1, 0)));
          // Try to jump

          if (!this.checkForCollisions(aboveNode)) continue;
          /* this.logger.info(
            `Adding above: ${aboveNode.x}, ${aboveNode.y}, ${aboveNode.z}`
          ); */
          yield aboveNode;
        } else if (!neighborBlock.isSolid && !neighborBlock.below().isSolid) {
          // Try to fall through
          let belowNode = new Node(neighbor.subtract(new Vector3f(0, 1, 0)));

          if (!this.getBlock(belowNode).isSolid) {
            const floor = this.getBlock(belowNode).below();
            const floorNode = Node.fromPosition(floor.position);

            if (!floor.isSolid) belowNode = floorNode;
            // ? Add additional damage for fall damage
            belowNode.gCost += 3;
          }
          if (!this.checkForCollisions(belowNode)) continue;
          /* this.logger.info(
            `Adding below: ${belowNode.x}, ${belowNode.y}, ${belowNode.z}`
          ); */

          yield belowNode;
        }
        if (
          !this.checkForCollisions(neighbor) ||
          !this.getBlock(neighbor).below().isSolid
        ) {
          continue;
        }
        /* this.logger.info(
          `Adding inline: ${neighbor.x}, ${neighbor.y}, ${neighbor.z}`
        ); */
        yield neighbor;
      }
    }
  }

  private checkForCollisions(node: Node): boolean {
    for (let ny = 0; ny <= this.entityBounds.y; ny++) {
      for (let nx = 0; nx <= this.entityBounds.x; nx++) {
        for (let nz = 0; nz <= this.entityBounds.x; nz++) {
          const offset = new Vector3f(nx, ny, nz);
          const block = this.entity.dimension.getBlock(node.add(offset));

          if (block.isSolid) return false;
        }
      }
    }
    return true;
  }
}

export { WalkEvaluator };
