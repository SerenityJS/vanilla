import { Plugin } from "@serenityjs/plugins";

import { IVanillaModule } from "../../../types";

import { GroundMobNavigation } from "./navigation/ground";
import { MOBS } from "./mobs";
import { EntityIdentifier, EntityType } from "@serenityjs/core";

class MobModule implements IVanillaModule {
  public readonly name: string = "Mobs";

  public load(plugin: Plugin): void {
    // Register all mob traits
    for (const MOB of MOBS) plugin.entities.registerTrait(MOB);

    // Register ground mob navigation
    plugin.entities.registerTrait(GroundMobNavigation);

    // List of mobs that have climate variants
    const climateVariantMobs = [
      EntityIdentifier.Cow,
      EntityIdentifier.Chicken,
      EntityIdentifier.Pig,
    ];
    // Create climate variant property for each mob type
    for (const identifier of climateVariantMobs) {
      const type = EntityType.get(identifier);
      if (!type) continue;
      type.createEnumProperty(
        "minecraft:climate_variant",
        ["cold", "temperate", "warm"],
        "temperate"
      );
    }
  }
}

export default new MobModule();
