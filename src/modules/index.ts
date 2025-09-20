import { IVanillaModule } from "../types";

import blocks from "./world/blocks";
import mobs from "./world/mobs";
import commands from "./commands";
import items from "./world/items";

/**
 * List of all available modules.
 */
const MODULES: Array<IVanillaModule> = [blocks, mobs, commands, items];

export { MODULES };
