/**
 * ===== 乐园 =====
 * 8 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 8 队地图：乐园 */
export function createMapPlayground( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "playground",
        "乐园",
        [
            { type: "team_island", pos: new Vector( -51, 57, -101 ), mirror: "X" }, // 红队
            { type: "team_island", pos: new Vector( 29, 57, -101 ), mirror: "XZ" }, // 蓝队
            { type: "team_island", pos: new Vector( 76, 57, -51 ), rotation: "Rotate90", mirror: "X" }, // 绿队
            { type: "team_island", pos: new Vector( 76, 57, 29 ), rotation: "Rotate90", mirror: "XZ" }, // 黄队
            { type: "team_island", pos: new Vector( 29, 57, 76 ), mirror: "Z" }, // 青队
            { type: "team_island", pos: new Vector( -51, 57, 76 ) }, // 白队
            { type: "team_island", pos: new Vector( -101, 57, 29 ), rotation: "Rotate90", mirror: "Z" }, // 粉队
            { type: "team_island", pos: new Vector( -101, 57, -51 ), rotation: "Rotate90" }, // 灰队
            { type: "diamond_island", pos: new Vector( -70, 51, -26 ) },
            { type: "diamond_island", pos: new Vector( -26, 51, -70 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( 38, 51, -26 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( -26, 51, 38 ), rotation: "Rotate270" },
            { type: "center_island_1", pos: new Vector( -36, 62, -36 ) },
            { type: "center_island_2", pos: new Vector( 28, 62, -36 ) },
            { type: "center_island_3", pos: new Vector( -36, 62, 28 ) },
            { type: "center_island_4", pos: new Vector( 28, 62, 28 ) },
        ],
        [
            { color: "red", pos1: new Vector( -46, 58, -78 ), pos2: new Vector( -30, 72, -99 ) },
            { color: "blue", pos1: new Vector( 46, 58, -78 ), pos2: new Vector( 30, 72, -99 ) },
            { color: "lime", pos1: new Vector( 78, 58, -46 ), pos2: new Vector( 99, 72, -30 ) },
            { color: "yellow", pos1: new Vector( 78, 58, 46 ), pos2: new Vector( 99, 72, 30 ) },
            { color: "cyan", pos1: new Vector( 46, 58, 78 ), pos2: new Vector( 30, 72, 99 ) },
            { color: "pink", pos1: new Vector( -78, 58, 46 ), pos2: new Vector( -99, 72, 30 ) },
            { color: "gray", pos1: new Vector( -78, 58, -46 ), pos2: new Vector( -99, 72, -30 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 87; // 最高上限
    map.heightLimit.min = 57; // 最低下限
    map.healPoolRadius = 17; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.spawnerInfo.ironSpawnTimes = 3; // 每次生成3铁锭而非5铁锭

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -38, 62, -80 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -38, 62, -97 ), spawnpointPos: new Vector( -38, 62, -92 ), chestPos: new Vector( -41, 62, -89 ), } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 38, 62, -80 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 38, 62, -97 ), spawnpointPos: new Vector( 38, 62, -92 ), chestPos: new Vector( 41, 62, -89 ), } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 80, 62, -38 ), bedRotation: "None", resourceSpawnerPos: new Vector( 97, 62, -38 ), spawnpointPos: new Vector( 92, 62, -38 ), chestPos: new Vector( 89, 62, -41 ), } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 80, 62, 38 ), bedRotation: "None", resourceSpawnerPos: new Vector( 97, 62, 38 ), spawnpointPos: new Vector( 92, 62, 38 ), chestPos: new Vector( 89, 62, 41 ), } ),
        new BedwarsTeam( "cyan", { bedPos: new Vector( 38, 62, 80 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 38, 62, 97 ), spawnpointPos: new Vector( 38, 62, 92 ), chestPos: new Vector( 41, 62, 89 ), } ),
        new BedwarsTeam( "white", { bedPos: new Vector( -38, 62, 80 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( -38, 62, 97 ), spawnpointPos: new Vector( -38, 62, 92 ), chestPos: new Vector( -41, 62, 89 ), } ),
        new BedwarsTeam( "pink", { bedPos: new Vector( -80, 62, 38 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -97, 62, 38 ), spawnpointPos: new Vector( -92, 62, 38 ), chestPos: new Vector( -89, 62, 41 ), } ),
        new BedwarsTeam( "gray", { bedPos: new Vector( -80, 62, -38 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -97, 62, -38 ), spawnpointPos: new Vector( -92, 62, -33 ), chestPos: new Vector( -89, 62, -41 ), } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( -33, 62, -94 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -33, 62, -93 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -33, 62, -90.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( 33, 62, -94 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 33, 62, -93 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 33, 62, -90.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 94, 62, -33 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 93, 62, -33 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 90.5, 62, -33 ), direction: 180, type: "team_upgrade" },
        
        { pos: new Vector( 94, 62, 33 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( 93, 62, 33 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( 90.5, 62, 33 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 33, 62, 94 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 33, 62, 93 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 33, 62, 90.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( -33, 62, 94 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -33, 62, 93 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -33, 62, 90.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -94, 62, 33 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -93, 62, 33 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -90.5, 62, 33 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( -94, 62, -33 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( -93, 62, -33 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( -90.5, 62, -33 ), direction: 180, type: "team_upgrade" },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( -62, 61, 0 ) },
        { type: "diamond", pos: new Vector( 0, 61, -62 ) },
        { type: "diamond", pos: new Vector( 62, 61, 0 ) },
        { type: "diamond", pos: new Vector( 0, 61, 62 ) },
        { type: "emerald", pos: new Vector( 26, 70, 26 ) },
        { type: "emerald", pos: new Vector( 26, 70, -26 ) },
        { type: "emerald", pos: new Vector( -26, 70, 26 ) },
        { type: "emerald", pos: new Vector( -26, 70, -26 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
