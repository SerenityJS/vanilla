import { Plugin, PluginEvents, PluginType } from "@serenityjs/plugins";

class VanillaPlugin extends Plugin implements PluginEvents {
  public readonly type = PluginType.Api;

  public constructor() {
    super("@serenityjs/vanilla", "0.0.1");
  }

  public onInitialize(): void {}

  public onStartUp(): void {}

  public onShutDown(): void {}
}

export { VanillaPlugin };

export default new VanillaPlugin();