import { Plugin } from "@serenityjs/plugins";

import { IVanillaModule } from "../../../types";

class BlocksModule implements IVanillaModule {
  public readonly name: string = "block";

  public load(plugin: Plugin): void {
    // TODO: Here we will load all the blocks,
    // since the dynamic imports get sketchy, we'll need to import and load every block behavior.
  }
}

export default new BlocksModule();
