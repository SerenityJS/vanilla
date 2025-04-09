import {
  /* Astar,
  BlockIdentifier,
  BlockPermutation,
  EntityIdentifier,
  EntityMovementTrait,
  ItemIdentifier,
  ItemStack,
  ItemTrait,
  ItemUseOptions,
  Node,
  Player,
  StringEnum, */
  WorldEvent
} from "@serenityjs/core";
import { Plugin, PluginEvents } from "@serenityjs/plugins";
/* import {
  ActorDataId,
  ActorDataType,
  ActorFlag,
  ActorLink,
  ActorLinkType,
  DataItem,
  SetActorLinkPacket,
  TradeOffer,
  Vector3f
} from "@serenityjs/protocol"; */

/* import { WalkEvaluator } from "./mob"; */
/* import {
  FluidSourceBlockTrait,
  FluidFlowBlockTrait,
  VillagerTrait
} from "./world";
 */
class VanillaPlugin extends Plugin implements PluginEvents {
  public constructor() {
    super("vanilla", "1.0.0");
  }

  public onInitialize(): void {}

  public onStartUp(plugin: Plugin): void {
    this.logger.info("Vanilla plugin started");
    plugin.serenity.worlds.forEach((world) => {
      /* world.commandPalette.register(
        "testing",
        "Testing command",
        (overloader) => {
          overloader.overload(
            {
              test: StringEnum
            },
            async ({ origin, test }) => {
              if (!(origin instanceof Player)) return;
              switch (test.result) {
                case "pathfinder": {
                  await this.pathFindingTest(origin);
                  break;
                }
                case "riding": {
                  await this.ridingTest(origin);
                  break;
                }
                case "lava": {
                  const block = origin.dimension.getBlock(
                    origin.position.floor()
                  );

                  block.setPermutation(
                    BlockPermutation.resolve(BlockIdentifier.Lava)
                  );

                  block.getTrait(FluidSourceBlockTrait).flowBlockType =
                    BlockIdentifier.FlowingLava;
                  break;
                  /* block.addTrait(BlockFluidTrait); 
                }

                case "villager": {
                  const villager = origin.dimension.spawnEntity(
                    EntityIdentifier.VillagerV2,
                    origin.position.floor()
                  );
                  const trait = villager.getTrait(VillagerTrait);

                  trait.addOffer(
                    new TradeOffer(
                      new ItemStack(ItemIdentifier.Coal, {
                        amount: 4
                      }).nbt.toCompound("buyA"),
                      null,
                      new ItemStack(ItemIdentifier.Emerald, {
                        amount: 2
                      }).nbt.toCompound("sell"),
                      14,
                      1,
                      0,
                      1
                    )
                  );
                  break;
                }

                case "sleep": {
                  origin.metadata.set(
                    ActorDataId.PlayerFlags,
                    new DataItem(
                      ActorDataId.PlayerFlags,
                      ActorDataType.Byte,
                      0x2
                    )
                  );
                  break;
                }

                case "water": {
                  const block = origin.dimension.getBlock(
                    origin.position.floor().subtract(new Vector3f(0, 1, 0))
                  );

                  block.setPermutation(
                    BlockPermutation.resolve(BlockIdentifier.Water)
                  );

                  const fluid = block.getTrait(FluidSourceBlockTrait);
                  fluid.flowBlockType = BlockIdentifier.FlowingWater;
                  fluid.onPlace();
                  break;
                  /* block.addTrait(BlockFluidTrait); 
                }
              }
              return { message: "Done" };
            }
          );
        },
        () => {}
      );
    }); */

      this.serenity.before(WorldEvent.PlayerDropItem, () => {
        return false;
      });
    });
  }

  /* private async pathFindingTest(origin: Player) {
    if (!(origin instanceof Player)) return;

    const start = origin.position.floor().subtract(new Vector3f(0, 1, 0));

    // The entity is spawning at the same Y position as the end
    const entity = origin.dimension.spawnEntity(
      EntityIdentifier.Creeper,
      origin.position.floor() // -60
    );

    console.warn(origin.position.floor());

    entity.nameTag = "Pathfinding test";
    entity.alwaysShowNameTag = true;
    const evaluator = new WalkEvaluator(entity);

    cons  t movement = entity.getTrait(EntityMovementTrait);

    const pathfinder = new Astar(evaluator);
    await this.sleep(10);
    const end = origin.position.floor().subtract(new Vector3f(0, 1, 0));

    const startT = performance.now();

    const path = pathfinder.findPath(new Node(start), new Node(end), 40);

    console.log(`Path found in ${performance.now() - startT}ms`);
    let currentNodeIndex = 0;
    let currentNode = path[currentNodeIndex];

    while (entity.position.distance(end) > 0.5) {
      await this.sleep(2 / 20);
      console.log(`Distance to end`, entity.position.distance(end));
      if (!currentNode) break;

      if (movement.positionTarget !== null) continue;
      const block = origin.dimension.getBlock(currentNode);
      block.setPermutation(
        BlockPermutation.resolve(BlockIdentifier.StructureVoid)
      );

      movement.moveTowards(currentNode);
      movement.lookAt(origin.position);
      currentNodeIndex++;
      currentNode = path[currentNodeIndex];
    }
  } */

  private async sleep(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}

export default new VanillaPlugin();
