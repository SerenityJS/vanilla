import { CommandPalette, World } from "@serenityjs/core";
import { Plugin } from "@serenityjs/plugins";

/**
 * Interface for a vanilla module.
 */
interface IVanillaModule {
  /** The name of the module. */
  name: string;

  /**
   * Loads the module.
   * @param plugin The plugin instance to load the module into.
   */
  load(plugin: Plugin): void;
}

interface Configuration {
  enabledModules: Array<string>;
  disabledModules: Array<string>;
}

interface IVanillaCommand {
  load(world: World): void;
}

export { IVanillaModule, Configuration, IVanillaCommand };
