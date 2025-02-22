/**
 * ===== 瀑布 =====
 * 8 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 8 队地图：瀑布 */
export function createMapWaterfall( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "waterfall",
        "瀑布",
        [
            { type: "team_island", pos: new Vector( -45, 57, -84 ), rotation: "Rotate180" }, // 红队
            { type: "team_island", pos: new Vector( 21, 57, -84 ), rotation: "Rotate180" }, // 蓝队
            { type: "team_island", pos: new Vector( 60, 57, -45 ), rotation: "Rotate270" }, // 绿队
            { type: "team_island", pos: new Vector( 60, 57, 21 ), rotation: "Rotate270" }, // 黄队
            { type: "team_island", pos: new Vector( 22, 57, 60 ) }, // 青队
            { type: "team_island", pos: new Vector( -44, 57, 60 ) }, // 白队
            { type: "team_island", pos: new Vector( -84, 57, 22 ), rotation: "Rotate90" }, // 粉队
            { type: "team_island", pos: new Vector( -84, 57, -44 ), rotation: "Rotate90" }, // 灰队
            { type: "center_island_1", pos: new Vector( -58, 45, -58 ) },
            { type: "center_island_2", pos: new Vector( -58, 45, 0 ) },
            { type: "center_island_3", pos: new Vector( 1, 45, 0 ) },
            { type: "center_island_4", pos: new Vector( 1, 45, -58 ) },
        ],
        [
            { color: "red", pos1: new Vector( -28, 86, -72 ), pos2: new Vector( -22, 79, -74 ) },
            { color: "blue", pos1: new Vector( 38, 86, -72 ), pos2: new Vector( 44, 79, -74 ) },
            { color: "lime", pos1: new Vector( 72, 86, -28 ), pos2: new Vector( 74, 79, -22 ) },
            { color: "yellow", pos1: new Vector( 72, 86, 38 ), pos2: new Vector( 74, 79, 44 ) },
            { color: "cyan", pos1: new Vector( 28, 86, 72 ), pos2: new Vector( 22, 79, 74 ) },
            { color: "pink", pos1: new Vector( -72, 86, 28 ), pos2: new Vector( -74, 79, 22 ) },
            { color: "gray", pos1: new Vector( -72, 86, -38 ), pos2: new Vector( -74, 79, -44 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 102; // 最高上限
    map.heightLimit.min = 62; // 最低下限
    map.healPoolRadius = 12; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.spawnerInfo.ironSpawnTimes = 3; // 每次生成3铁锭而非5铁锭
    map.loadInfo.mapReload.totalTime = 600; map.loadInfo.mapReload.countdown = 600; // 延长本地图加载时间至30秒

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -33, 66, -64 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -34, 66, -77 ), spawnpointPos: new Vector( -34, 66, -72 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 33, 66, -64 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 32, 66, -77 ), spawnpointPos: new Vector( 32, 66, -72 ) } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 64, 66, -33 ), bedRotation: "None", resourceSpawnerPos: new Vector( 77, 66, -34 ), spawnpointPos: new Vector( 72, 66, -34 ) } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 64, 66, 33 ), bedRotation: "None", resourceSpawnerPos: new Vector( 77, 66, 32 ), spawnpointPos: new Vector( 72, 66, 32 ) } ),
        new BedwarsTeam( "cyan", { bedPos: new Vector( 33, 66, 64 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 34, 66, 77 ), spawnpointPos: new Vector( 34, 66, 72 ) } ),
        new BedwarsTeam( "white", { bedPos: new Vector( -33, 66, 64 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( -32, 66, 77 ), spawnpointPos: new Vector( -32, 66, 72 ) } ),
        new BedwarsTeam( "pink", { bedPos: new Vector( -64, 66, 33 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -77, 66, 34 ), spawnpointPos: new Vector( -72, 66, 34 ) } ),
        new BedwarsTeam( "gray", { bedPos: new Vector( -64, 66, -33 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -77, 66, -32 ), spawnpointPos: new Vector( -72, 66, -32 ) } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( -29, 66, -74 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -29, 66, -73 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -39, 66, -73.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 37, 66, -74 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( 37, 66, -73 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( 27, 66, -73.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 74, 66, -29 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 73, 66, -29 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 73.5, 66, -39 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 74, 66, 37 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 73, 66, 37 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 73.5, 66, 27 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 29, 66, 74 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 29, 66, 73 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 39, 66, 73.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -37, 66, 74 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( -37, 66, 73 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( -27, 66, 73.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -74, 66, 29 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -73, 66, 29 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -73.5, 66, 39 ), direction: 180, type: "team_upgrade" },
        
        { pos: new Vector( -74, 66, -37 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -73, 66, -37 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -73.5, 66, -27 ), direction: 180, type: "team_upgrade" },
        
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 0, 63, -52 ) },
        { type: "diamond", pos: new Vector( 52, 63, 0 ) },
        { type: "diamond", pos: new Vector( 0, 63, 52 ) },
        { type: "diamond", pos: new Vector( -52, 63, 0 ) },

        { type: "emerald", pos: new Vector( 12, 77, 12 ) },
        { type: "emerald", pos: new Vector( 12, 77, -12 ) },
        { type: "emerald", pos: new Vector( -12, 77, 12 ) },
        { type: "emerald", pos: new Vector( -12, 77, -12 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
