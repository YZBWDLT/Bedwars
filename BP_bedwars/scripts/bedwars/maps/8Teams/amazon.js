/**
 * ===== 亚马逊 =====
 * 8 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 8 队地图：亚马逊 */
export function createMapAmazon( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "amazon",
        "亚马逊",
        [
            { type: "team_island", pos: new Vector( -54, 53, -102 ), mirror: "X" }, // 红队
            { type: "team_island", pos: new Vector( 20, 53, -102 ), mirror: "XZ" }, // 蓝队
            { type: "team_island", pos: new Vector( 75, 53, -54 ), rotation: "Rotate90", mirror: "X" }, // 绿队
            { type: "team_island", pos: new Vector( 75, 53, 20 ), rotation: "Rotate90", mirror: "XZ" }, // 黄队
            { type: "team_island", pos: new Vector( 20, 53, 75 ), mirror: "Z" }, // 青队
            { type: "team_island", pos: new Vector( -54, 53, 75 ) }, // 白队
            { type: "team_island", pos: new Vector( -102, 53, 20 ), rotation: "Rotate90", mirror: "Z" }, // 粉队
            { type: "team_island", pos: new Vector( -102, 53, -54 ), rotation: "Rotate90" }, // 灰队
            { type: "diamond_island", pos: new Vector( -83, 56, 69 ) },
            { type: "diamond_island", pos: new Vector( -84, 56, -83 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( 68, 56, -84 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( 69, 56, 68 ), rotation: "Rotate270" },
            { type: "center_island_1", pos: new Vector( -62, 45, -62 ) },
            { type: "center_island_2", pos: new Vector( 2, 45, -62 ) },
            { type: "center_island_3", pos: new Vector( -62, 45, 0 ) },
            { type: "center_island_4", pos: new Vector( 2, 45, 0 ) },
        ],
        [
            { color: "red", pos1: new Vector( -47, 68, -86 ), pos2: new Vector( -25, 83, -98 ) },
            { color: "blue", pos1: new Vector( 47, 68, -86 ), pos2: new Vector( 25, 83, -98 ) },
            { color: "lime", pos1: new Vector( 86, 68, -47 ), pos2: new Vector( 98, 83, -25 ) },
            { color: "yellow", pos1: new Vector( 86, 68, 47 ), pos2: new Vector( 98, 83, 25 ) },
            { color: "cyan", pos1: new Vector( 47, 68, 86 ), pos2: new Vector( 25, 83, 98 ) },
            { color: "pink", pos1: new Vector( -86, 68, 47 ), pos2: new Vector( -98, 83, 25 ) },
            { color: "gray", pos1: new Vector( -86, 68, -47 ), pos2: new Vector( -98, 83, -25 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 90; // 最高上限
    map.heightLimit.min = 55; // 最低下限
    map.healPoolRadius = 19; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.spawnerInfo.ironSpawnTimes = 3; // 每次生成3铁锭而非5铁锭

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -33, 65, -80 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -33, 65, -100 ), spawnpointPos: new Vector( -33, 65, -95 ), chestPos: new Vector( -36, 66, -93 ), } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 33, 65, -80 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 33, 65, -100 ), spawnpointPos: new Vector( 33, 65, -95 ), chestPos: new Vector( 36, 66, -93 ), } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 80, 65, -33 ), bedRotation: "None", resourceSpawnerPos: new Vector( 100, 65, -33 ), spawnpointPos: new Vector( 95, 65, -33 ), chestPos: new Vector( 93, 66, -36 ), } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 80, 65, 33 ), bedRotation: "None", resourceSpawnerPos: new Vector( 100, 65, 33 ), spawnpointPos: new Vector( 95, 65, 33 ), chestPos: new Vector( 93, 66, 36 ), } ),
        new BedwarsTeam( "cyan", { bedPos: new Vector( 33, 65, 80 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 33, 65, 100 ), spawnpointPos: new Vector( 33, 65, 95 ), chestPos: new Vector( 36, 66, 93 ), } ),
        new BedwarsTeam( "white", { bedPos: new Vector( -33, 65, 80 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( -33, 65, 100 ), spawnpointPos: new Vector( -33, 65, 95 ), chestPos: new Vector( -36, 66, 93 ), } ),
        new BedwarsTeam( "pink", { bedPos: new Vector( -80, 65, 33 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -100, 65, 33 ), spawnpointPos: new Vector( -95, 65, 33 ), chestPos: new Vector( -93, 66, 36 ), } ),
        new BedwarsTeam( "gray", { bedPos: new Vector( -80, 65, -33 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -100, 65, -33 ), spawnpointPos: new Vector( -95, 65, -33 ), chestPos: new Vector( -93, 66, -36 ), } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( -26, 66, -96 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -26, 66, -95 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -39, 66, -95.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 39, 66, -96 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( 39, 66, -95 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( 26, 66, -95.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 96, 66, -26 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 95, 66, -26 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 95.5, 66, -39 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 96, 66, 39 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 95, 66, 39 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 95.5, 66, 26 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 26, 66, 96 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 26, 66, 95 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 39, 66, 95.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -39, 66, 96 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( -39, 66, 95 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( -26, 66, 95.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -96, 66, 26 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -95, 66, 26 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -95.5, 66, 39 ), direction: 180, type: "team_upgrade" },
        
        { pos: new Vector( -96, 66, -39 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -95, 66, -39 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -95.5, 66, -26 ), direction: 180, type: "team_upgrade" },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 76, 61, 75 ) },
        { type: "diamond", pos: new Vector( -75, 61, 76 ) },
        { type: "diamond", pos: new Vector( 75, 61, -76 ) },
        { type: "diamond", pos: new Vector( -76, 61, -75 ) },
        { type: "emerald", pos: new Vector( 0, 78, 33 ) },
        { type: "emerald", pos: new Vector( 0, 78, -33 ) },
        { type: "emerald", pos: new Vector( 33, 78, 0 ) },
        { type: "emerald", pos: new Vector( -33, 78, 0 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
