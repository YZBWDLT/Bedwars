/**
 * ===== 极寒 =====
 * 2 队地图。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";

/** 创建 2 队地图：极寒 */
export function createMapFrost( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "frost",
        "极寒",
        [
            { type: "team_island", pos: new Vector( -13, 55, 55 ) }, // 红队
            { type: "team_island", pos: new Vector( -13, 55, -81 ), mirror: "X" }, // 蓝队
            { type: "diamond_island", pos: new Vector( 29, 60, -20 ) },
            { type: "diamond_island", pos: new Vector( -46, 60, -2 ), rotation: "Rotate180" },
            { type: "center_island", pos: new Vector( -13, 56, -22 ) },
        ],
        [ ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 97; // 最高上限
    map.heightLimit.min = 69; // 最低下限
    map.healPoolRadius = 15; // 治愈池范围
    map.loadInfo.teamIslandColor.isEnabled = false; // 不设置队伍岛屿的颜色

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    map.addTeams(
        new BedwarsTeam( "red", { bedPos: new Vector( 0, 72, 59 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 0, 72, 75 ), spawnpointPos: new Vector( 0, 72, 70 ), chestPos: new Vector( 4, 72, 68 ), } ),
        new BedwarsTeam( "blue", { bedPos: new Vector( 0, 72, -59 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 0, 72, -75 ), spawnpointPos: new Vector( 0, 72, -70 ), chestPos: new Vector( 4, 72, -68 ), } ),
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( -6, 72, 72 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 6, 72, -72 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -6, 72, 70 ), direction: 270, type: "weapon_and_armor" },
        { pos: new Vector( 6, 72, -70 ), direction: 90, type: "weapon_and_armor" },
        { pos: new Vector( 6, 72, 71 ), direction: 90, type: "team_upgrade" },
        { pos: new Vector( -6, 72, -71 ), direction: 270, type: "team_upgrade" },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( 38, 75, -10 ) },
        { type: "diamond", pos: new Vector( -38, 75, 10 ) },
        { type: "emerald", pos: new Vector( 0, 76, -12 ) },
        { type: "emerald", pos: new Vector( 0, 76, 12 ) },
    );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
