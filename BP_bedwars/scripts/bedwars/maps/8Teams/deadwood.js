/**
 * ===== 莲叶 =====
 * 8 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 8 队地图：莲叶 */
export function createMapDeadwood( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "deadwood",
        "莲叶",
        [
            { type: "team_island", pos: new Vector( -41, 52, -105 ), mirror: "X" }, // 红队
            { type: "team_island", pos: new Vector( 19, 52, -105 ), mirror: "XZ" }, // 蓝队
            { type: "team_island", pos: new Vector( 74, 52, -41 ), rotation: "Rotate90", mirror: "X" }, // 绿队
            { type: "team_island", pos: new Vector( 74, 52, 19 ), rotation: "Rotate90", mirror: "XZ" }, // 黄队
            { type: "team_island", pos: new Vector( 19, 52, 74 ), mirror: "Z" }, // 青队
            { type: "team_island", pos: new Vector( -41, 52, 74 ) }, // 白队
            { type: "team_island", pos: new Vector( -105, 52, 19 ), rotation: "Rotate90", mirror: "Z" }, // 粉队
            { type: "team_island", pos: new Vector( -105, 52, -41 ), rotation: "Rotate90" }, // 灰队
            { type: "side_island", pos: new Vector( -15, 50, 50 ) },
            { type: "side_island", pos: new Vector( -90, 50, -15 ), rotation: "Rotate90" },
            { type: "side_island", pos: new Vector( -15, 50, -90 ), rotation: "Rotate180" },
            { type: "side_island", pos: new Vector( 50, 50, -15 ), rotation: "Rotate270" },
            { type: "diamond_island", pos: new Vector( -69, 57, 24 ) },
            { type: "diamond_island", pos: new Vector( -69, 57, -69 ), mirror: "X" },
            { type: "diamond_island", pos: new Vector( 24, 57, -69 ), mirror: "XZ" },
            { type: "diamond_island", pos: new Vector( 24, 57, 24 ), mirror: "Z" },
            { type: "center_island_1", pos: new Vector( -32, 50, -32 ) },
            { type: "center_island_2", pos: new Vector( 32, 61, -5 ) },
            { type: "center_island_3", pos: new Vector( -5, 61, 32 ) },
        ],
        [
            { color: "red", pos1: new Vector( -35, 68, -90 ), pos2: new Vector( -23, 71, -93 ) },
            { color: "blue", pos1: new Vector( 35, 68, -90 ), pos2: new Vector( 23, 71, -93 ) },
            { color: "lime", pos1: new Vector( 90, 68, -35 ), pos2: new Vector( 93, 71, -23 ) },
            { color: "yellow", pos1: new Vector( 90, 68, 35 ), pos2: new Vector( 93, 71, 23 ) },
            { color: "cyan", pos1: new Vector( 35, 68, 90 ), pos2: new Vector( 23, 71, 93 ) },
            { color: "pink", pos1: new Vector( -90, 68, 35 ), pos2: new Vector( -93, 71, 23 ) },
            { color: "gray", pos1: new Vector( -90, 68, -35 ), pos2: new Vector( -93, 71, -23 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 89; // 最高上限
    map.heightLimit.min = 62; // 最低下限
    map.healPoolRadius = 20; // 治愈池范围
    map.spawnerInfo.ironSpawnTimes = 3; // 每次生成3铁锭而非5铁锭

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -30, 64, -82 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -30, 66, -99 ), spawnpointPos: new Vector( -30, 66, -94 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 30, 64, -82 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 30, 66, -99 ), spawnpointPos: new Vector( 30, 66, -94 ) } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 82, 64, -30 ), bedRotation: "None", resourceSpawnerPos: new Vector( 99, 66, -30 ), spawnpointPos: new Vector( 94, 66, -30 ) } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 82, 64, 30 ), bedRotation: "None", resourceSpawnerPos: new Vector( 99, 66, 30 ), spawnpointPos: new Vector( 94, 66, 30 ) } ),
        new BedwarsTeam( "cyan", { bedPos: new Vector( 30, 64, 82 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 30, 66, 99 ), spawnpointPos: new Vector( 30, 66, 94 ) } ),
        new BedwarsTeam( "white", { bedPos: new Vector( -30, 64, 82 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( -30, 66, 99 ), spawnpointPos: new Vector( -30, 66, 94 ) } ),
        new BedwarsTeam( "pink", { bedPos: new Vector( -82, 64, 30 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -99, 66, 30 ), spawnpointPos: new Vector( -94, 66, 30 ) } ),
        new BedwarsTeam( "gray", { bedPos: new Vector( -82, 64, -30 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -99, 66, -30 ), spawnpointPos: new Vector( -94, 66, -30 ) } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( -25, 66, -93 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -24, 67, -95 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -34, 66, -93 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 25, 66, -93 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 24, 67, -95 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 34, 66, -93 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( 93, 66, -25 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 95, 67, -24 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 93, 66, -34 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 93, 66, 25 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( 95, 67, 24 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( 93, 66, 34 ), direction: 180, type: "team_upgrade" },
        
        { pos: new Vector( 25, 66, 93 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 24, 67, 95 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 34, 66, 93 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -25, 66, 93 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -24, 67, 95 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -34, 66, 93 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( -93, 66, 25 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -95, 67, 24 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -93, 66, 34 ), direction: 180, type: "team_upgrade" },
        
        { pos: new Vector( -93, 66, -25 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( -95, 67, -24 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( -93, 66, -34 ), direction: 0, type: "team_upgrade" },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 55, 64, 55 ) },
        { type: "diamond", pos: new Vector( -55, 64, 55 ) },
        { type: "diamond", pos: new Vector( 55, 64, -55 ) },
        { type: "diamond", pos: new Vector( -55, 64, -55 ) },
        { type: "emerald", pos: new Vector( 18, 66, 18 ) },
        { type: "emerald", pos: new Vector( 18, 66, -18 ) },
        { type: "emerald", pos: new Vector( -18, 66, -18 ) },
        { type: "emerald", pos: new Vector( -18, 66, 18 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
