/**
 * ===== 狮庙 =====
 * 2 队地图。
 */

import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 2 队地图：狮庙 */
export function createMapLionTemple( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "lion_temple",
        "狮庙",
        [
            { type: "team_island", pos: new Vector( -13, 61, 53 ) }, // 红队
            { type: "team_island", pos: new Vector( -13, 61, -84 ), mirror: "X" }, // 蓝队
            { type: "diamond_island", pos: new Vector( -69, 66, -13 ) },
            { type: "diamond_island", pos: new Vector( 43, 66, -13 ), rotation: "Rotate180" },
            { type: "center_island", pos: new Vector( -34, 55, -25 ) },
        ],
        [
            { color: "red", pos1: new Vector( 6, 74, 65 ), pos2: new Vector( -10, 86, 81 ) },
            { color: "blue", pos1: new Vector( -10, 74, -65 ), pos2: new Vector( 6, 86, -81 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 100; // 最高上限
    map.heightLimit.min = 69; // 最低下限
    map.healPoolRadius = 18; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.spawnerInfo.ironSpawnTimes = 1; // 每次生成1块铁而非5块

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -2, 73, 58 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( -2, 75, 78 ), spawnpointPos: new Vector( -2, 75, 73 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( -2, 73, -58 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -2, 75, -78 ), spawnpointPos: new Vector( -2, 75, -73 ) } ),
    );

    /** 设置地图商人 */
    map.traderInfo = [
        { pos: new Vector( -7, 75, 73 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 3, 75, -73 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -7, 75, 71 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 3, 75, -71 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( 3, 75, 72 ), direction: 90, type: "team_upgrade" },
        { pos: new Vector( -7, 75, -72 ), direction: 270, type: "team_upgrade" },
    ];

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 53, 83, 0 ) },
        { type: "diamond", pos: new Vector( -58, 83, 0 ) },
        { type: "emerald", pos: new Vector( -20, 77, 0 ) },
        { type: "emerald", pos: new Vector( 17, 82, 0 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
