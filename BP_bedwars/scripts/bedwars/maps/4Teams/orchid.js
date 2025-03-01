/**
 * ===== 兰花 =====
 * 4 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 4 队地图：兰花 */
export function createMapOrchid( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "orchid",
        "兰花",
        [
            { type: "team_island", pos: new Vector( 36, 61, -64 ) }, // 红队
            { type: "team_island", pos: new Vector( 36, 61, 38 ), mirror: "X" }, // 蓝队
            { type: "team_island", pos: new Vector( -67, 61, -64 ), mirror: "Z" }, // 绿队
            { type: "team_island", pos: new Vector( -67, 61, 38 ), mirror: "XZ" }, // 黄队
            { type: "diamond_island_1", pos: new Vector( 35, 59, -20 ) },
            { type: "diamond_island_1", pos: new Vector( -65, 59, -20 ), mirror: "Z" },
            { type: "diamond_island_2", pos: new Vector( -13, 59, -89 ) },
            { type: "diamond_island_2", pos: new Vector( -13, 59, 62 ), mirror: "X" },
            { type: "center_island_1", pos: new Vector( -25, 56, -16 ) },
            { type: "center_island_2", pos: new Vector( -10, 59, -56 ) },
            { type: "center_island_2", pos: new Vector( -10, 59, 17 ), mirror: "X" },
        ],
        [
            { color: "red", pos1: new Vector( 49, 82, -56 ), pos2: new Vector( 52, 78, -45 ) },
            { color: "blue", pos1: new Vector( 49, 82, 56 ), pos2: new Vector( 52, 78, 45 ) },
            { color: "lime", pos1: new Vector( -49, 82, 56 ), pos2: new Vector( -52, 78, 45 ) },
            { color: "yellow", pos1: new Vector( -49, 82, -56 ), pos2: new Vector( -52, 78, -45 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 95; // 最高上限
    map.heightLimit.min = 64; // 最低下限
    map.healPoolRadius = 21; // 治愈池范围
    map.playerCouldIntoShop = false; // 禁止玩家进入商店区域

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 41, 71, -50 ), bedRotation: "None", resourceSpawnerPos: new Vector( 62, 71, -50 ), spawnpointPos: new Vector( 58, 71, -49 ), chestPos: new Vector( 55, 71, -47 ), } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 41, 71, 50 ), bedRotation: "None", resourceSpawnerPos: new Vector( 62, 71, 50 ), spawnpointPos: new Vector( 58, 71, 49 ), chestPos: new Vector( 55, 71, 47 ), } ),
        new BedwarsTeam( "green", { bedPos: new Vector( -41, 71, 50 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -62, 71, 50 ), spawnpointPos: new Vector( -58, 71, 49 ), chestPos: new Vector( -55, 71, 47 ), } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( -41, 71, -50 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -62, 71, -50 ), spawnpointPos: new Vector( -58, 71, -49 ), chestPos: new Vector( -55, 71, -47 ), } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { type: "blocks_and_items", pos: new Vector( 59, 71, -45 ), direction: 180 },
        { type: "blocks_and_items", pos: new Vector( 57, 71, 45 ), direction: 0 },
        { type: "blocks_and_items", pos: new Vector( -59, 71, 45 ), direction: 0 },
        { type: "blocks_and_items", pos: new Vector( -57, 71, -45 ), direction: 180 },

        { type: "weapon_and_armor", pos: new Vector( 57, 71, -45 ), direction: 180 },
        { type: "weapon_and_armor", pos: new Vector( 59, 71, 45 ), direction: 0 },
        { type: "weapon_and_armor", pos: new Vector( -57, 71, 45 ), direction: 0 },
        { type: "weapon_and_armor", pos: new Vector( -59, 71, -45 ), direction: 180 },

        { type: "team_upgrade", pos: new Vector( 55, 71, -54 ), direction: 270 },
        { type: "team_upgrade", pos: new Vector( 55, 71, 54 ), direction: 270 },
        { type: "team_upgrade", pos: new Vector( -55, 71, 54 ), direction: 90 },
        { type: "team_upgrade", pos: new Vector( -55, 71, -54 ), direction: 90 },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 0, 70, -76 ), },
        { type: "diamond", pos: new Vector( 56, 70, 0 ), },
        { type: "diamond", pos: new Vector( 0, 70, 76 ), },
        { type: "diamond", pos: new Vector( -56, 70, 0 ), },

        { type: "emerald", pos: new Vector( 0, 70, -8 ), },
        { type: "emerald", pos: new Vector( 0, 70, 8 ), },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
