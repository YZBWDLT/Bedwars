import { world } from "@minecraft/server"

/** @enum {breakableVanillaBlocksByPlayer[]} 可由玩家破坏的原版方块 */
export const breakableVanillaBlocksByPlayer = [ "minecraft:bed", "minecraft:short_grass", "minecraft:ladder", "minecraft:sponge", "minecraft:wet_sponge" ];

/** @enum {breakableVanillaBlocksByExplosion[]} 可由爆炸破坏的原版方块 */
export const breakableVanillaBlocksByExplosion = [ "minecraft:ladder", "minecraft:sponge", "minecraft:wet_sponge" ];

/** @enum {dropsFromExplosion[]} 在爆炸中生成掉落物的方块 */
export const dropsFromExplosion = [ "bedwars:end_stone", "bedwars:red_stained_hardened_clay", "bedwars:blue_stained_hardened_clay", "bedwars:yellow_stained_hardened_clay", "bedwars:green_stained_hardened_clay", "bedwars:pink_stained_hardened_clay", "bedwars:cyan_stained_hardened_clay", "bedwars:white_stained_hardened_clay", "bedwars:gray_stained_hardened_clay", "bedwars:purple_stained_hardened_clay", "bedwars:brown_stained_hardened_clay", "bedwars:orange_stained_hardened_clay" ];

/** @enum {validTeams[]} 可用队伍列表 */
export const validTeams = [ "red", "blue", "yellow", "green", "pink", "cyan", "white", "gray", "purple", "brown", "orange" ];

/** @enum {resourceType[]} 可用资源类型列表 */
export const resourceType = [ "iron", "gold", "diamond", "emerald" ]

/** @enum {traderType[]} 可用商人类型列表 */
export const traderType = [ "blocks_and_items", "weapon_and_armor", "team_upgrade" ];

/** @enum {shopitemType[]} 商店物品类型列表 */
export const shopitemType = [ "sword", "armor", "axe", "pickaxe", "teamUpgrade", "coloredBlock", "knockbackStick", "shears", "bow", "potion", "trap", "other" ]

/** @enum {Dimension} 主世界维度 */
export let overworld = world.getDimension( "overworld" );
