/**
 * ===== 伊斯特伍德 =====
 * 4 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 4 队地图：伊斯特伍德 */
export function createMapEastwood( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "eastwood",
        "伊斯特伍德",
        [
            { type: "team_island", pos: new Vector( 49, 52, -11 ) }, // 红队
            { type: "team_island", pos: new Vector( -11, 52, 49 ), rotation: "Rotate90" }, // 蓝队
            { type: "team_island", pos: new Vector( -74, 52, -11 ), rotation: "Rotate180" }, // 绿队
            { type: "team_island", pos: new Vector( -11, 52, -74 ), rotation: "Rotate270" }, // 黄队
            { type: "diamond_island", pos: new Vector( 18, 48, 18 ) },
            { type: "diamond_island", pos: new Vector( -53, 48, 18 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( -50, 48, -53 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( 18, 48, -50 ), rotation: "Rotate270" },
            { type: "center_island", pos: new Vector( -22, 51, -22 ) },
        ],
        [
            { color: "red", pos1: new Vector( 63, 77, -3 ), pos2: new Vector( 69, 78, 3 ) },
            { color: "blue", pos1: new Vector( 3, 77, 63 ), pos2: new Vector( -3, 78, 69 ) },
            { color: "lime", pos1: new Vector( -63, 77, 3 ), pos2: new Vector( -69, 78, -3 ) },
            { color: "yellow", pos1: new Vector( -3, 77, -63 ), pos2: new Vector( 3, 78, -69 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 91; // 最高上限
    map.heightLimit.min = 55; // 最低下限
    map.healPoolRadius = 17; // 治愈池范围

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 55, 66, 0 ), bedRotation: "None", resourceSpawnerPos: new Vector( 70, 66, 0 ), spawnpointPos: new Vector( 66, 66, 0 ), chestPos: new Vector( 70, 66, 3 ), } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 0, 66, 55 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 0, 66, 70 ), spawnpointPos: new Vector( 0, 66, 66 ), chestPos: new Vector( -3, 66, 70 ), } ),
        new BedwarsTeam( "green", { bedPos: new Vector( -55, 66, 0 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -70, 66, 0 ), spawnpointPos: new Vector( -66, 66, 0 ), chestPos: new Vector( -70, 66, -3 ), } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 0, 66, -55 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 0, 66, -70 ), spawnpointPos: new Vector( 0, 66, -66 ), chestPos: new Vector( 3, 66, -70 ), } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { type: "blocks_and_items", pos: new Vector( 70, 66, 5 ), direction: 90 },
        { type: "blocks_and_items", pos: new Vector( -5, 66, 70 ), direction: 180 },
        { type: "blocks_and_items", pos: new Vector( -70, 66, -5 ), direction: 270 },
        { type: "blocks_and_items", pos: new Vector( 5, 66, -70 ), direction: 0 },

        { type: "weapon_and_armor", pos: new Vector( 70, 66, 6 ), direction: 90 },
        { type: "weapon_and_armor", pos: new Vector( -6, 66, 70 ), direction: 180 },
        { type: "weapon_and_armor", pos: new Vector( -70, 66, -6 ), direction: 270 },
        { type: "weapon_and_armor", pos: new Vector( 6, 66, -70 ), direction: 0 },

        { type: "team_upgrade", pos: new Vector( 70, 66, -4 ), direction: 90 },
        { type: "team_upgrade", pos: new Vector( 4, 66, 70 ), direction: 180 },
        { type: "team_upgrade", pos: new Vector( -70, 66, 4 ), direction: 270 },
        { type: "team_upgrade", pos: new Vector( -4, 66, -70 ), direction: 0 },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 40, 64, 40 ), },
        { type: "diamond", pos: new Vector( -40, 64, 40 ), },
        { type: "diamond", pos: new Vector( -40, 64, -40 ), },
        { type: "diamond", pos: new Vector( 40, 64, -40 ), },

        { type: "emerald", pos: new Vector( -10, 64, -10 ), },
        { type: "emerald", pos: new Vector( 10, 64, 10 ), },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
