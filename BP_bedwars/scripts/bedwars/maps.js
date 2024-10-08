import { BedwarsMap, BedwarsTeam } from "./methods.js"
import * as methods from "./methods.js"
import { world } from "@minecraft/server";

/** 可用 2 队地图列表 */
export const validMapsFor2Teams = [ "cryptic", "frost", "garden", "ruins", "picnic", "lion_temple" ]

/** 可用 4 队地图列表 */
export const validMapsFor4Teams = [ "orchid", "chained", "boletum", "carapace", "archway" ]

/** 可用 8 队地图列表 */
export const validMapsFor8Teams = [ ]

/**
 * 重新生成地图
 * @param {String} mapId - 如果提供了此参数，则将生成这张固定的地图
 */
export function regenerateMap( mapId = undefined ) {
    let mapList = [];
    if (methods.settings.randomMap.allow2Teams) { mapList = mapList.concat(validMapsFor2Teams); }
    if (methods.settings.randomMap.allow4Teams) { mapList = mapList.concat(validMapsFor4Teams); }
    if (methods.settings.randomMap.allow8Teams) { mapList = mapList.concat(validMapsFor8Teams); }
    let randomMap = mapList[ Math.floor( Math.random() * mapList.length ) ]
    if ( mapList.includes( mapId ) ) { randomMap = mapId }
    switch ( randomMap ) {

        case "orchid": createMapOrchid(); break;
        case "chained": createMapChained(); break;
        case "boletum": createMapBoletum(); break;
        case "carapace": createMapCarapace(); break;
        case "archway": createMapArchway(); break;

        case "cryptic": createMapCryptic(); break;
        case "frost": createMapFrost(); break;
        case "garden": createMapGarden(); break;
        case "ruins": createMapRuins(); break;
        case "picnic": createMapPicnic(); break;
        case "lion_temple": createMapLionTemple(); break;
    }
}

/** @type {BedwarsMap} 地图信息 */
export let map = world.bedwarsMap

/** ===== 4队地图 ===== */

function createMapOrchid( ) {

    /** 队伍信息初始化 */
    let mapOrchid = new BedwarsMap( "orchid", "兰花", { healPoolRadius: 21, highestBlockLimit: 95 } );
    let teamRed = new BedwarsTeam( "red", { x: 41, y: 71, z: -50 }, 0, { x: 62, y: 71, z: -50 }, { x: 58, y: 71, z: -49 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 41, y: 71, z: 50 }, 0, { x: 62, y: 71, z: 50 }, { x: 58, y: 71, z: 49 } );
    let teamGreen = new BedwarsTeam( "green", { x: -41, y: 71, z: 50 }, 2, { x: -62, y: 71, z: 50 }, { x: -58, y: 71, z: 49 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: -41, y: 71, z: -50 }, 2, { x: -62, y: 71, z: -50 }, { x: -58, y: 71, z: -49 } );

    /** 移除多余实体，进行初始化 */
    mapOrchid.init()

    /** 设置地图的队伍 */
    mapOrchid.addTeam( teamRed ); 
    mapOrchid.addTeam( teamBlue ); 
    mapOrchid.addTeam( teamGreen ); 
    mapOrchid.addTeam( teamYellow );

    /** 设置地图钻石和绿宝石生成点 */
    mapOrchid.addSpawner( "diamond", { x: 0, y: 72, z: -76 } );
    mapOrchid.addSpawner( "diamond", { x: 56, y: 72, z: 0 } );
    mapOrchid.addSpawner( "diamond", { x: 0, y: 72, z: 76 } );
    mapOrchid.addSpawner( "diamond", { x: -56, y: 72, z: 0 } );
    mapOrchid.addSpawner( "emerald", { x: 0, y: 72, z: -8 } );
    mapOrchid.addSpawner( "emerald", { x: 0, y: 72, z: 8 } );

    /** 设置地图商人 */
    mapOrchid.addTrader( { x: 59, y: 71, z: -45 }, 180, "blocks_and_items" );
    mapOrchid.addTrader( { x: 57, y: 71, z: 45 }, 0, "blocks_and_items" );
    mapOrchid.addTrader( { x: -59, y: 71, z: 45 }, 0, "blocks_and_items" );
    mapOrchid.addTrader( { x: -57, y: 71, z: -45 }, 180, "blocks_and_items" );
    mapOrchid.addTrader( { x: 57, y: 71, z: -45 }, 180, "weapon_and_armor" );
    mapOrchid.addTrader( { x: 59, y: 71, z: 45 }, 0, "weapon_and_armor" );
    mapOrchid.addTrader( { x: -57, y: 71, z: 45 }, 0, "weapon_and_armor" );
    mapOrchid.addTrader( { x: -59, y: 71, z: -45 }, 180, "weapon_and_armor" );
    mapOrchid.addTrader( { x: 55, y: 71, z: -54 }, 270, "team_upgrade" );
    mapOrchid.addTrader( { x: 55, y: 71, z: 54 }, 270, "team_upgrade" );
    mapOrchid.addTrader( { x: -55, y: 71, z: 54 }, 90, "team_upgrade" );
    mapOrchid.addTrader( { x: -55, y: 71, z: -54 }, 90, "team_upgrade" );

    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapOrchid;
    return [ mapOrchid, teamRed, teamBlue, teamGreen, teamYellow ];

}

function createMapChained( ) {

    /** 队伍信息初始化 */
    let mapChained = new BedwarsMap( "chained", "铁索连环", { highestBlockLimit: 90 } );
    let teamRed = new BedwarsTeam( "red", { x: 69, y: 65, z: 0 }, 0, { x: 86, y: 64, z: 0 }, { x: 81, y: 64, z: 0 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 0, y: 65, z: 69 }, 1, { x: 0, y: 64, z: 86 }, { x: 0, y: 64, z: 81 } );
    let teamGreen = new BedwarsTeam( "green", { x: -69, y: 65, z: 0 }, 2, { x: -86, y: 64, z: 0 }, { x: -81, y: 64, z: 0 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: 0, y: 65, z: -69 }, 3, { x: 0, y: 64, z: -86 }, { x: 0, y: 64, z: -81 } );
    
    /** 移除多余实体，进行初始化 */
    mapChained.init()
    
    /** 设置地图的队伍 */
    mapChained.addTeam( teamRed ); 
    mapChained.addTeam( teamBlue ); 
    mapChained.addTeam( teamGreen ); 
    mapChained.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapChained.addSpawner( "diamond", { x: 36, y: 67, z: 34 } );
    mapChained.addSpawner( "diamond", { x: -34, y: 67, z: 36 } );
    mapChained.addSpawner( "diamond", { x: -36, y: 67, z: -34 } );
    mapChained.addSpawner( "diamond", { x: 34, y: 67, z: -36 } );
    mapChained.addSpawner( "emerald", { x: -11, y: 67, z: 0 } );
    mapChained.addSpawner( "emerald", { x: 11, y: 67, z: 0 } );
    
    /** 设置地图商人 */
    mapChained.addTrader( { x: 84, y: 64, z: 8 }, 180, "blocks_and_items" );
    mapChained.addTrader( { x: -8, y: 64, z: 84 }, 270, "blocks_and_items" );
    mapChained.addTrader( { x: -84, y: 64, z: -8 }, 0, "blocks_and_items" );
    mapChained.addTrader( { x: 8, y: 64, z: -84 }, 90, "blocks_and_items" );
    mapChained.addTrader( { x: 82, y: 64, z: 8 }, 180, "weapon_and_armor" );
    mapChained.addTrader( { x: -8, y: 64, z: 82 }, 270, "weapon_and_armor" );
    mapChained.addTrader( { x: -82, y: 64, z: -8 }, 0, "weapon_and_armor" );
    mapChained.addTrader( { x: 8, y: 64, z: -82 }, 90, "weapon_and_armor" );
    mapChained.addTrader( { x: 83, y: 64, z: -8 }, 0, "team_upgrade" );
    mapChained.addTrader( { x: 8, y: 64, z: 83 }, 90, "team_upgrade" );
    mapChained.addTrader( { x: -83, y: 64, z: 8 }, 180, "team_upgrade" );
    mapChained.addTrader( { x: -8, y: 64, z: -83 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapChained;
    return [ mapChained, teamRed, teamBlue, teamGreen, teamYellow ];
    
}

function createMapBoletum( ) {

    /** 队伍信息初始化 */
    let mapBoletum = new BedwarsMap( "boletum", "蘑菇岛", { highestBlockLimit: 94 } );
    let teamRed = new BedwarsTeam( "red", { x: 0, y: 69, z: 66 }, 1, { x: 0, y: 68, z: 82 }, { x: 0, y: 68, z: 78 } );
    let teamBlue = new BedwarsTeam( "blue", { x: -68, y: 69, z: 0 }, 2, { x: -84, y: 68, z: 0 }, { x: -80, y: 68, z: 0 } );
    let teamGreen = new BedwarsTeam( "green", { x: -2, y: 69, z: -68 }, 3, { x: -2, y: 68, z: -84 }, { x: -2, y: 68, z: -80 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: 66, y: 69, z: -2 }, 0, { x: 82, y: 68, z: -2 }, { x: 78, y: 68, z: -2 } );
    
    /** 移除多余实体，进行初始化 */
    mapBoletum.init()
    
    /** 设置地图的队伍 */
    mapBoletum.addTeam( teamRed ); 
    mapBoletum.addTeam( teamBlue ); 
    mapBoletum.addTeam( teamGreen ); 
    mapBoletum.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapBoletum.addSpawner( "diamond", { x: 43, y: 70, z: -43 } );
    mapBoletum.addSpawner( "diamond", { x: 43, y: 70, z: 43 } );
    mapBoletum.addSpawner( "diamond", { x: -43, y: 70, z: 43 } );
    mapBoletum.addSpawner( "diamond", { x: -43, y: 70, z: -43 } );
    mapBoletum.addSpawner( "emerald", { x: -11, y: 74, z: -12 } );
    mapBoletum.addSpawner( "emerald", { x: 9, y: 74, z: 12 } );
    
    /** 设置地图商人 */
    mapBoletum.addTrader( { x: -5, y: 68, z: 80 }, 180, "blocks_and_items" );
    mapBoletum.addTrader( { x: -82, y: 68, z: -5 }, 270, "blocks_and_items" );
    mapBoletum.addTrader( { x: 3, y: 68, z: -82 }, 0, "blocks_and_items" );
    mapBoletum.addTrader( { x: 80, y: 68, z: 3 }, 90, "blocks_and_items" );
    mapBoletum.addTrader( { x: -5, y: 68, z: 79 }, 180, "weapon_and_armor" );
    mapBoletum.addTrader( { x: -81, y: 68, z: -5 }, 270, "weapon_and_armor" );
    mapBoletum.addTrader( { x: 3, y: 68, z: -81 }, 0, "weapon_and_armor" );
    mapBoletum.addTrader( { x: 79, y: 68, z: 3 }, 90, "weapon_and_armor" );
    mapBoletum.addTrader( { x: 6, y: 68, z: 80.5 }, 0, "team_upgrade" );
    mapBoletum.addTrader( { x: -81.5, y: 68, z: 6 }, 90, "team_upgrade" );
    mapBoletum.addTrader( { x: -8, y: 68, z: -81.5 }, 180, "team_upgrade" );
    mapBoletum.addTrader( { x: 80.5 , y: 68, z: -8 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapBoletum;
    return [ mapBoletum, teamRed, teamBlue, teamGreen, teamYellow ];
    
}

function createMapCarapace( ) {

    /** 队伍信息初始化 */
    let mapCarapace = new BedwarsMap( "carapace", "甲壳", { highestBlockLimit: 91, distributeResource: false, clearResourceVelocity: false } );
    let teamRed = new BedwarsTeam( "red", { x: 0, y: 66, z: -48 }, 3, { x: 0, y: 66, z: -64 }, { x: 0, y: 66, z: -58 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 48, y: 66, z: 0 }, 0, { x: 64, y: 66, z: 0 }, { x: 58, y: 66, z: 0 } );
    let teamGreen = new BedwarsTeam( "green", { x: 0, y: 66, z: 48 }, 1, { x: 0, y: 66, z: 64 }, { x: 0, y: 66, z: 58 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: -48, y: 66, z: 0 }, 2, { x: -64, y: 66, z: 0 }, { x: -58, y: 66, z: 0 } );
    
    /** 移除多余实体，进行初始化 */
    mapCarapace.init()
    
    /** 设置地图的队伍 */
    mapCarapace.addTeam( teamRed ); 
    mapCarapace.addTeam( teamBlue ); 
    mapCarapace.addTeam( teamGreen ); 
    mapCarapace.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapCarapace.addSpawner( "diamond", { x: 31, y: 67, z: -30 } );
    mapCarapace.addSpawner( "diamond", { x: 30, y: 67, z: 31 } );
    mapCarapace.addSpawner( "diamond", { x: -31, y: 67, z: 30 } );
    mapCarapace.addSpawner( "diamond", { x: -30, y: 67, z: -31 } );
    mapCarapace.addSpawner( "emerald", { x: 0, y: 67, z: 0 } );
    mapCarapace.addSpawner( "emerald", { x: 0, y: 75, z: 0 } );
    
    /** 设置地图商人 */
    mapCarapace.addTrader( { x: 5, y: 66, z: -59 }, 180, "blocks_and_items" );
    mapCarapace.addTrader( { x: 59, y: 66, z: 5 }, 270, "blocks_and_items" );
    mapCarapace.addTrader( { x: -5, y: 66, z: 59 }, 0, "blocks_and_items" );
    mapCarapace.addTrader( { x: -59, y: 66, z: -5 }, 90, "blocks_and_items" );
    mapCarapace.addTrader( { x: 5, y: 66, z: -57 }, 180, "weapon_and_armor" );
    mapCarapace.addTrader( { x: 57, y: 66, z: 5 }, 270, "weapon_and_armor" );
    mapCarapace.addTrader( { x: -5, y: 66, z: 57 }, 0, "weapon_and_armor" );
    mapCarapace.addTrader( { x: -57, y: 66, z: -5 }, 90, "weapon_and_armor" );
    mapCarapace.addTrader( { x: -5, y: 66, z: -58 }, 0, "team_upgrade" );
    mapCarapace.addTrader( { x: 58, y: 66, z: -5 }, 90, "team_upgrade" );
    mapCarapace.addTrader( { x: 5, y: 66, z: 58 }, 180, "team_upgrade" );
    mapCarapace.addTrader( { x: -58, y: 66, z: 5 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapCarapace;
    return [ mapCarapace, teamRed, teamBlue, teamGreen, teamYellow ];
    
}

function createMapArchway( ) {
    /** 队伍信息初始化 */
    let mapArchway = new BedwarsMap( "archway", "拱形廊道", { highestBlockLimit: 91, healPoolRadius: 15, distributeResource: false } );
    let teamRed = new BedwarsTeam( "red", { x: -15, y: 66, z: -66 }, 3, { x: -14, y: 65, z: -79 }, { x: -14, y: 65, z: -75 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 66, y: 66, z: -15 }, 0, { x: 79, y: 65, z: -14 }, { x: 75, y: 65, z: -14 } );
    let teamGreen = new BedwarsTeam( "green", { x: 15, y: 66, z: 66 }, 1, { x: 14, y: 65, z: 79 }, { x: 14, y: 65, z: 75 } );
    let teamYellow = new BedwarsTeam( "yellow", { x: -66, y: 66, z: 15 }, 2, { x: -79, y: 65, z: 14 }, { x: -75, y: 65, z: 14 } );
    
    /** 移除多余实体，进行初始化 */
    mapArchway.init()
    
    /** 设置地图的队伍 */
    mapArchway.addTeam( teamRed ); 
    mapArchway.addTeam( teamBlue ); 
    mapArchway.addTeam( teamGreen ); 
    mapArchway.addTeam( teamYellow );
    
    /** 设置地图钻石和绿宝石生成点 */
    mapArchway.addSpawner( "diamond", { x: 34, y: 67, z: -49 } );
    mapArchway.addSpawner( "diamond", { x: 49, y: 67, z: 34 } );
    mapArchway.addSpawner( "diamond", { x: -34, y: 67, z: 49 } );
    mapArchway.addSpawner( "diamond", { x: -49, y: 67, z: -34 } );
    mapArchway.addSpawner( "emerald", { x: 0, y: 66, z: 0 } );
    mapArchway.addSpawner( "emerald", { x: 0, y: 76, z: 0 } );
    
    /** 设置地图商人 */
    mapArchway.addTrader( { x: -9, y: 65, z: -76 }, 90, "blocks_and_items" );
    mapArchway.addTrader( { x: 76, y: 65, z: -9 }, 180, "blocks_and_items" );
    mapArchway.addTrader( { x: 9, y: 65, z: 76 }, 270, "blocks_and_items" );
    mapArchway.addTrader( { x: -76, y: 65, z: 9 }, 90, "blocks_and_items" );
    mapArchway.addTrader( { x: -9, y: 65, z: -75 }, 90, "weapon_and_armor" );
    mapArchway.addTrader( { x: 75, y: 65, z: -9 }, 180, "weapon_and_armor" );
    mapArchway.addTrader( { x: 9, y: 65, z: 75 }, 270, "weapon_and_armor" );
    mapArchway.addTrader( { x: -75, y: 65, z: 9 }, 90, "weapon_and_armor" );
    mapArchway.addTrader( { x: -19, y: 65, z: -75.5 }, 270, "team_upgrade" );
    mapArchway.addTrader( { x: 75.5, y: 65, z: -19 }, 90, "team_upgrade" );
    mapArchway.addTrader( { x: 19, y: 65, z: 75.5 }, 90, "team_upgrade" );
    mapArchway.addTrader( { x: -75.5, y: 65, z: 19 }, 180, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapArchway;
    return [ mapArchway, teamRed, teamBlue, teamGreen, teamYellow ];

}


/** ===== 2队地图 ===== */

function createMapCryptic( ) {

    /** 队伍信息初始化 */
    let mapCryptic = new BedwarsMap( "cryptic", "神秘", { highestBlockLimit: 102, ironSpawnTimes: 5, distributeResource: false } );
    let teamRed = new BedwarsTeam( "red", { x: 2, y: 77, z: 73 }, 1, { x: 2, y: 78, z: 90 }, { x: 2, y: 78, z: 85 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 2, y: 77, z: -73 }, 3, { x: 2, y: 78, z: -90 }, { x: 2, y: 78, z: -85 } );
    
    /** 移除多余实体，进行初始化 */
    mapCryptic.init()
    
    /** 设置地图的队伍 */
    mapCryptic.addTeam( teamRed ); 
    mapCryptic.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapCryptic.addSpawner( "diamond", { x: -70, y: 80, z: 0 } );
    mapCryptic.addSpawner( "diamond", { x: 70, y: 75, z: 0 } );
    mapCryptic.addSpawner( "emerald", { x: 21, y: 70, z: 0 } );
    mapCryptic.addSpawner( "emerald", { x: -25, y: 83, z: 0 } );
    
    /** 设置地图商人 */
    mapCryptic.addTrader( { x: -2, y: 78, z: 87 }, 270, "blocks_and_items" );
    mapCryptic.addTrader( { x: 6, y: 78, z: -87 }, 90, "blocks_and_items" );
    mapCryptic.addTrader( { x: -2, y: 78, z: 85 }, 270, "weapon_and_armor" );
    mapCryptic.addTrader( { x: 6, y: 78, z: -85 }, 90, "weapon_and_armor" );
    mapCryptic.addTrader( { x: 6, y: 78, z: 86 }, 90, "team_upgrade" );
    mapCryptic.addTrader( { x: -3, y: 78, z: -86 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapCryptic;
    return [ mapCryptic, teamRed, teamBlue ];
    
}

function createMapFrost( ) {

    /** 队伍信息初始化 */
    let mapFrost = new BedwarsMap( "frost", "极寒", { highestBlockLimit: 97, ironSpawnTimes: 5 } );
    let teamRed = new BedwarsTeam( "red", { x: 0, y: 72, z: 59 }, 1, { x: 0, y: 72, z: 75 }, { x: 0, y: 72, z: 70 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 0, y: 72, z: -59 }, 3, { x: 0, y: 72, z: -75 }, { x: 0, y: 72, z: -70 } );
    
    /** 移除多余实体，进行初始化 */
    mapFrost.init()
    
    /** 设置地图的队伍 */
    mapFrost.addTeam( teamRed ); 
    mapFrost.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapFrost.addSpawner( "diamond", { x: 38, y: 77, z: -10 } );
    mapFrost.addSpawner( "diamond", { x: -38, y: 77, z: 10 } );
    mapFrost.addSpawner( "emerald", { x: 0, y: 78, z: -12 } );
    mapFrost.addSpawner( "emerald", { x: 0, y: 78, z: 12 } );
    
    /** 设置地图商人 */
    mapFrost.addTrader( { x: -6, y: 72, z: 72 }, 270, "blocks_and_items" );
    mapFrost.addTrader( { x: 6, y: 72, z: -72 }, 90, "blocks_and_items" );
    mapFrost.addTrader( { x: -6, y: 72, z: 70 }, 270, "weapon_and_armor" );
    mapFrost.addTrader( { x: 6, y: 72, z: -70 }, 90, "weapon_and_armor" );
    mapFrost.addTrader( { x: 6, y: 72, z: 71 }, 90, "team_upgrade" );
    mapFrost.addTrader( { x: -6, y: 72, z: -71 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapFrost;
    return [ mapFrost, teamRed, teamBlue ];
    
}

function createMapGarden( ) {

    /** 队伍信息初始化 */
    let mapGarden = new BedwarsMap( "garden", "花园", { highestBlockLimit: 97, ironSpawnTimes: 5 } );
    let teamRed = new BedwarsTeam( "red", { x: 79, y: 77, z: 0 }, 0, { x: 98, y: 79, z: 0 }, { x: 94, y: 79, z: 0 } );
    let teamBlue = new BedwarsTeam( "blue", { x: -79, y: 77, z: 0 }, 2, { x: -98, y: 79, z: 0 }, { x: -94, y: 79, z: 0 } );
    
    /** 移除多余实体，进行初始化 */
    mapGarden.init()
    
    /** 设置地图的队伍 */
    mapGarden.addTeam( teamRed ); 
    mapGarden.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapGarden.addSpawner( "diamond", { x: 0, y: 79, z: -52 } );
    mapGarden.addSpawner( "diamond", { x: 0, y: 79, z: 52 } );
    mapGarden.addSpawner( "emerald", { x: -21, y: 78, z: -21 } );
    mapGarden.addSpawner( "emerald", { x: 21, y: 78, z: 21 } );
    
    /** 设置地图商人 */
    mapGarden.addTrader( { x: 95, y: 79, z: 8 }, 180, "blocks_and_items" );
    mapGarden.addTrader( { x: -95, y: 79, z: -8 }, 0, "blocks_and_items" );
    mapGarden.addTrader( { x: 93, y: 79, z: 8 }, 180, "weapon_and_armor" );
    mapGarden.addTrader( { x: -93, y: 79, z: -8 }, 0, "weapon_and_armor" );
    mapGarden.addTrader( { x: 94, y: 79, z: -8 }, 0, "team_upgrade" );
    mapGarden.addTrader( { x: -94, y: 79, z: 8 }, 180, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapGarden;
    return [ mapGarden, teamRed, teamBlue ];
    
}

function createMapRuins( ) {

    /** 队伍信息初始化 */
    let mapRuins = new BedwarsMap( "ruins", "废墟", { highestBlockLimit: 96, ironSpawnTimes: 5 } );
    let teamRed = new BedwarsTeam( "red", { x: -4, y: 71, z: -64 }, 3, { x: 0, y: 72, z: -82 }, { x: 0, y: 72, z: -78 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 4, y: 71, z: 64 }, 1, { x: 0, y: 72, z: 82 }, { x: 0, y: 72, z: 78 } );
    
    /** 移除多余实体，进行初始化 */
    mapRuins.init()
    
    /** 设置地图的队伍 */
    mapRuins.addTeam( teamRed ); 
    mapRuins.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapRuins.addSpawner( "diamond", { x: -47, y: 71, z: -10 } );
    mapRuins.addSpawner( "diamond", { x: 47, y: 71, z: 10 } );
    mapRuins.addSpawner( "emerald", { x: 17, y: 71, z: -6 } );
    mapRuins.addSpawner( "emerald", { x: -17, y: 71, z: 6 } );
    
    /** 设置地图商人 */
    mapRuins.addTrader( { x: 6, y: 72, z: -80 }, 90, "blocks_and_items" );
    mapRuins.addTrader( { x: -6, y: 72, z: 80 }, 270, "blocks_and_items" );
    mapRuins.addTrader( { x: 6, y: 72, z: -79 }, 90, "weapon_and_armor" );
    mapRuins.addTrader( { x: -6, y: 72, z: 79 }, 270, "weapon_and_armor" );
    mapRuins.addTrader( { x: -6, y: 72, z: -79.5 }, 270, "team_upgrade" );
    mapRuins.addTrader( { x: 6, y: 72, z: 79.5 }, 90, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapRuins;
    return [ mapRuins, teamRed, teamBlue ];
    
}

function createMapPicnic( ) {

    /** 队伍信息初始化 */
    let mapPicnic = new BedwarsMap( "picnic", "野餐", { highestBlockLimit: 90, ironSpawnTimes: 5, distributeResource: false } );
    let teamRed = new BedwarsTeam( "red", { x: 0, y: 65, z: -62 }, 3, { x: 0, y: 64, z: -78 }, { x: 0, y: 64, z: -74 } );
    let teamBlue = new BedwarsTeam( "blue", { x: 0, y: 65, z: 61 }, 1, { x: 0, y: 64, z: 77 }, { x: 0, y: 64, z: 73 } );
    
    /** 移除多余实体，进行初始化 */
    mapPicnic.init()
    
    /** 设置地图的队伍 */
    mapPicnic.addTeam( teamRed ); 
    mapPicnic.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapPicnic.addSpawner( "diamond", { x: 48, y: 65, z: 10 } );
    mapPicnic.addSpawner( "diamond", { x: -48, y: 65, z: -10 } );
    mapPicnic.addSpawner( "emerald", { x: -7, y: 70, z: -11 } );
    mapPicnic.addSpawner( "emerald", { x: 8, y: 70, z: 12 } );

    /** 设置地图商人 */
    mapPicnic.addTrader( { x: 6, y: 64, z: -76 }, 90, "blocks_and_items" );
    mapPicnic.addTrader( { x: -6, y: 64, z: 75 }, 270, "blocks_and_items" );
    mapPicnic.addTrader( { x: 6, y: 64, z: -75 }, 90, "weapon_and_armor" );
    mapPicnic.addTrader( { x: -6, y: 64, z: 74 }, 270, "weapon_and_armor" );
    mapPicnic.addTrader( { x: -6, y: 64, z: -75.5 }, 270, "team_upgrade" );
    mapPicnic.addTrader( { x: 6, y: 64, z: 74.5 }, 90, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapPicnic;
    return [ mapPicnic, teamRed, teamBlue ];
    
}

function createMapLionTemple( ) {

    /** 队伍信息初始化 */
    let mapLionTemple = new BedwarsMap( "lion_temple", "狮庙", { highestBlockLimit: 100, distributeResource: false } );
    let teamRed = new BedwarsTeam( "red", { x: -2, y: 73, z: 58 }, 1, { x: -2, y: 75, z: 78 }, { x: -2, y: 75, z: 73 } );
    let teamBlue = new BedwarsTeam( "blue", { x: -2, y: 73, z: -58 }, 3, { x: -2, y: 75, z: -78 }, { x: -2, y: 75, z: -73 } );
    
    /** 移除多余实体，进行初始化 */
    mapLionTemple.init()
    
    /** 设置地图的队伍 */
    mapLionTemple.addTeam( teamRed ); 
    mapLionTemple.addTeam( teamBlue ); 
    
    /** 设置地图钻石和绿宝石生成点 */
    mapLionTemple.addSpawner( "diamond", { x: 53, y: 84, z: 0 } );
    mapLionTemple.addSpawner( "diamond", { x: -58, y: 84, z: 0 } );
    mapLionTemple.addSpawner( "emerald", { x: -20, y: 79, z: 0 } );
    mapLionTemple.addSpawner( "emerald", { x: 17, y: 84, z: 0 } );

    /** 设置地图商人 */
    mapLionTemple.addTrader( { x: -7, y: 75, z: 73 }, 270, "blocks_and_items" );
    mapLionTemple.addTrader( { x: 3, y: 75, z: -73 }, 90, "blocks_and_items" );
    mapLionTemple.addTrader( { x: -7, y: 75, z: 71 }, 270, "weapon_and_armor" );
    mapLionTemple.addTrader( { x: 3, y: 75, z: -71 }, 90, "weapon_and_armor" );
    mapLionTemple.addTrader( { x: 3, y: 75, z: 72 }, 90, "team_upgrade" );
    mapLionTemple.addTrader( { x: -7, y: 75, z: -72 }, 270, "team_upgrade" );
    
    /** 在 world 类中插入地图信息 */
    world.bedwarsMap = mapLionTemple;
    return [ mapLionTemple, teamRed, teamBlue ];
    
}
