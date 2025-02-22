/**
 * ===== 屋顶 =====
 * 8 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 8 队地图：屋顶 */
export function createMapRooftop( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "rooftop",
        "屋顶",
        [
            { type: "team_island", pos: new Vector( -47, 20, -100 ), mirror: "X" }, // 红队
            { type: "team_island", pos: new Vector( 21, 20, -100 ), mirror: "XZ" }, // 蓝队
            { type: "team_island", pos: new Vector( 75, 20, -47 ), rotation: "Rotate90", mirror: "X" }, // 绿队
            { type: "team_island", pos: new Vector( 75, 20, 21 ), rotation: "Rotate90", mirror: "XZ" }, // 黄队
            { type: "team_island", pos: new Vector( 21, 20, 75 ), mirror: "Z" }, // 青队
            { type: "team_island", pos: new Vector( -47, 20, 75 ) }, // 白队
            { type: "team_island", pos: new Vector( -100, 20, 21 ), rotation: "Rotate90", mirror: "Z" }, // 粉队
            { type: "team_island", pos: new Vector( -100, 20, -47 ), rotation: "Rotate90" }, // 灰队
            { type: "diamond_island", pos: new Vector( -49, 20, -49 ) },
            { type: "diamond_island", pos: new Vector( 29, 20, -49 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( 29, 20, 29 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( -49, 20, 29 ), rotation: "Rotate270" },
            { type: "center_island_1", pos: new Vector( -22, 20, 24 ) },
            { type: "center_island_1", pos: new Vector( -70, 20, -18 ), rotation: "Rotate90" },
            { type: "center_island_1", pos: new Vector( -18, 20, -70 ), rotation: "Rotate180" },
            { type: "center_island_1", pos: new Vector( 24, 20, -22 ), rotation: "Rotate270" },
            { type: "center_island_2", pos: new Vector( -22, 20, -22 ) },
        ],
        [
            { color: "red", pos1: new Vector( -42, 66, -83 ), pos2: new Vector( -40, 81, -87 ) },
            { color: "blue", pos1: new Vector( 42, 66, -83 ), pos2: new Vector( 40, 81, -87 ) },
            { color: "lime", pos1: new Vector( 83, 66, -42 ), pos2: new Vector( 87, 81, -40 ) },
            { color: "yellow", pos1: new Vector( 83, 66, 42 ), pos2: new Vector( 87, 81, 40 ) },
            { color: "cyan", pos1: new Vector( 42, 66, 83 ), pos2: new Vector( 40, 81, 87 ) },
            { color: "pink", pos1: new Vector( -83, 66, 42 ), pos2: new Vector( -87, 81, 40 ) },
            { color: "gray", pos1: new Vector( -83, 66, -42 ), pos2: new Vector( -87, 81, -40 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 91; // 最高上限
    map.heightLimit.min = 62; // 最低下限
    map.healPoolRadius = 14; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.spawnerInfo.ironSpawnTimes = 3; // 每次生成3铁锭而非5铁锭
    map.loadInfo.mapReload.totalTime = 600; map.loadInfo.mapReload.countdown = 600; // 延长本地图加载时间至30秒

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -34, 66, -79 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -34, 66, -96 ), spawnpointPos: new Vector( -34, 66, -89 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 34, 66, -79 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 34, 66, -96 ), spawnpointPos: new Vector( 34, 66, -89 ) } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 79, 66, -34 ), bedRotation: "None", resourceSpawnerPos: new Vector( 96, 66, -34 ), spawnpointPos: new Vector( 89, 66, -34 ) } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 79, 66, 34 ), bedRotation: "None", resourceSpawnerPos: new Vector( 96, 66, 34 ), spawnpointPos: new Vector( 89, 66, 34 ) } ),
        new BedwarsTeam( "cyan", { bedPos: new Vector( 34, 66, 79 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 34, 66, 96 ), spawnpointPos: new Vector( 34, 66, 89 ) } ),
        new BedwarsTeam( "white", { bedPos: new Vector( -34, 66, 79 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( -34, 66, 96 ), spawnpointPos: new Vector( -34, 66, 89 ) } ),
        new BedwarsTeam( "pink", { bedPos: new Vector( -79, 66, 34 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -96, 66, 34 ), spawnpointPos: new Vector( -89, 66, 34 ) } ),
        new BedwarsTeam( "gray", { bedPos: new Vector( -79, 66, -34 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -96, 66, -34 ), spawnpointPos: new Vector( -89, 66, -34 ) } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( -28, 66, -91 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -28, 66, -90 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -40, 66, -90.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 40, 66, -91 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( 40, 66, -90 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( 28, 66, -90.5 ), direction: 270, type: "team_upgrade" },
        
        { pos: new Vector( 91, 66, -28 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 90, 66, -28 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 90.5, 66, -40 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 91, 66, 40 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( 90, 66, 40 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( 90.5, 66, 28 ), direction: 0, type: "team_upgrade" },
        
        { pos: new Vector( 28, 66, 91 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 28, 66, 90 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 40, 66, 90.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -40, 66, 91 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( -40, 66, 90 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( -28, 66, 90.5 ), direction: 90, type: "team_upgrade" },
        
        { pos: new Vector( -91, 66, 28 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -90, 66, 28 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -90.5, 66, 40 ), direction: 180, type: "team_upgrade" },
        
        { pos: new Vector( -91, 66, -40 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( -90, 66, -40 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( -90.5, 66, -28 ), direction: 180, type: "team_upgrade" },
        
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 39, 70, 39 ) },
        { type: "diamond", pos: new Vector( -39, 70, 39 ) },
        { type: "diamond", pos: new Vector( 39, 70, -39 ) },
        { type: "diamond", pos: new Vector( -39, 70, -39 ) },

        { type: "emerald", pos: new Vector( 11, 79, 11 ) },
        { type: "emerald", pos: new Vector( -11, 79, -11 ) },
        { type: "emerald", pos: new Vector( 11, 70, 13 ) },
        { type: "emerald", pos: new Vector( -11, 70, -13 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
