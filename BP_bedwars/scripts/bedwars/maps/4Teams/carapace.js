/**
 * ===== 甲壳 =====
 * 4 队地图。
 */

import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 4 队地图：甲壳 */
export function createMapCarapace( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "carapace",
        "甲壳",
        [
            { type: "team_island", pos: new Vector( -11, 55, -67 ) }, // 红队
            { type: "team_island", pos: new Vector( 43, 55, -11 ), rotation: "Rotate90" }, // 蓝队
            { type: "team_island", pos: new Vector( -11, 55, 43 ), rotation: "Rotate180" }, // 绿队
            { type: "team_island", pos: new Vector( -67, 55, -11 ), rotation: "Rotate270" }, // 黄队
            { type: "diamond_island", pos: new Vector( 23, 55, -36 ) },
            { type: "diamond_island", pos: new Vector( 22, 55, 23 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( -38, 55, 22 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( -36, 55, -38 ), rotation: "Rotate270" },
            { type: "center_island", pos: new Vector( -17, 54, -17 ) },
        ],
        [
            { color: "red", pos1: new Vector( -6, 73, -45 ), pos2: new Vector( 7, 59, -67 ) },
            { color: "blue", pos1: new Vector( 45, 73, -6 ), pos2: new Vector( 67, 59, 7 ) },
            { color: "lime", pos1: new Vector( 6, 73, 45 ), pos2: new Vector( -7, 59, 67 ) },
            { color: "yellow", pos1: new Vector( -45, 73, 6 ), pos2: new Vector( -67, 59, -7 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 91; // 最高上限
    map.heightLimit.min = 63; // 最低下限
    map.healPoolRadius = 15; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.spawnerInfo.clearResourceVelocity = false; // 资源会按照随机速度矢量掉落
    map.spawnerInfo.ironSpawnTimes = 1; // 每次生成1块铁而非5块

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 0, 66, -48 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 0, 66, -64 ), spawnpointPos: new Vector( 0, 66, -58 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 48, 66, 0 ), bedRotation: "None", resourceSpawnerPos: new Vector( 64, 66, 0 ), spawnpointPos: new Vector( 58, 66, 0 ) } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 0, 66, 48 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 0, 66, 64 ), spawnpointPos: new Vector( 0, 66, 58 ) } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( -48, 66, 0 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -64, 66, 0 ), spawnpointPos: new Vector( -58, 66, 0 ) } ),
    );

    /** 设置地图商人 */
    map.traderInfo = [
        { type: "blocks_and_items", pos: new Vector( 5, 66, -59 ), direction: 180, },
        { type: "blocks_and_items", pos: new Vector( 59, 66, 5 ), direction: 270, },
        { type: "blocks_and_items", pos: new Vector( -5, 66, 59 ), direction: 0, },
        { type: "blocks_and_items", pos: new Vector( -59, 66, -5 ), direction: 90, },

        { type: "weapon_and_armor", pos: new Vector( 5, 66, -57 ), direction: 180, },
        { type: "weapon_and_armor", pos: new Vector( 57, 66, 5 ), direction: 270, },
        { type: "weapon_and_armor", pos: new Vector( -5, 66, 57 ), direction: 0, },
        { type: "weapon_and_armor", pos: new Vector( -57, 66, -5 ), direction: 90, },

        { type: "team_upgrade", pos: new Vector( -5, 66, -58 ), direction: 0, },
        { type: "team_upgrade", pos: new Vector( 58, 66, -5 ), direction: 90, },
        { type: "team_upgrade", pos: new Vector( 5, 66, 58 ), direction: 180, },
        { type: "team_upgrade", pos: new Vector( -58, 66, 5 ), direction: 270, },
    ];

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 31, 65, -30 ) },
        { type: "diamond", pos: new Vector( 30, 65, 31 ) },
        { type: "diamond", pos: new Vector( -31, 65, 30 ) },
        { type: "diamond", pos: new Vector( -30, 65, -31 ) },
        { type: "emerald", pos: new Vector( 0, 65, 0 ) },
        { type: "emerald", pos: new Vector( 0, 73, 0 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
