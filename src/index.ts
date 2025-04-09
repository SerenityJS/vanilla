import path from "path";
import { readFileSync } from "fs";

import { Plugin } from "@serenityjs/plugins";

import block from "./modules/world/block";
import mob from "./modules/world/mob";
import command from "./modules/commands";
import item from "./modules/world/item";
import { Configuration, IVanillaModule } from "./types";

const MODULES: Array<IVanillaModule> = [block, mob, command, item];

class VanillaPlugin extends Plugin {
  private basePath: string = "";

  public constructor() {
    super("vanilla-plugin", "1.0.0");
  }

  public onInitialize(): void {
    this.logger.info("Initializing plugin");

    this.basePath = path.join(__dirname, "..");
    const configuration = this.parseConfigurationFile();
    const disabledModules = new Set(configuration.disabledModules);

    for (const module of MODULES) {
      if (disabledModules.has(module.name)) continue;
      module.load(this);
      this.logger.info(`Loaded module [${module.name}]`);
    }
  }

  private parseConfigurationFile(): Configuration {
    const fileContents = readFileSync(
      path.join(this.basePath, "configuration.json"),
      "utf-8"
    );
    return JSON.parse(fileContents) as Configuration;
  }
}

export default new VanillaPlugin();
