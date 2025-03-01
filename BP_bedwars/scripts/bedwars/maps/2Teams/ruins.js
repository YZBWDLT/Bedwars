/**
 * ===== 废墟 =====
 * 2 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 2 队地图：废墟 */
export function createMapRuins( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "ruins",
        "废墟",
        [
            { type: "team_island", pos: new Vector( -15, 61, -88 ) }, // 红队
            { type: "team_island", pos: new Vector( -15, 61, 59 ), rotation: "Rotate180" }, // 蓝队
            { type: "diamond_island", pos: new Vector( -60, 62, -22 ) },
            { type: "diamond_island", pos: new Vector( 35, 62, -7 ), rotation: "Rotate180" },
            { type: "center_island", pos: new Vector( -24, 61, -25 ) }
        ],
        [
            { color: "red", pos1: new Vector( -6, 76, -72 ), pos2: new Vector( 6, 79, -76 ) },
            { color: "blue", pos1: new Vector( 6, 76, 72 ), pos2: new Vector( -6, 79, 76 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 96; // 最高上限
    map.heightLimit.min = 65; // 最低下限
    map.healPoolRadius = 20; // 治愈池范围

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( -4, 71, -64 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 0, 72, -82 ), spawnpointPos: new Vector( 0, 72, -78 ), chestPos: new Vector( 5, 72, -76 ), } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 4, 71, 64 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 0, 72, 82 ), spawnpointPos: new Vector( 0, 72, 78 ), chestPos: new Vector( -5, 72, 76 ), } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( 6, 72, -80 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -6, 72, 80 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 6, 72, -79 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( -6, 72, 79 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( -6, 72, -79.5 ), direction: 270, type: "team_upgrade" },
        { pos: new Vector( 6, 72, 79.5 ), direction: 90, type: "team_upgrade" },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( -47, 69, -10 ) },
        { type: "diamond", pos: new Vector( 47, 69, 10 ) },
        { type: "emerald", pos: new Vector( 17, 69, -6 ) },
        { type: "emerald", pos: new Vector( -17, 69, 6 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
