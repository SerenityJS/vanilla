import {
  Block,
  BlockContainer,
  BlockIdentifier,
  BlockInteractionOptions,
  BlockTrait,
  Player,
} from "@serenityjs/core";
import {
  ContainerId,
  ContainerType,
  EnchantOption,
  PlayerEnchantOptionsPacket,
} from "@serenityjs/protocol";

// TODO: Implement enchantment RNG
class EnchantingTableTrait extends BlockTrait {
  public static readonly identifier = "minecraft:enchanting_table";
  public static readonly types: Array<BlockIdentifier> = [
    BlockIdentifier.EnchantingTable,
  ];

  private inUi?: Player;

  private container: BlockContainer;

  public constructor(block: Block) {
    super(block);

    this.container = new BlockContainer(
      block,
      ContainerType.Enchantment,
      ContainerId.Ui,
      2
    );
  }

  public onInteract(options: BlockInteractionOptions): boolean | void {
    // Get the player from the interaction options.
    const player = options.origin;
    if (!(player instanceof Player)) return;

    this.container.show(player);
    this.inUi = player;
    const enchantOptionsPacket = new PlayerEnchantOptionsPacket();
    enchantOptionsPacket.enchantOptions = [];

    player.send(enchantOptionsPacket);
  }

  public onTick(): void {
    if (this.block.world.currentTick % 20n != 0n || !this.inUi) return;
    const item = this.container.getItem(0);

    if (item && this.container.getItem(1)) {
      this.sendEnchantOptions(this.inUi, [
        new EnchantOption(
          1,
          16,
          [],
          [{ id: 9, level: 1 }],
          [],
          "mental galvanize elemental ",
          233
        ),
      ]);
    }
  }

  private sendEnchantOptions(player: Player, options: Array<EnchantOption>) {
    const enchantOptionsPacket = new PlayerEnchantOptionsPacket();
    enchantOptionsPacket.enchantOptions = options;
    player.send(enchantOptionsPacket);
  }
}

export { EnchantingTableTrait };
