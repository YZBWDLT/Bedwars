/**
 * ===== 灯塔 =====
 * 8 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 8 队地图：灯塔 */
export function createMapLighthouse( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "lighthouse",
        "灯塔",
        [
            { type: "team_island", pos: new Vector( -35, 55, -95 ), rotation: "Rotate180" }, // 红队
            { type: "team_island", pos: new Vector( 17, 55, -95 ), rotation: "Rotate180" }, // 蓝队
            { type: "team_island", pos: new Vector( 72, 55, -38 ), rotation: "Rotate270" }, // 绿队
            { type: "team_island", pos: new Vector( 72, 55, 14 ), rotation: "Rotate270" }, // 黄队
            { type: "team_island", pos: new Vector( 19, 55, 69 ) }, // 青队
            { type: "team_island", pos: new Vector( -33, 55, 69 ) }, // 白队
            { type: "team_island", pos: new Vector( -92, 55, 16 ), rotation: "Rotate90" }, // 粉队
            { type: "team_island", pos: new Vector( -92, 55, -36 ), rotation: "Rotate90" }, // 灰队
            { type: "diamond_island", pos: new Vector( -64, 57, 44 ) },
            { type: "diamond_island", pos: new Vector( -61, 57, -67 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( 47, 57, -64 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( 47, 57, 44 ), rotation: "Rotate270" },
            { type: "side_island", pos: new Vector( -17, 50, 25 ) },
            { type: "side_island", pos: new Vector( -49, 50, -20 ), rotation: "Rotate90" },
            { type: "side_island", pos: new Vector( -17, 50, -52 ), rotation: "Rotate180" },
            { type: "side_island", pos: new Vector( 28, 50, -20 ), rotation: "Rotate270" },
            { type: "center_island", pos: new Vector( -17, 46, -20 ) },
        ],
        [
            { color: "red", pos1: new Vector( -35, 81, -84 ), pos2: new Vector( -16, 68, -76 ) },
            { color: "blue", pos1: new Vector( 17, 81, -84 ), pos2: new Vector( 36, 68, -76 ) },
            { color: "lime", pos1: new Vector( 87, 81, -38 ), pos2: new Vector( 79, 68, -19 ) },
            { color: "yellow", pos1: new Vector( 87, 81, 14 ), pos2: new Vector( 79, 68, 33 ) },
            { color: "cyan", pos1: new Vector( 41, 81, 84 ), pos2: new Vector( 22, 68, 76 ) },
            { color: "pink", pos1: new Vector( -81, 81, 38 ), pos2: new Vector( -73, 68, 19 ) },
            { color: "gray", pos1: new Vector( -81, 81, -14 ), pos2: new Vector( -73, 68, -33 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 100; // 最高上限
    map.heightLimit.min = 62; // 最低下限
    map.healPoolRadius = 19; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.spawnerInfo.ironSpawnTimes = 3; // 每次生成3铁锭而非5铁锭

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -23, 66, -75 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -23, 65, -91 ), spawnpointPos: new Vector( -23, 65, -87 ), chestPos: new Vector( -19, 65, -86 ), } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 29, 66, -75 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 29, 65, -91 ), spawnpointPos: new Vector( 29, 65, -87 ), chestPos: new Vector( 33, 65, -86 ), } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 78, 66, -26 ), bedRotation: "None", resourceSpawnerPos: new Vector( 94, 65, -26 ), spawnpointPos: new Vector( 90, 65, -26 ), chestPos: new Vector( 89, 65, -22 ), } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 78, 66, 26 ), bedRotation: "None", resourceSpawnerPos: new Vector( 94, 65, 26 ), spawnpointPos: new Vector( 90, 65, 26 ), chestPos: new Vector( 89, 65, 30 ), } ),
        new BedwarsTeam( "cyan", { bedPos: new Vector( 29, 66, 75 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 29, 65, 91 ), spawnpointPos: new Vector( 29, 65, 87 ), chestPos: new Vector( 25, 65, 86 ), } ),
        new BedwarsTeam( "white", { bedPos: new Vector( -23, 66, 75 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( -23, 65, 91 ), spawnpointPos: new Vector( -23, 65, 87 ), chestPos: new Vector( -27, 65, 86 ), } ),
        new BedwarsTeam( "pink", { bedPos: new Vector( -72, 66, 26 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -88, 65, 26 ), spawnpointPos: new Vector( -84, 65, 26 ), chestPos: new Vector( -83, 65, 22 ), } ),
        new BedwarsTeam( "gray", { bedPos: new Vector( -72, 66, -26 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -88, 65, -26 ), spawnpointPos: new Vector( -84, 65, -26 ), chestPos: new Vector( -83, 65, -30 ), } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( -17, 65, -89 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -17, 65, -88 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -28, 65, -88.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 35, 65, -89 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( 35, 65, -88 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( 24, 65, -88.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 91, 65, -20 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 92, 65, -20 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 91.5, 65, -30.5 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 91, 65, 32 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 92, 65, 32 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 91.5, 65, 21 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 23, 65, 89 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 23, 65, 88 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 34, 65, 88.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -29, 65, 89 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( -29, 65, 88 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( -18, 65, 88.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -86, 65, 20 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -85, 65, 20 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -85.5, 65, 31 ), direction: 180, type: "team_upgrade" },
        
        { pos: new Vector( -86, 65, -32 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -85, 65, -32 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -85.5, 65, -21 ), direction: 180, type: "team_upgrade" },
        
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( -49, 66, -52 ) },
        { type: "diamond", pos: new Vector( 55, 66, -52 ) },
        { type: "diamond", pos: new Vector( 55, 66, 52 ) },
        { type: "diamond", pos: new Vector( -49, 66, 52 ) },

        { type: "emerald", pos: new Vector( -7, 64, 14 ) },
        { type: "emerald", pos: new Vector( 13, 64, -14 ) },
        { type: "emerald", pos: new Vector( 3, 86, -7 ) },
        { type: "emerald", pos: new Vector( 3, 86, 7 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
