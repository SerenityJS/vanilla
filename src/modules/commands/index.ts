import { Plugin } from "@serenityjs/plugins";

import { IVanillaModule } from "../../types";

import TestingCommand from "./testing";

class CommandsModule implements IVanillaModule {
  public readonly name: string = "command";

  public load(plugin: Plugin): void {
    const commandPallete = plugin.serenity.commandPalette;
    TestingCommand.load(commandPallete);
  }
}

export default new CommandsModule();
