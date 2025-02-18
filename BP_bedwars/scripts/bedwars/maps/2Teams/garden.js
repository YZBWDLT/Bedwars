/**
 * ===== 花园 =====
 * 2 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 2 队地图：花园 */
export function createMapGarden( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "garden",
        "花园",
        [
            { type: "team_island", pos: new Vector( 73, 69, -15 ) }, // 红队
            { type: "team_island", pos: new Vector( -104, 69, -15 ), mirror: "Z" }, // 蓝队
            { type: "diamond_island", pos: new Vector( -20, 64, -65 ) },
            { type: "diamond_island", pos: new Vector( -20, 64, 40 ), mirror: "X" },
            { type: "center_island", pos: new Vector( -30, 54, -30 ) },
        ],
        [
            { color: "red", pos1: new Vector( 91, 79, -8 ), pos2: new Vector( 91, 84, 8 ) },
            { color: "blue", pos1: new Vector( -91, 79, 8 ), pos2: new Vector( -91, 84, -8 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 97; // 最高上限
    map.heightLimit.min = 67; // 最低下限
    map.healPoolRadius = 21; // 治愈池范围

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 79, 77, 0 ), bedRotation: "None", resourceSpawnerPos: new Vector( 98, 79, 0 ), spawnpointPos: new Vector( 94, 79, 0 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( -79, 77, 0 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -98, 79, 0 ), spawnpointPos: new Vector( -94, 79, 0 ) } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( 95, 79, 8 ), direction: 180, type: "blocks_and_items" },
        { pos: new Vector( -95, 79, -8 ), direction: 0, type: "blocks_and_items" },
        { pos: new Vector( 93, 79, 8 ), direction: 180, type: "weapon_and_armor" },
        { pos: new Vector( -93, 79, -8 ), direction: 0, type: "weapon_and_armor" },
        { pos: new Vector( 94, 79, -8 ), direction: 0, type: "team_upgrade" },
        { pos: new Vector( -94, 79, 8 ), direction: 180, type: "team_upgrade" },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 0, 77, -52 ) },
        { type: "diamond", pos: new Vector( 0, 77, 52 ) },
        { type: "emerald", pos: new Vector( -21, 76, -21 ) },
        { type: "emerald", pos: new Vector( 21, 76, 21 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
