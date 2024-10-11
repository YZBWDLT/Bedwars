import { world } from "@minecraft/server"

/**
import {
    centerPosition, copyPosition,
    eachPlayer, eachTeam, eachValidPlayer, entityHasItemAmount,
    getEnchantmentLevel, getPlayerAmount, getPlayerNearby, giveItem,
    hasItemTypeTest,
    initPlayer, itemInfo,
    object_print, object_print_actionbar, object_print_actionbar_no_method, object_print_no_method,
    playerIsAlive, playerIsValid,
    randomInt, removeItem, replaceEquipmentItem, replaceInventoryItem, resourceTypeToResourceId,
    secondToMinute, sendMessage,
    teamNameToTeamNumber, teamNumberToTeamName, tickToSecond,
    warnPlayer
} from "./methods"
*/


/** @enum {breakableVanillaBlocksByPlayer[]} 可由玩家破坏的原版方块 */
export const breakableVanillaBlocksByPlayer = [ "minecraft:bed", "minecraft:short_grass", "minecraft:ladder", "minecraft:sponge", "minecraft:wet_sponge" ];

/** @enum {breakableVanillaBlocksByExplosion[]} 可由爆炸破坏的原版方块 */
export const breakableVanillaBlocksByExplosion = [ "minecraft:ladder", "minecraft:sponge", "minecraft:wet_sponge" ];

/** @enum {dropsFromExplosion[]} 在爆炸中生成掉落物的方块 */
export const dropsFromExplosion = [ "bedwars:end_stone", "bedwars:red_stained_hardened_clay", "bedwars:blue_stained_hardened_clay", "bedwars:yellow_stained_hardened_clay", "bedwars:green_stained_hardened_clay", "bedwars:pink_stained_hardened_clay", "bedwars:cyan_stained_hardened_clay", "bedwars:white_stained_hardened_clay", "bedwars:gray_stained_hardened_clay", "bedwars:purple_stained_hardened_clay", "bedwars:brown_stained_hardened_clay", "bedwars:orange_stained_hardened_clay" ];

/** @enum {resourceType[]} 可用资源类型列表 */
export const resourceType = [ "iron", "gold", "diamond", "emerald" ]

/** @enum {Dimension} 主世界维度 */
export let overworld = world.getDimension( "overworld" );
