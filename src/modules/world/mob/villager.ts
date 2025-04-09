import {
  Entity,
  EntityContainer,
  EntityIdentifier,
  EntityInteractMethod,
  EntityTrait,
  Player
} from "@serenityjs/core";
import {
  ActorDataId,
  ActorDataType,
  ContainerId,
  ContainerType,
  DataItem,
  TradeOffer,
  UpdateTradePacket
} from "@serenityjs/protocol";

// TODO: Implement villager gain experience, gain trade tier
class VillagerTrait extends EntityTrait {
  public static readonly identifier = "villager_trait";

  public static readonly types: Array<EntityIdentifier> = [
    EntityIdentifier.VillagerV2
  ];

  private trades: Set<TradeOffer> = new Set();

  private container: EntityContainer;

  public constructor(entity: Entity) {
    super(entity);
    this.container = new VillagerContainer(this.entity);

    entity.metadata.set(
      ActorDataId.TradeTier,
      new DataItem(ActorDataId.TradeTier, ActorDataType.Int, 0)
    );
    entity.metadata.set(
      ActorDataId.MaxTradeTier,
      new DataItem(ActorDataId.MaxTradeTier, ActorDataType.Int, 4)
    );
    entity.metadata.set(
      ActorDataId.TradeExperience,
      new DataItem(ActorDataId.TradeExperience, ActorDataType.Int, 0)
    );
  }

  public onInteract(player: Player, method: EntityInteractMethod): void {
    if (method !== EntityInteractMethod.Interact) return;
    player.openedContainer = this.container;
    this.container.occupants.add(player);
    this.openTradeScreen(player);
  }

  public addOffer(offer: TradeOffer): void {
    this.trades.add(offer);
  }

  public removeOffer(offer: TradeOffer): void {
    this.trades.delete(offer);
  }

  public openTradeScreen(player: Player) {
    const packet = new UpdateTradePacket();
    packet.windowId = ContainerId.None;
    packet.containerType = ContainerType.Trading;
    packet.size = 0;
    packet.tradeTier = 0;
    packet.playerTradingUnique = player.runtimeId;
    packet.tradeActorUnique = this.entity.uniqueId;
    packet.useNewUI = true;
    packet.economyTrade = true;
    packet.displayName = "Test";
    packet.offers = Array.from(this.trades);
    player.send(packet);
  }
}

class VillagerContainer extends EntityContainer {
  public constructor(entity: Entity) {
    super(entity, ContainerType.Trading, ContainerId.None, 1);
  }

  public update(): void {
    return;
  }
}

export { VillagerTrait };
