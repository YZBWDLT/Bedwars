/**
 * ===== 神秘 =====
 * 2 队地图。
 */

import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 2 队地图：神秘 */
export function createMapCryptic( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "cryptic",
        "神秘",
        [
            { type: "team_island", pos: new Vector( -12, 61, 63 ) }, // 红队
            { type: "team_island", pos: new Vector( -12, 61, -95 ), mirror: "X" }, // 蓝队
            { type: "diamond_island", pos: new Vector( 53, 49, -15 ) },
            { type: "diamond_island", pos: new Vector( -75, 54, -15 ), mirror: "Z" },
            { type: "center_island_1", pos: new Vector( -33, 41, -29 ) },
            { type: "center_island_2", pos: new Vector( 31, 41, -29 ) },
        ],
        [
            { color: "red", pos1: new Vector( 8, 84, 78 ), pos2: new Vector( -4, 87, 92 ) },
            { color: "blue", pos1: new Vector( -4, 84, -78 ), pos2: new Vector( 8, 87, -92 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 102; // 最高上限
    map.heightLimit.min = 67; // 最低下限
    map.healPoolRadius = 25; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 2, 77, 73 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 2, 78, 90 ), spawnpointPos: new Vector( 2, 78, 85 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 2, 77, -73 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 2, 78, -90 ), spawnpointPos: new Vector( 2, 78, -85 ) } ),
    );

    /** 设置地图商人 */
    map.traderInfo = [
        { pos: new Vector( -2, 78, 87 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 6, 78, -87 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -2, 78, 85 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 6, 78, -85 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( 6, 78, 86 ), direction: 90, type: "team_upgrade" },
        { pos: new Vector( -3, 78, -86 ), direction: 270, type: "team_upgrade" },
    ];

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( -70, 78, 0 ) },
        { type: "diamond", pos: new Vector( 70, 73, 0 ) },
        { type: "emerald", pos: new Vector( 21, 68, 0 ) },
        { type: "emerald", pos: new Vector( -25, 81, 0 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
