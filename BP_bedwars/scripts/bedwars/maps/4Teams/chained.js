/**
 * ===== 铁索连环 =====
 * 4 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 4 队地图：铁索连环 */
export function createMapChained( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "chained",
        "铁索连环",
        [
            { type: "team_island", pos: new Vector( 63, 55, -12 ) }, // 红队
            { type: "team_island", pos: new Vector( -11, 55, 63 ), rotation: "Rotate90" }, // 蓝队
            { type: "team_island", pos: new Vector( -89, 55, -11 ), rotation: "Rotate180" }, // 绿队
            { type: "team_island", pos: new Vector( -12, 55, -89 ), rotation: "Rotate270" }, // 黄队
            { type: "diamond_island", pos: new Vector( 16, 53, -50 ) },
            { type: "diamond_island", pos: new Vector( 28, 53, 16 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( -46, 53, 28 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( -50, 53, -46 ), rotation: "Rotate270" },
            { type: "center_island", pos: new Vector( -27, 46, -27 ) },
        ],
        [
            { color: "red", pos1: new Vector( 76, 70, -7 ), pos2: new Vector( 88, 79, 7 ) },
            { color: "blue", pos1: new Vector( 7, 70, 76 ), pos2: new Vector( -7, 79, 88 ) },
            { color: "lime", pos1: new Vector( -76, 70, 7 ), pos2: new Vector( -88, 79, -7 ) },
            { color: "yellow", pos1: new Vector( -7, 70, -76 ), pos2: new Vector( 7, 79, -88 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 90; // 最高上限
    map.heightLimit.min = 59; // 最低下限
    map.healPoolRadius = 20; // 治愈池范围

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 69, 65, 0 ), bedRotation: "None", resourceSpawnerPos: new Vector( 86, 64, 0 ), spawnpointPos: new Vector( 81, 64, 0 ), chestPos: new Vector( 80, 64, 5 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 0, 65, 69 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 0, 64, 86 ), spawnpointPos: new Vector( 0, 64, 81 ), chestPos: new Vector( -5, 64, 80 ) } ),
        new BedwarsTeam( "green", { bedPos: new Vector( -69, 65, 0 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -86, 64, 0 ), spawnpointPos: new Vector( -81, 64, 0 ), chestPos: new Vector( -80, 64, -5 ) } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 0, 65, -69 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 0, 64, -86 ), spawnpointPos: new Vector( 0, 64, -81 ), chestPos: new Vector( 5, 64, -80 ) } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { type: "blocks_and_items", pos: new Vector( 84, 64, 8 ), direction: 180 },
        { type: "blocks_and_items", pos: new Vector( -8, 64, 84 ), direction: 270 },
        { type: "blocks_and_items", pos: new Vector( -84, 64, -8 ), direction: 0 },
        { type: "blocks_and_items", pos: new Vector( 8, 64, -84 ), direction: 90 },

        { type: "weapon_and_armor", pos: new Vector( 82, 64, 8 ), direction: 180 },
        { type: "weapon_and_armor", pos: new Vector( -8, 64, 82 ), direction: 270 },
        { type: "weapon_and_armor", pos: new Vector( -82, 64, -8 ), direction: 0 },
        { type: "weapon_and_armor", pos: new Vector( 8, 64, -82 ), direction: 90 },

        { type: "team_upgrade", pos: new Vector( 83, 64, -8 ), direction: 0 },
        { type: "team_upgrade", pos: new Vector( 8, 64, 83 ), direction: 90 },
        { type: "team_upgrade", pos: new Vector( -83, 64, 8 ), direction: 180 },
        { type: "team_upgrade", pos: new Vector( -8, 64, -83 ), direction: 270 },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 36, 65, 34 ), },
        { type: "diamond", pos: new Vector( -34, 65, 36 ), },
        { type: "diamond", pos: new Vector( -36, 65, -34 ), },
        { type: "diamond", pos: new Vector( 34, 65, -36 ), },

        { type: "emerald", pos: new Vector( -11, 65, 0 ), },
        { type: "emerald", pos: new Vector( 11, 65, 0 ), },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
