import { Plugin } from "@serenityjs/plugins";

import { IVanillaModule } from "../../types";

import TestingCommand from "./testing";
import { WorldEvent, WorldInitializeSignal } from "@serenityjs/core";

class CommandsModule implements IVanillaModule {
  public readonly name: string = "command";

  public load(plugin: Plugin): void {
    plugin.serenity.on(
      WorldEvent.WorldInitialize,
      this.onWorldInitialize.bind(this)
    );
  }

  /**
   * Handles the WorldInitialize event.
   * @param event The WorldInitialize event.
   */
  private onWorldInitialize(event: WorldInitializeSignal): void {
    TestingCommand.load(event.world);
  }
}

export default new CommandsModule();
