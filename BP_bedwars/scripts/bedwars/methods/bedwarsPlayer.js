/**
 * ===== 起床战争方法 - 玩家 =====
 * 定义了玩家的起床战争信息，以及一些可用的玩家起床战争数据方法
 */

import { EntityDamageCause, Player, world } from "@minecraft/server";
import { map } from "./bedwarsMaps";
import { settings } from "./bedwarsSettings";
import { setPlayerGamemode } from "./playerManager";
import { getTeam as getTeamFunc } from "./bedwarsTeam";

/** @typedef { "default" | "flame" | "west" | "glory" | "pirate" | "love" | "christmas" | "meme" | "pack" | "newThreeKingdom" } killStyle 击杀样式 */

/** 可用的击杀样式 @type {killStyle[]} */
export const availableKillStyles = [
    "default", "flame", "west", "glory", "pirate", "love", "christmas", "meme", "pack", "newThreeKingdom"
]

export class BedwarsPlayer{

    /** 玩家名称 */ name = "";
    /** 玩家队伍 @type {import("./bedwarsTeam").validTeams|undefined} */ team = void 0;
    /** 玩家游戏 ID */ gameId = 0;
    /** 玩家是否正在旁观 */ isSpectator = false;
    /** 玩家是否被淘汰 */ isEliminated = false;
    /** 玩家装备等级 */ equipment = {
        /** 镐等级，无：0，木：1，铁：2，金：3，钻石：4 */ pickaxe: 0,
        /** 斧等级，无：0，木：1，石：2，铁：3，钻石：4 */ axe: 0,
        /** 盔甲等级，皮革：1，锁链：2，铁：3，钻石：4 */ armor: 1,
        /** 剪刀，无：0，有：1 */ shears: 0
    };
    /** 魔法牛奶状态 */ magicMilk = {
        /** 是否正处于魔法牛奶状态 */ enabled: false,
        /** 魔法牛奶剩余时间，单位：刻 */ remainingTime: 0
    };
    /** 死亡状态 */ deathState = {
        /** 是否处于死亡状态 */ isDeath: false,
        /** 重生倒计时，单位：刻 */ respawnCountdown: 100,
        /** 死亡类型 @type {""|"entityAttack"|"projectile"|"fall"|"void"|"entityExplosion"|"other"} */ deathType: "",
        /** 是否为退出重进的玩家 */ isRejoinedPlayer: false,
        /** 保持死亡状态的时长，单位：刻 */ stayDeadTime: 0,
    };
    /** 击杀数 */ killCount = {
        /** 普通击杀 */ kill: 0,
        /** 最终击杀 */ finalKill: 0,
        /** 破坏床数 */ bed: 0
    };
    /** 击杀样式 @type {killStyle} */ killStyle = "default";
    /** 上一次受伤信息 */ lastHurt = {
        /** 伤害者信息 @type { Player | undefined } */ attacker: undefined,
        /** 自上一次伤害经过的时间 */ attackedSinceLastAttack: 200
    };

    /** 构建并初始化一个起床战争信息实例，并且按照输入的队伍自动设置玩家信息
     * @param {String} name 玩家名称
     * @param {import("./bedwarsTeam").validTeams|undefined} team 玩家队伍，如果设置为undefined则为旁观者
     */
    constructor( name, team ) {
        this.name = name;
        this.team = team;
    };


    /** 获取玩家信息（获取同名玩家） */
    getThisPlayer( ) {
        return world.getPlayers().filter( player => { return player.name === this.name } )[0];
    };

    /** 获取玩家所在的队伍 */
    getTeam( ) {
        return getTeamFunc( this.team );
    };

    /** 新增玩家的受伤信息
     * @param {Player} attacker 攻击者
     */
    addHurtInfo( attacker ) {
        this.lastHurt.attacker = attacker;
        this.lastHurt.attackedSinceLastAttack = 0;
    }

    /** 获取玩家是否有床 */
    getBedState( ) {
        if ( map().mode === "capture" ) { return this.getTeam().captureInfo.bedsPos.length !== 0; }
        else { return this.getTeam().bedInfo.isExist; }
    };

}

/** 检查输入的玩家是否有起床战争信息
 * @param {Player} player 待检查的玩家
 */
export function playerIsValid( player ) {
    return player.bedwarsInfo !== undefined;
}

/** 检查输入的玩家是否有起床战争信息，并且存活
 * @param {Player} player 待检查的玩家
 */
export function playerIsAlive( player ) {
    let playerInfo = getPlayerBedwarsInfo( player );
    return playerInfo && !playerInfo.deathState.isDeath;
}

/** 获取玩家的起床战争信息
 * @param {Player} player 要获取信息的玩家
 * @returns {BedwarsPlayer|undefined} 玩家的起床战争信息
 */
export function getPlayerBedwarsInfo( player ) {
    return player.bedwarsInfo
}

/** 使每个拥有有效数据的玩家都执行一个函数；没有有效数据的玩家将不会执行任何东西。
 * @param {function(Player, BedwarsPlayer)} func - 一个接受 Player 类型参数的函数
 */
export function eachValidPlayer( func ) {
    world.getPlayers().filter( player => playerIsValid( player ) ).forEach( player => { func( player, getPlayerBedwarsInfo( player ) ); } );
}

/** 使每个存活的玩家都执行一个函数；没有有效数据的玩家或未存活将不会执行任何东西。
 * @param {function(Player, BedwarsPlayer)} func - 一个接受 Player 类型参数的函数
 */
export function eachAlivePlayer( func ) {
    world.getPlayers().filter( player => playerIsAlive( player ) ).forEach( player => { func( player, getPlayerBedwarsInfo( player ) ) } );
}

/** 获取所有有效玩家 */
export function getValidPlayers() {
    return world.getPlayers().filter( player => playerIsValid( player ) );
}

/** 警告玩家（播放音效）
 * @param {Player} player 玩家信息
 * @param {import("@minecraft/server").RawMessage} rawtext 输入的 rawtext
 */
export function warnPlayer( player, rawtext ) {
    player.playSound( "mob.shulker.teleport", { pitch: 0.5, location: player.location } );
    player.sendMessage( rawtext );
};
