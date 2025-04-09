import { Plugin } from "@serenityjs/plugins";

import { IVanillaModule } from "../../../types";

import PigTrait from "./pig";
import { GroundMobNavigation } from "./navigation/ground";

class MobModule implements IVanillaModule {
  public readonly name: string = "mob";

  public load(plugin: Plugin): void {
    plugin.entities.registerTrait(PigTrait);
    plugin.entities.registerTrait(GroundMobNavigation);
  }
}

export default new MobModule();
