/**
 * ===== 蘑菇岛 =====
 * 4 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 4 队地图：蘑菇岛 */
export function createMapBoletum( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "boletum",
        "蘑菇岛",
        [
            { type: "team_island", pos: new Vector( -11, 61, 60 ) }, // 红队
            { type: "team_island", pos: new Vector( -87, 61, -11 ), rotation: "Rotate90" }, // 蓝队
            { type: "team_island", pos: new Vector( -13, 61, -87 ), rotation: "Rotate180" }, // 绿队
            { type: "team_island", pos: new Vector( 60, 61, -13 ), rotation: "Rotate270" }, // 黄队
            { type: "diamond_island", pos: new Vector( -55, 64, 36 ) },
            { type: "diamond_island", pos: new Vector( -55, 64, -55 ), rotation: "Rotate90" },
            { type: "diamond_island", pos: new Vector( 36, 64, -55 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( 36, 64, 36 ), rotation: "Rotate270" },
            { type: "center_island", pos: new Vector( -27, 56, -27 ) },
        ],
        [
            { color: "red", pos1: new Vector( 9, 82, 69 ), pos2: new Vector( -9, 85, 74 ) },
            { color: "blue", pos1: new Vector( -71, 82, 9 ), pos2: new Vector( -76, 85, -9 ) },
            { color: "lime", pos1: new Vector( -11, 82, -71 ), pos2: new Vector( 8, 85, -76 ) },
            { color: "yellow", pos1: new Vector( 69, 82, -11 ), pos2: new Vector( 74, 85, 7 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 94; // 最高上限
    map.heightLimit.min = 65; // 最低下限
    map.healPoolRadius = 17; // 治愈池范围

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 0, 69, 66 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 0, 68, 82 ), spawnpointPos: new Vector( 0, 68, 78 ) } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( -68, 69, 0 ), bedRotation: "Rotate180", resourceSpawnerPos: new Vector( -84, 68, 0 ), spawnpointPos: new Vector( -80, 68, 0 ) } ),
        new BedwarsTeam( "green", { bedPos: new Vector( -2, 69, -68 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( -2, 68, -84 ), spawnpointPos: new Vector( -2, 68, -80 ) } ),
        new BedwarsTeam( "yellow", { bedPos: new Vector( 66, 69, -2 ), bedRotation: "None", resourceSpawnerPos: new Vector( 82, 68, -2 ), spawnpointPos: new Vector( 78, 68, -2 ) } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { type: "blocks_and_items", pos: new Vector( -5, 68, 80 ), direction: 180, },
        { type: "blocks_and_items", pos: new Vector( -82, 68, -5 ), direction: 270, },
        { type: "blocks_and_items", pos: new Vector( 3, 68, -82 ), direction: 0, },
        { type: "blocks_and_items", pos: new Vector( 80, 68, 3 ), direction: 90, },

        { type: "weapon_and_armor", pos: new Vector( -5, 68, 79 ), direction: 180, },
        { type: "weapon_and_armor", pos: new Vector( -81, 68, -5 ), direction: 270, },
        { type: "weapon_and_armor", pos: new Vector( 3, 68, -81 ), direction: 0, },
        { type: "weapon_and_armor", pos: new Vector( 79, 68, 3 ), direction: 90, },

        { type: "team_upgrade", pos: new Vector( 6, 68, 80.5 ), direction: 0, },
        { type: "team_upgrade", pos: new Vector( -81.5, 68, 6 ), direction: 90, },
        { type: "team_upgrade", pos: new Vector( -8, 68, -81.5 ), direction: 180, },
        { type: "team_upgrade", pos: new Vector( 80.5 , 68, -8 ), direction: 270, },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 43, 68, -43 ), },
        { type: "diamond", pos: new Vector( 43, 68, 43 ), },
        { type: "diamond", pos: new Vector( -43, 68, 43 ), },
        { type: "diamond", pos: new Vector( -43, 68, -43 ), },

        { type: "emerald", pos: new Vector( -11, 72, -12 ), },
        { type: "emerald", pos: new Vector( 9, 72, 12 ), },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
