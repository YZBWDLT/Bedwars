/**
 * ===== 起床战争方法 - 队伍 =====
 * 定义了队伍的起床战争信息，以及一些可用的队伍起床战争数据方法
 */

import { world } from "@minecraft/server";

import { getPlayerBedwarsInfo, playerIsValid } from "./bedwarsPlayer.js";
import { overworld, positionManager, Vector } from "./positionManager.js";
import { removeItemEntity } from "./itemManager.js";
import { map } from "./bedwarsMaps.js";

/** @enum {validTeams[]} 可用队伍列表 */
export const validTeams = [ "red", "blue", "yellow", "green", "pink", "cyan", "white", "gray", "purple", "brown", "orange" ];

/** 【类】队伍类 */
export class BedwarsTeam{

    /** 队伍 ID  @type {"red"|"blue"|"yellow"|"green"|"pink"|"cyan"|"white"|"gray"|"purple"|"brown"|"orange"} */ id = "red";
    /** 床信息，包括床位置、朝向、存在信息 */ bedInfo = {
        /** 床脚位置 */ pos: new Vector( 0, 0, 0 ),
        /** 朝向 @type {0|1|2|3} */ direction: 0,
        /** 床是否存在 */ isExist: true
    }
    /** 资源点信息，包括资源点位置和各类资源生成次数、倒计时 */ spawnerInfo = {
        /** 资源生成位置 */ spawnerPos: new Vector( 0, 0, 0 ),
        /** 铁生成次数 */ ironSpawned: 0,
        /** 金生成次数 */ goldSpawned: 0,
        /** 绿宝石生成次数 */ emeraldSpawned: 0,
        /** 铁生成倒计时 */ ironCountdown: 8,
        /** 金生成倒计时 */ goldCountdown: 120,
        /** 绿宝石生成倒计时 */ emeraldCountdown: 1500
    }
    /** 重生点信息 */ spawnpoint = new Vector( 0, 0, 0 );
    /** 队伍是否有效，开始时未分配到队员的队伍即为无效队伍 */ isValid = true;
    /** 队伍是否被淘汰，淘汰的队伍是没有床、没有存活队员的有效队伍 */ isEliminated = false;
    /** 箱子信息 */ chestInfo = {
        /** 箱子位置 */ chestPos: new Vector( 0, 0, 0 ),
        /** 箱子朝向 @type {0|1|2|3} */ chestDirection: 0,
        /** 末影箱位置*/ enderChestPos: new Vector( 0, 0, 0 ),
        /** 末影箱朝向 @type {0|1|2|3} */ enderChestDirection: 0
    };
    /** 团队升级信息 */ teamUpgrade = {
        /** 盔甲强化等级 @type {0|1|2|3|4} */ reinforcedArmor: 0,
        /** 治愈池 */ healPool: false,
        /** 疯狂矿工等级 @type {0|1|2} */ maniacMiner: 0,
        /** 锋利附魔 */ sharpenedSwords: false,
        /** 锻炉等级 @type {0|1|2|3|4} */ forge: 0,
        /** 末影龙增益 */ dragonBuff: false,
        /** 陷阱 #1，为""时则为空 @type {""|"its_a_trap"|"counter_offensive_trap"|"alarm_trap"|"miner_fatigue_trap"} */ trap1Type: "",
        /** 陷阱 #2，为""时则为空 @type {""|"its_a_trap"|"counter_offensive_trap"|"alarm_trap"|"miner_fatigue_trap"} */ trap2Type: "",
        /** 陷阱 #3，为""时则为空 @type {""|"its_a_trap"|"counter_offensive_trap"|"alarm_trap"|"miner_fatigue_trap"} */ trap3Type: ""
    };
    /** 陷阱信息 */ trapInfo = {
        /** 陷阱冷却启用状态 */ cooldownEnabled: false,
        /** 陷阱冷却倒计时，单位：游戏刻 */ cooldown: 600,
        /** 是否正在报警 */ isAlarming: false,
        /** 报警次数 */ alarmedTimes: 0
    };
    /** Capture 模式信息 */ captureModeInfo = {
        /** 床位置 @type {Vector[]} */ bedsPos: [],
        /** 队伍当前积分 */ score: 1500,
        /** 其他队伍合计的床数 */ otherTeamBedAmount: 1,
    };
    /** 
     * @param {"red"|"blue"|"yellow"|"green"|"pink"|"cyan"|"white"|"gray"|"purple"|"brown"|"orange"} id - 队伍 ID ，必须为选定值的某一个
     * @param {Vector} bedPos - 床的位置
     * @param {0|1|2|3} bedDirection - 床的方向
     * @param {Vector} resourceSpawnerPos - 资源点位置
     * @param {Vector} spawnpointPos - 重生点位置
     */
    constructor( id, bedPos, bedDirection, resourceSpawnerPos, spawnpointPos ) {
        this.id = ( validTeams.includes( id ) ) ? id : undefined;
        this.bedInfo.pos = bedPos;
        this.bedInfo.direction = bedDirection;
        this.spawnerInfo.spawnerPos = positionManager.center( resourceSpawnerPos );
        this.spawnpoint = positionManager.center( spawnpointPos );
    };
    /** 获取本队的队伍颜色 */
    getTeamColor( ) {
        switch ( this.id ) {
            case "red": return `§c`;
            case "blue": return `§9`;
            case "yellow": return `§e`;
            case "green": return `§a`;
            case "white": return `§f`;
            case "cyan": return `§3`;
            case "pink": return `§d`;
            case "gray": return `§7`;
            case "orange": return `§6`;
            case "brown": return `§n`;
            case "purple": default: return `§5`;
        }
    };
    /** 获取本队的队伍全名 */
    getTeamName( ) {
        switch ( this.id ) {
            case "red": return "红";
            case "blue": return "蓝";
            case "yellow": return "黄";
            case "green": return "绿";
            case "white": return "白";
            case "cyan": return "青";
            case "pink": return "粉";
            case "gray": return "灰";
            case "orange": return "橙";
            case "brown": return "棕";
            case "purple": default: return "紫";
        }
    };
    /** 获取本队的带颜色的队伍名
     * @description 例如："§c红"
     */
    getTeamNameWithColor( ) {
        return `${this.getTeamColor()}${this.getTeamName()}`;
    };
    /** 获取本队所有玩家 */
    getTeamMember( ) {
        return world.getPlayers().filter( player => { return playerIsValid(player) && getPlayerBedwarsInfo( player ).team === this.id } )
    };
    /** 获取本队未被淘汰的玩家 */
    getAliveTeamMember( ) {
        return world.getPlayers().filter( player => { return playerIsValid(player) && getPlayerBedwarsInfo( player ).team === this.id && !(getPlayerBedwarsInfo( player ).isEliminated) } )
    };
    /** 放置床 */
    setBed( ){

        /** 设置床的位置
         * @param {Vector} bedFeetPos 指定床脚位置
         * @param {Boolean} correctPos 是否修正床脚位置，使床在床脚位置处生成？否则将在x,y,z最小处生成。默认值：true。
         */
        let pos = ( bedFeetPos, correctPos = true ) => {

            let placePos = positionManager.copy( bedFeetPos );

            /** 若为0°/90°，则床不会有任何偏移，直接在床脚处生成 */
            if ( !correctPos || this.bedInfo.direction === 0 || this.bedInfo.direction === 1 ) { return placePos; }
            else if ( this.bedInfo.direction === 2 ) { return positionManager.add( placePos, -1, 0, 0 ); }
            else if ( this.bedInfo.direction === 3 ) { return positionManager.add( placePos, 0, 0, -1 ); }

        }
        /** 设置床旋转，不同旋转角度可能会导致床产生偏移 */
        let rotation = () => {
            if ( this.bedInfo.direction === 1 ) { return "Rotate90"; }
            else if ( this.bedInfo.direction === 2 ) { return "Rotate180"; }
            else if ( this.bedInfo.direction === 3 ) { return "Rotate270"; }
            else { return "None"; }
        }

        /** 加载结构，如果是夺点模式，则对于每一个该队伍已有的点位都重新设置床；否则，在该队的床点位设置床 */
        if ( map().mode === "capture" ) {
            this.captureModeInfo.bedsPos.forEach( bedPos => {
                world.structureManager.place( `beds:${this.id}_bed`, overworld, pos( bedPos, false ), { rotation: rotation() } );
            } )
        }
        else {
            world.structureManager.place( `beds:${this.id}_bed`, overworld, pos( this.bedInfo.pos ), { rotation: rotation() } );
        }
        
    };
    /** 设置队伍为无效队伍 */
    setTeamInvalid() {
        this.isValid = false;
        this.isEliminated = true;
        this.bedInfo.isExist = false;
        overworld.runCommand( `setblock ${this.bedInfo.pos.x} ${this.bedInfo.pos.y} ${this.bedInfo.pos.z} air destroy` )
        removeItemEntity( "minecraft:bed" );
    };
    /** 设置队伍为淘汰队伍 */
    setTeamEliminated() {
        this.isEliminated = true;
        world.sendMessage( [ "\n", { translate: "message.teamEliminated", with: [ `${this.getTeamNameWithColor()}` ] }, "\n " ] );
    };
    /** 获取其他队伍的床数 */
    getOtherTeamBed() {
        this.captureModeInfo.otherTeamBedAmount = 0;
        map().teamList.filter( otherTeam => otherTeam.id !== this.id ).forEach( otherTeam => {
            this.captureModeInfo.otherTeamBedAmount += otherTeam.captureModeInfo.bedsPos.length;
        } );
        return this.captureModeInfo.otherTeamBedAmount;
    };
}

/** 使每个队伍都执行一个函数
 * @param {function(BedwarsTeam)} func - 一个接受 BedwarsTeam 类型参数的函数
 */
export function eachTeam( func ) {
    map().teamList.forEach( team => { func( team ) } )
}

/** 从队伍 ID 获取队伍信息
 * @param {"red"|"blue"|"yellow"|"green"|"pink"|"cyan"|"white"|"gray"|"purple"|"brown"|"orange"} id 输入队伍的 ID
 */
export function getTeam( id ) {
    return map().teamList.find( team => team.id === id );
}
