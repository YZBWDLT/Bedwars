/**
 * ===== 水族馆 =====
 * 4 队地图。
 */

import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 4 队地图：水族馆 */
export function createMapAquarium( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "aquarium",
        "水族馆",
        [
            { type: "team_island", pos: new Vector( -17, 81, -93 ) }, // 红队
            { type: "team_island", pos: new Vector( 45, 81, -17 ), rotation: "Rotate90" }, // 蓝队
            { type: "team_island", pos: new Vector( -25, 81, 45 ), rotation: "Rotate180" }, // 绿队
            { type: "team_island", pos: new Vector( -93, 81, -25 ), rotation: "Rotate270" }, // 黄队
            { type: "diamond_island", pos: new Vector( -54, 70, -55 ) },
            { type: "diamond_island", pos: new Vector( 31, 70, -54 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( 31, 70, 31 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( -55, 70, 31 ), rotation: "Rotate270" },
            { type: "center_island", pos: new Vector( -19, 66, -20 ) },
        ],
        [
            { color: "red", pos1: new Vector( -13, 82, -89 ), pos2: new Vector( 22, 104, -53 ) },
            { color: "blue", pos1: new Vector( 89, 82, -13 ), pos2: new Vector( 53, 104, 22 ) },
            { color: "lime", pos1: new Vector( 13, 82, 89 ), pos2: new Vector( -22, 104, 53 ) },
            { color: "yellow", pos1: new Vector( -89, 82, 13 ), pos2: new Vector( -53, 104, -22 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 112; // 最高上限
    map.heightLimit.min = 78; // 最低下限
    map.healPoolRadius = 20; // 治愈池范围

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 0, 87, -48 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 0, 87, -64 ), spawnpointPos: new Vector( 0, 87, -58 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 48, 87, 0 ), bedRotation: "None", resourceSpawnerPos: new Vector( 64, 87, 0 ), spawnpointPos: new Vector( 58, 87, 0 ) } ),
        new BedwarsTeam( "green", { bedPos: new Vector( 0, 87, 48 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 0, 87, 64 ), spawnpointPos: new Vector( 0, 87, 58 ) } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( -48, 87, 0 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -64, 87, 0 ), spawnpointPos: new Vector( -58, 87, 0 ) } ),
    );

    /** 设置地图商人 */
    map.traderInfo = [
        { type: "blocks_and_items", pos: new Vector( 5, 87, -60 ), direction: 90, },
        { type: "blocks_and_items", pos: new Vector( 60, 87, 5 ), direction: 180, },
        { type: "blocks_and_items", pos: new Vector( -5, 87, 60 ), direction: 270, },
        { type: "blocks_and_items", pos: new Vector( -60, 87, -5 ), direction: 0, },

        { type: "weapon_and_armor", pos: new Vector( 5, 87, -59 ), direction: 90, },
        { type: "weapon_and_armor", pos: new Vector( 59, 87, 5 ), direction: 180, },
        { type: "weapon_and_armor", pos: new Vector( -5, 87, 59 ), direction: 270, },
        { type: "weapon_and_armor", pos: new Vector( -59, 87, -5 ), direction: 0, },

        { type: "team_upgrade", pos: new Vector( 5, 87, -57 ), direction: 90, },
        { type: "team_upgrade", pos: new Vector( 57, 87, 5 ), direction: 180, },
        { type: "team_upgrade", pos: new Vector( -5, 87, 57 ), direction: 270, },
        { type: "team_upgrade", pos: new Vector( -57, 87, -5 ), direction: 0, },
    ];

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( -41, 81, -39 ), },
        { type: "diamond", pos: new Vector( 39, 81, -41 ), },
        { type: "diamond", pos: new Vector( 41, 81, 39 ), },
        { type: "diamond", pos: new Vector( -39, 81, 41 ), },

        { type: "emerald", pos: new Vector( -10, 94, -11 ), },
        { type: "emerald", pos: new Vector( 8, 94, 11 ), },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
