/**
 * ===== 拱形廊道 =====
 * 4 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 4 队地图：拱形廊道 */
export function createMapArchway( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "archway",
        "拱形廊道",
        [
            { type: "team_island", pos: new Vector( -22, 62, -83 ) }, // 红队
            { type: "team_island", pos: new Vector( 62, 62, -22 ), rotation: "Rotate90" }, // 蓝队
            { type: "team_island", pos: new Vector( 4, 62, 62 ), rotation: "Rotate180" }, // 绿队
            { type: "team_island", pos: new Vector( -83, 62, 4 ), rotation: "Rotate270" }, // 黄队
            { type: "diamond_island", pos: new Vector( 29, 61, -59 ) },
            { type: "diamond_island", pos: new Vector( 44, 61, 29 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( -44, 61, 44 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( -59, 61, -44 ), rotation: "Rotate270" },
            { type: "center_island", pos: new Vector( -26, 58, -27 ) },
        ],
        [
            { color: "red", pos1: new Vector( -19, 70, -70 ), pos2: new Vector( -9, 83, -78 ) },
            { color: "blue", pos1: new Vector( 70, 70, -19 ), pos2: new Vector( 78, 83, -9 ) },
            { color: "lime", pos1: new Vector( 19, 70, 70 ), pos2: new Vector( 9, 83, 78 ) },
            { color: "yellow", pos1: new Vector( -70, 70, 19 ), pos2: new Vector( -78, 83, 9 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 91; // 最高上限
    map.heightLimit.min = 63; // 最低下限
    map.healPoolRadius = 12; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.spawnerInfo.ironSpawnTimes = 1; // 每次生成1块铁而非5块

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -15, 66, -66 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -14, 65, -79 ), spawnpointPos: new Vector( -14, 65, -75 ), chestPos: new Vector( -11, 65, -73 ), } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 66, 66, -15 ), bedRotation: "None", resourceSpawnerPos: new Vector( 79, 65, -14 ), spawnpointPos: new Vector( 75, 65, -14 ), chestPos: new Vector( 73, 65, -11 ), } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 15, 66, 66 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 14, 65, 79 ), spawnpointPos: new Vector( 14, 65, 75 ), chestPos: new Vector( 11, 65, 73 ), } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( -66, 66, 15 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -79, 65, 14 ), spawnpointPos: new Vector( -75, 65, 14 ), chestPos: new Vector( -73, 65, 11 ), } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { type: "blocks_and_items", pos: new Vector( -9, 65, -76 ), direction: 90, },
        { type: "blocks_and_items", pos: new Vector( 76, 65, -9 ), direction: 180, },
        { type: "blocks_and_items", pos: new Vector( 9, 65, 76 ), direction: 270, },
        { type: "blocks_and_items", pos: new Vector( -76, 65, 9 ), direction: 90, },

        { type: "weapon_and_armor", pos: new Vector( -9, 65, -75 ), direction: 90, },
        { type: "weapon_and_armor", pos: new Vector( 75, 65, -9 ), direction: 180, },
        { type: "weapon_and_armor", pos: new Vector( 9, 65, 75 ), direction: 270, },
        { type: "weapon_and_armor", pos: new Vector( -75, 65, 9 ), direction: 90, },

        { type: "team_upgrade", pos: new Vector( -19, 65, -75.5 ), direction: 270, },
        { type: "team_upgrade", pos: new Vector( 75.5, 65, -19 ), direction: 90, },
        { type: "team_upgrade", pos: new Vector( 19, 65, 75.5 ), direction: 90, },
        { type: "team_upgrade", pos: new Vector( -75.5, 65, 19 ), direction: 180, },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 34, 65, -49 ), },
        { type: "diamond", pos: new Vector( 49, 65, 34 ), },
        { type: "diamond", pos: new Vector( -34, 65, 49 ), },
        { type: "diamond", pos: new Vector( -49, 65, -34 ), },

        { type: "emerald", pos: new Vector( 0, 64, 0 ), },
        { type: "emerald", pos: new Vector( 0, 74, 0 ), },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
