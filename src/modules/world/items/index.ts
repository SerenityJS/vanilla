import { Plugin } from "@serenityjs/plugins";

import { IVanillaModule } from "../../../types";

class ItemModule implements IVanillaModule {
  public readonly name = "Items";

  public load(plugin: Plugin): void {
    /* plugin.items.registerTrait(ItemPathFinderTrait); */
  }
}

export default new ItemModule();
