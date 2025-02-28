/**
 * ===== 野餐 =====
 * 2 队地图，夺点模式。
 */

import { world } from "@minecraft/server";
import { BedwarsMap } from "../../methods/bedwarsMaps";
import { BedwarsTeam } from "../../methods/bedwarsTeam";
import { Vector } from "../../methods/positionManager";
import { shopitems } from "../../methods/bedwarsShopitem";

/** 创建 2 队夺点地图：野餐 */
export function createMapPicnicCapture( ) {

    /** 队伍信息初始化 */
    let map = new BedwarsMap(
        "picnic_capture",
        "野餐",
        [
            { type: "team_island", pos: new Vector( -12, 54, -82 ) }, // 红队
            { type: "team_island", pos: new Vector( -16, 54, 33 ), rotation: "Rotate180" }, // 蓝队
            { type: "side_island", pos: new Vector( 38, 57, -5 ) },
            { type: "side_island", pos: new Vector( -63, 57, -23 ), rotation: "Rotate180" },
            { type: "diamond_island", pos: new Vector( 29, 58, -44 ) },
            { type: "diamond_island", pos: new Vector( 29, 58, 31 ), mirror: "X" },
            { type: "diamond_island", pos: new Vector( -48, 58, -49 ), mirror: "Z" },
            { type: "diamond_island", pos: new Vector( -48, 58, 26 ), mirror: "XZ" },
            { type: "center_island", pos: new Vector( -21, 48, -22 ) },
        ],
        [
            { color: "red", pos1: new Vector( -5, 63, -59 ), pos2: new Vector( 13, 80, -72 ) },
            { color: "blue", pos1: new Vector( 5, 63, 58 ), pos2: new Vector( -13, 80, 71 ) },
        ]
    );

    /** 地图的特殊设置 */
    map.heightLimit.max = 89; // 最高上限
    map.heightLimit.min = 59; // 最低下限
    map.healPoolRadius = 19; // 治愈池范围
    map.spawnerInfo.distributeResource = false; // 资源集中式生成
    map.mode = "capture"; // 设置为夺点模式
    map.captureInfo.validBedPoints = [ new Vector( 0, 64, -63 ), new Vector( 0, 64, 61 ), new Vector( 48, 64, 10 ), new Vector( 0, 64, -1 ), new Vector( -48, 64, -11 ), ]

    /** 移除多余实体，进行初始化 */
    map.gameReady();

    /** 设置地图的队伍 */
    let teamRed = new BedwarsTeam( "red", { bedPos: new Vector( 0, 64, -63 ), bedRotation: "Rotate270", resourceSpawnerPos: new Vector( 0, 63, -78 ), spawnpointPos: new Vector( 0, 63, -74 ) } );
    let teamBlue = new BedwarsTeam( "blue", { bedPos: new Vector( 0, 64, 61 ), bedRotation: "Rotate90", resourceSpawnerPos: new Vector( 0, 63, 77 ), spawnpointPos: new Vector( 0, 63, 73 ) } );
    teamRed.captureInfo.bedsPos.push( teamRed.bedInfo.pos );
    teamBlue.captureInfo.bedsPos.push( teamBlue.bedInfo.pos );
    map.addTeams(
        teamRed, teamBlue
    );

    /** 设置地图商人 */
    map.addTraders(
        { pos: new Vector( 6, 63, -76 ), direction: 90, type: "blocks_and_items" },
        { pos: new Vector( -6, 63, 75 ), direction: 270, type: "blocks_and_items" },
        { pos: new Vector( 6, 63, -75 ), direction: 90, type: "weapon_and_armor_capture" },
        { pos: new Vector( -6, 63, 74 ), direction: 270, type: "weapon_and_armor_capture" },
        { pos: new Vector( -6, 63, -75.5 ), direction: 270, type: "team_upgrade" },
        { pos: new Vector( 6, 63, 74.5 ), direction: 90, type: "team_upgrade" },
    );

    /** 设置地图钻石和绿宝石生成点 */
    map.addSpawners(
        { type: "diamond", pos: new Vector( -36, 65, -38 ) },
        { type: "diamond", pos: new Vector( 36, 65, -33 ) },
        { type: "diamond", pos: new Vector( 36, 65, 37 ) },
        { type: "diamond", pos: new Vector( -36, 65, 32 ) },
        { type: "emerald", pos: new Vector( -7, 69, -11 ) },
        { type: "emerald", pos: new Vector( 8, 69, 12 ) },
    );

    /** 设置地图可购买的物品 */
    map.validShopitems = [ ...shopitems.blocksAndItems, ...shopitems.weaponAndArmorCapture, ...shopitems.teamUpgrade ];

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = map;

}
