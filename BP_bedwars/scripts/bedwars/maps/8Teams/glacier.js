/**
 * ===== 冰川 =====
 * 8 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 8 队地图：冰川 */
export function createMapGlacier( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "glacier",
        "冰川",
        [
            { type: "team_island", pos: new Vector( -44, 66, -89 ), mirror: "X" }, // 红队
            { type: "team_island", pos: new Vector( 19, 66, -89 ), mirror: "XZ" }, // 蓝队
            { type: "team_island", pos: new Vector( 62, 66, -44 ), rotation: "Rotate90", mirror: "X" }, // 绿队
            { type: "team_island", pos: new Vector( 62, 66, 19 ), rotation: "Rotate90", mirror: "XZ" }, // 黄队
            { type: "team_island", pos: new Vector( 19, 66, 62 ), mirror: "Z" }, // 青队
            { type: "team_island", pos: new Vector( -44, 66, 62 ) }, // 白队
            { type: "team_island", pos: new Vector( -89, 66, 19 ), rotation: "Rotate90", mirror: "Z" }, // 粉队
            { type: "team_island", pos: new Vector( -89, 66, -44 ), rotation: "Rotate90" }, // 灰队
            { type: "diamond_island", pos: new Vector( -9, 75, 43 ) },
            { type: "diamond_island", pos: new Vector( -56, 75, -9 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( -9, 75, -56 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( 43, 75, -9 ), rotation: "Rotate270" },
            { type: "center_island", pos: new Vector( -27, 55, -27 ) },
        ],
        [
            { color: "red", pos1: new Vector( -35, 81, -71 ), pos2: new Vector( -21, 95, -79 ) },
            { color: "blue", pos1: new Vector( 35, 81, -71 ), pos2: new Vector( 21, 95, -79 ) },
            { color: "lime", pos1: new Vector( 71, 81, -35 ), pos2: new Vector( 79, 95, -21 ) },
            { color: "yellow", pos1: new Vector( 71, 81, 35 ), pos2: new Vector( 79, 95, 21 ) },
            { color: "cyan", pos1: new Vector( 35, 81, 71 ), pos2: new Vector( 21, 95, 79 ) },
            { color: "pink", pos1: new Vector( -71, 81, 35 ), pos2: new Vector( -79, 95, 21 ) },
            { color: "gray", pos1: new Vector( -71, 81, -35 ), pos2: new Vector( -79, 95, -21 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 106; // 最高上限
    map.heightLimit.min = 75; // 最低下限
    map.healPoolRadius = 18; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.spawnerInfo.ironSpawnTimes = 3; // 每次生成3铁锭而非5铁锭

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -32, 81, -65 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -32, 81, -86 ), spawnpointPos: new Vector( -32, 81, -80 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 32, 81, -65 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 32, 81, -86 ), spawnpointPos: new Vector( 32, 81, -80 ) } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 65, 81, -32 ), bedRotation: "None", resourceSpawnerPos: new Vector( 86, 81, -32 ), spawnpointPos: new Vector( 80, 81, -32 ) } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 65, 81, 32 ), bedRotation: "None", resourceSpawnerPos: new Vector( 86, 81, 32 ), spawnpointPos: new Vector( 80, 81, 32 ) } ),
        new BedwarsTeam( "cyan", { bedPos: new Vector( 32, 81, 65 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 32, 81, 86 ), spawnpointPos: new Vector( 32, 81, 80 ) } ),
        new BedwarsTeam( "white", { bedPos: new Vector( -32, 81, 65 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( -32, 81, 86 ), spawnpointPos: new Vector( -32, 81, 80 ) } ),
        new BedwarsTeam( "pink", { bedPos: new Vector( -65, 81, 32 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -86, 81, 32 ), spawnpointPos: new Vector( -80, 81, 32 ) } ),
        new BedwarsTeam( "gray", { bedPos: new Vector( -65, 81, -32 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -86, 81, -32 ), spawnpointPos: new Vector( -80, 81, -32 ) } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( -29, 81, -87 ), direction: 0, type: "blocks_and_items", },
        { pos: new Vector( -28, 81, -87 ), direction: 0, type: "weapon_and_armor", },
        { pos: new Vector( -35.5, 81, -87 ), direction: 0, type: "team_upgrade", },
        
        { pos: new Vector( 35, 81, -87 ), direction: 0, type: "blocks_and_items", },
        { pos: new Vector( 36, 81, -87 ), direction: 0, type: "weapon_and_armor", },
        { pos: new Vector( 28.5, 81, -87 ), direction: 0, type: "team_upgrade", },
        
        { pos: new Vector( 87, 81, -29 ), direction: 90, type: "blocks_and_items", },
        { pos: new Vector( 87, 81, -28 ), direction: 90, type: "weapon_and_armor", },
        { pos: new Vector( 87, 81, -35.5 ), direction: 90, type: "team_upgrade", },
        
        { pos: new Vector( 87, 81, 35 ), direction: 90, type: "blocks_and_items", },
        { pos: new Vector( 87, 81, 36 ), direction: 90, type: "weapon_and_armor", },
        { pos: new Vector( 87, 81, 28.5 ), direction: 90, type: "team_upgrade", },
        
        { pos: new Vector( 29, 81, 87 ), direction: 180, type: "blocks_and_items", },
        { pos: new Vector( 28, 81, 87 ), direction: 180, type: "weapon_and_armor", },
        { pos: new Vector( 35.5, 81, 87 ), direction: 180, type: "team_upgrade", },
        
        { pos: new Vector( -35, 81, 87 ), direction: 180, type: "blocks_and_items", },
        { pos: new Vector( -36, 81, 87 ), direction: 180, type: "weapon_and_armor", },
        { pos: new Vector( -28.5, 81, 87 ), direction: 180, type: "team_upgrade", },
        
        { pos: new Vector( -87, 81, 29 ), direction: 270, type: "blocks_and_items", },
        { pos: new Vector( -87, 81, 28 ), direction: 270, type: "weapon_and_armor", },
        { pos: new Vector( -87, 81, 35.5 ), direction: 270, type: "team_upgrade", },
        
        { pos: new Vector( -87, 81, -35 ), direction: 270, type: "blocks_and_items", },
        { pos: new Vector( -87, 81, -36 ), direction: 270, type: "weapon_and_armor", },
        { pos: new Vector( -87, 81, -28.5 ), direction: 270, type: "team_upgrade", },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 0, 79, 50 ) },
        { type: "diamond", pos: new Vector( 0, 79, -50 ) },
        { type: "diamond", pos: new Vector( 50, 79, 0 ) },
        { type: "diamond", pos: new Vector( -50, 79, 0 ) },
        { type: "emerald", pos: new Vector( 20, 78, 20 ) },
        { type: "emerald", pos: new Vector( 20, 78, -20 ) },
        { type: "emerald", pos: new Vector( -20, 78, 20 ) },
        { type: "emerald", pos: new Vector( -20, 78, -20 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
