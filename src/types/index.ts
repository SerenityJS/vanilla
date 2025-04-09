import { CommandPalette } from "@serenityjs/core";
import { Plugin } from "@serenityjs/plugins";

interface IVanillaModule {
  name: string;

  load(plugin: Plugin): void;
}

interface Configuration {
  enabledModules: Array<string>;
  disabledModules: Array<string>;
}

interface IVanillaCommand {
  load(registry: CommandPalette): void;
}

export { IVanillaModule, Configuration, IVanillaCommand };
