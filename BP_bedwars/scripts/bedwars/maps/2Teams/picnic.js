/**
 * ===== 野餐 =====
 * 2 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 2 队地图：野餐 */
export function createMapPicnic( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "picnic",
        "野餐",
        [
            { type: "team_island", pos: new Vector( -12, 55, -82 ) }, // 红队
            { type: "team_island", pos: new Vector( -14, 55, 55 ), rotation: "Rotate180" }, // 蓝队
            { type: "diamond_island", pos: new Vector( -63, 58, -24 ) },
            { type: "diamond_island", pos: new Vector( 38, 58, -5 ), rotation: "Rotate180" },
            { type: "center_island", pos: new Vector( -21, 49, -22 ) },
        ],
        [
            { color: "red", pos1: new Vector( -5, 75, -72 ), pos2: new Vector( 13, 81, -69 ) },
            { color: "blue", pos1: new Vector( 5, 75, 71 ), pos2: new Vector( -13, 81, 68 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 90; // 最高上限
    map.heightLimit.min = 60; // 最低下限
    map.healPoolRadius = 19; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 0, 65, -62 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 0, 64, -78 ), spawnpointPos: new Vector( 0, 64, -74 ), chestPos: new Vector( 3, 64, -73 ), } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 0, 65, 61 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 0, 64, 77 ), spawnpointPos: new Vector( 0, 64, 73 ), chestPos: new Vector( -3, 64, 72 ), } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( 6, 64, -76 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -6, 64, 75 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 6, 64, -75 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -6, 64, 74 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( -6, 64, -75.5 ), direction: 270, type: "team_upgrade" },
        { pos: new Vector( 6, 64, 74.5 ), direction: 90, type: "team_upgrade" },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 48, 63, 10 ) },
        { type: "diamond", pos: new Vector( -48, 63, -10 ) },
        { type: "emerald", pos: new Vector( -7, 68, -11 ) },
        { type: "emerald", pos: new Vector( 8, 68, 12 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
