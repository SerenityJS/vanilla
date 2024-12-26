import {
  Block,
  BlockIdentifier,
  BlockPermutation,
  BlockTrait,
  BlockType
} from "@serenityjs/core";
import { BlockPosition, Vector3f } from "@serenityjs/protocol";

// TODO: Clean up
// TODO's: Read fluid-roadmap.txt

class BlockFluidTrait extends BlockTrait {
  public static readonly identifier = "fluid";

  public static types = [
    BlockIdentifier.Water,
    BlockIdentifier.Lava,
    BlockIdentifier.FlowingWater,
    BlockIdentifier.FlowingLava
  ];

  private static readonly HorizontalOffsets = [
    new Vector3f(1, 0, 0),
    new Vector3f(-1, 0, 0),
    new Vector3f(0, 0, 1),
    new Vector3f(0, 0, -1)
  ];

  /**
   * Wether or not the block is a type of flow source
   */
  public isSource: boolean = false;

  /**
   * The main flow source (the first water block that was placed)
   */
  public flowSource?: BlockPosition;

  /**
   * The secondary flow source (Different thatn the flow source if the water found a fall)
   */
  public source?: BlockPosition;

  /**
   * The max distance the liquid will spread
   */
  public maxFlowDistance = 7;

  /**
   * The flow block used to create the flow
   */
  public flowingType?: BlockIdentifier;

  /**
   * The viscosity factor of the fluid, the formula is viscosity * 20
   * @note The viscosity is measured in seconds
   */
  public viscosity: number = 0.25;

  /**
   * The flow blocks of the block
   */
  private spreadBlocks: Set<BlockPosition> = new Set();

  private spreadQueue: Map<BlockPosition, FlowOptions> = new Map();

  /**
   * Wether or not we can place flowing blocks
   */
  private inTimeout: boolean = false;

  public constructor(block: Block) {
    super(block);

    if (block.identifier.includes("lava")) {
      this.maxFlowDistance = 3;
      this.viscosity = 1.5;
    }

    if (
      block.identifier != BlockIdentifier.Water &&
      block.identifier != BlockIdentifier.Lava
    )
      return;
    this.isSource = true;
    this.flowSource = block.position;
    this.source = this.flowSource;
  }

  /* public onReplace(): void {
    if (this.flowSource?.equals(this.block.position)) {
      this.removeFlow();
    }
  } */

  public onTick(): void {
    // ? If a flowing type was not established, then return
    if (!this.flowingType) return;
    // ? If a flowing block appeared and has not a source, then remove the flowing block.
    if (
      !this.flowSource ||
      this.block.dimension.getBlock(this.flowSource).isSolid
    ) {
      return;
    } else this.spreadLogic();
    // ? Compute the ticks per block flow

    // ? Get the blocks in the queue
    for (const position of this.getQueue()) {
      const options = this.spreadQueue.get(position)!;
      const block = this.block.dimension.getBlock(position);

      if (block.isSolid) continue;
      /* if (options.empty) {
        this.block.type = BlockType.get(BlockIdentifier.Air);
        // ? Set the flowing blocks
      } else */ this.setFluid(block, options);
      // ? Remove the block from the queue.
      this.spreadQueue.delete(position);
    }
  }

  private *getQueue(): Generator<BlockPosition> {
    const ticksPerBlock = BigInt(this.viscosity * 20);
    const currentTick = this.block.world.currentTick;
    // ? Check if we are on timeout

    // ? If we can't spread in this tick, add timeout
    if (this.inTimeout && currentTick % ticksPerBlock == 0n)
      this.inTimeout = false;
    else this.inTimeout = true;
    if (this.inTimeout) return;

    // ? Sort the blocks and yield them
    const sorted = Array.from(this.spreadQueue.keys()).sort(
      (a, b) =>
        this.manhattan(a, this.source!) - this.manhattan(b, this.source!)
    );

    yield* sorted;
  }

  private spreadHorizontally(isOnGround: boolean): void {
    // ? Get the spread blocks, wether or not the block is on the ground

    for (const spreadBlock of this.getSpreadBlocks(isOnGround)) {
      // ? Set the flowing block.
      this.spreadQueue.set(spreadBlock, {
        type: this.flowingType!,
        depth: this.manhattan(this.block.position, this.source!)
      });
    }
  }

  private spreadLogic(): void {
    // ? Get the block under this block.
    const underBlock = this.block.below();

    if (!underBlock.isSolid) {
      // ? If the block is not solid (This means we need to go down in Y-axis)
      if (this.isSource) {
        if (underBlock.isLiquid && underBlock.identifier != this.flowingType) {
          // Vertical collision
          return this.onFluidCollision(underBlock.position);
        }
        this.spreadHorizontally(false); // ? Only the source blocks can spread in first Y axis
      }
      const flowingOptions: FlowOptions = {
        type: this.flowingType!,
        depth: 10
      };

      if (
        this.manhattan(underBlock.position, this.source!) ==
        this.maxFlowDistance
      ) {
        flowingOptions.flowingSource = this.flowSource;
        flowingOptions.source = underBlock.position;
        flowingOptions.isSource = true;
      }
      this.spreadQueue.set(underBlock.position, flowingOptions);
      return;
    }

    // TODO: Liquid pathfinding
    // ? If the block is solid, then we want the block to spread horizontally
    this.spreadHorizontally(true);
  }

  public *getSpreadBlocks(isOnGround: boolean): Generator<BlockPosition> {
    const position = this.block.position;

    // ? Get the neighbor offsets
    for (const offset of BlockFluidTrait.HorizontalOffsets) {
      // ? Get the neighbor block
      const block = this.block.dimension.getBlock(position.add(offset));

      // ? If the block is a liquid or a solid block, we cant spread
      if (
        block.isLiquid &&
        block.identifier != this.flowingType &&
        this.block.dimension.getBlock(this.flowSource!).identifier !=
          block.identifier
      ) {
        // Horizontal fluid collision
        this.onFluidCollision(block.position);
        continue;
      } else if (block.isLiquid && block.identifier == this.flowingType) {
        const fluidTrait = block.getTrait(BlockFluidTrait);

        if (
          !fluidTrait.source?.equals(this.source!) &&
          !fluidTrait.isSource &&
          this.isSource
        ) {
          // A middle block with different source? Make it a full block!
          this.setFluid(block, {
            depth: 0,
            type: this.block.identifier,
            isSource: true,
            flowingSource: block.position
          });
          continue;
        }
      }
      if (block.isSolid || block.isLiquid) continue;
      // ? If the block is not a source and is not in the ground or the distance is more than the maximum spread distance, return
      if (
        (!this.isSource && !isOnGround) ||
        this.manhattan(block.position, this.source!) > this.maxFlowDistance
      )
        continue;
      // ? Yield the block position
      yield block.position;
    }
  }

  /**
   * Set's a flowing block in the provided position and options.
   * @param position The block position where the flowing block will be placed
   * @param options The options for the flowing block
   */
  private setFluid(block: Block, options: FlowOptions): void {
    const { depth, source, flowingSource, isSource, type } = options;

    block.setPermutation(
      BlockPermutation.resolve(type, {
        liquid_depth: depth
      })
    );

    const fluidTrait = block.getTrait(BlockFluidTrait);
    fluidTrait.source = isSource ? block.position : (source ?? this.source);
    fluidTrait.isSource = isSource ?? false;
    fluidTrait.flowSource = flowingSource ?? this.flowSource;
    fluidTrait.flowingType = this.flowingType;

    this.spreadBlocks.add(block.position);
  }

  private manhattan(position: BlockPosition, position2: BlockPosition): number {
    const distance = position.subtract(position2).absolute();

    return distance.x + distance.z;
  }

  public onFluidCollision(intersection: BlockPosition): void {
    const block = this.block.dimension.getBlock(intersection);

    block.type = BlockType.get(BlockIdentifier.Cobblestone);
  }
}

interface FlowOptions {
  depth: number;
  type: BlockIdentifier;
  source?: BlockPosition;
  isSource?: boolean;
  flowingSource?: BlockPosition;
}

export { BlockFluidTrait };
