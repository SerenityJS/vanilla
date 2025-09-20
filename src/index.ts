import path from "path";
import { readFileSync } from "fs";

import { Plugin } from "@serenityjs/plugins";

import { Configuration } from "./types";
import { MODULES } from "./modules";

class VanillaPlugin extends Plugin {
  private basePath: string = "";

  public constructor() {
    super("vanilla-plugin", "1.0.0");
  }

  public onInitialize(): void {
    // Determine the base path of the plugin.
    this.basePath = path.join(__dirname, "..");

    // Get the plugin configuration.
    const configuration = this.parseConfigurationFile();
    const disabledModules = new Set(configuration.disabledModules);

    // Load all modules that are not disabled.
    for (const module of MODULES) {
      // Check if the module is disabled.
      if (disabledModules.has(module.name)) continue;

      module.load(this);
      this.logger.info(`Loaded module [${module.name}]`);
    }
  }

  // TODO: improve configuration parsing and validation
  private parseConfigurationFile(): Configuration {
    const fileContents = readFileSync(
      path.join(this.basePath, "configuration.json"),
      "utf-8"
    );
    return JSON.parse(fileContents) as Configuration;
  }
}

export default new VanillaPlugin();
