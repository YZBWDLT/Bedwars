/**
 * ===== 起床战争方法 - 玩家 =====
 * 定义了玩家的起床战争信息，以及一些可用的玩家起床战争数据方法
 */

import { EntityDamageCause, Player, world } from "@minecraft/server";
import { map } from "./bedwarsMaps";
import { settings } from "./bedwarsSettings";
import { setPlayerGamemode } from "./playerManager";
import { getTeam as getTeamFunc } from "./bedwarsTeam";

export class BedwarsPlayer{

    /** 玩家名称 */ name = "";
    /** 玩家队伍 @type {import("./bedwarsTeam").validTeams|undefined} */ team = void 0;
    /** 玩家运行时 ID */ runtimeId = 0;
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
    /** 上一次受伤信息 */ lastHurt = {
        /** 伤害者信息 */ attacker: undefined,
        /** 自上一次伤害经过的时间 */ attackedSinceLastAttack: 200
    };

    /** 构建并初始化一个起床战争信息实例，并且按照输入的队伍自动设置玩家信息
     * @param {String} name 玩家名称
     * @param {import("./bedwarsTeam").validTeams|undefined} team 玩家队伍
     */
    constructor( name, team ) {
        this.name = name;
        this.team = team;
        if ( team === undefined ) { this.setSpectator(); } else { this.setTeamMember(); };
    };


    /** 获取玩家信息（获取同名玩家） */
    getThisPlayer( ) {
        return world.getPlayers().filter( player => { return player.name === this.name } )[0];
    };

    /** 获取玩家所在的队伍 */
    getTeam( ) {
        return getTeamFunc( this.team );
    };

    /** 按队伍设定玩家的昵称颜色
     * @param {*} name 玩家名称
     * @returns 
     */
    setNametag( ) {
        let player = this.getThisPlayer();
        switch ( this.team ) {
            case "red": player.nameTag = `§c${player.name}`; break;
            case "blue": player.nameTag = `§9${player.name}`; break;
            case "yellow": player.nameTag = `§e${player.name}`; break;
            case "green": player.nameTag = `§a${player.name}`; break;
            case "white": player.nameTag = `§f${player.name}`; break;
            case "cyan": player.nameTag = `§3${player.name}`; break;
            case "pink": player.nameTag = `§d${player.name}`; break;
            case "gray": player.nameTag = `§7${player.name}`; break;
            case "orange": player.nameTag = `§6${player.name}`; break;
            case "brown": player.nameTag = `§n${player.name}`; break;
            case "purple": player.nameTag = `§5${player.name}`; break;
            case undefined: default: player.nameTag = player.name; break;
        }
    };

    /** 设置玩家为旁观者 */
    setSpectator() {
        this.isSpectator = true;
        this.isEliminated = true;
        this.deathState.isDeath = true;
        this.deathState.respawnCountdown = -1;
        this.runtimeId = map().gameId;
        setPlayerGamemode( this.getThisPlayer(), "spectator" );
        this.getThisPlayer().triggerEvent( `remove_team` );
        this.setNametag();
        this.getThisPlayer().bedwarsInfo = this;
    };

    /** 设置玩家为某个队伍的队员 */
    setTeamMember() {
        this.isSpectator = false;
        this.isEliminated = false;
        this.deathState.isDeath = false;
        this.deathState.respawnCountdown = 100;
        this.runtimeId = map().gameId;
        setPlayerGamemode( this.getThisPlayer(), "survival" );
        this.getThisPlayer().triggerEvent( `team_${this.team}` );
        this.setNametag();
        this.getThisPlayer().bedwarsInfo = this;
    }

    /** 传送玩家到重生点 */
    teleportPlayerToSpawnpoint() {
        this.getThisPlayer().teleport( this.getTeam().spawnpoint, { facingLocation: this.getTeam().bedInfo.pos } )
    };

    /** 新增玩家的受伤信息
     * @param {Player} attacker 攻击者
     */
    addHurtInfo( attacker ) {
        this.lastHurt.attacker = attacker;
        this.lastHurt.attackedSinceLastAttack = 0;
    }

    /** 重置玩家的受伤信息 */
    resetHurtInfo( ) {
        this.lastHurt.attackedSinceLastAttack = 200;
        this.lastHurt.attacker = void 0;
        this.deathState.deathType = "";
    };

    /** 将玩家的镐和斧降级 */
    loseToolTier( ) {

        if ( this.equipment.axe > 1 ) {
            this.equipment.axe--;
        };

        if ( this.equipment.pickaxe > 1 ) {
            this.equipment.pickaxe--;
        };

    };

    /** 设置玩家为非死亡状态 */
    setPlayerAlive( ) {
        this.deathState.isDeath = false;
        this.deathState.respawnCountdown = 0;
        setPlayerGamemode( this.getThisPlayer(), "survival" )
    };

    /** 设置玩家为死亡状态
     * @param {EntityDamageCause} deathType 玩家的死亡类型
     */
    setPlayerDead( deathType ) {

        this.deathState.isDeath = true;
        
        /** 判断死亡类型，如果玩家死于：实体攻击、投射物、摔落、虚空、爆炸，则为显示死亡信息应予以记录，其他类型统一记录为其他 */
        if ( [ "entityAttack", "projectile", "fall", "void", "entityExplosion" ].includes( deathType ) ) { this.deathState.deathType = deathType; }
        else { this.deathState.deathType = "other"; };

        /** 设置重生时间 */
        if ( this.getBedState() ) {
            if ( this.deathState.isRejoinedPlayer ) {
                this.deathState.respawnCountdown = settings.respawnTime.rejoinedPlayers;
                this.deathState.isRejoinedPlayer = false;
            }
            else {
                this.deathState.respawnCountdown = settings.respawnTime.normalPlayers;
            }
        }
        else {
            this.deathState.respawnCountdown = -1;
            this.isEliminated = true;
        }

    }

    /** 获取玩家是否有床 */
    getBedState( ) {
        if ( map().mode === "capture" ) { return this.getTeam().captureInfo.bedsPos.length !== 0; }
        else { return this.getTeam().bedInfo.isExist; }
    };

    /** 玩家在队伍中生成
     * @param {{resetHurtInfo:Boolean,removeItem:Boolean,loseToolTier:Boolean}} option 生成选项
     */
    spawn( option = {} ) {
        const defaultOption = { resetHurtInfo: true, removeItem: true, loseToolTier: true };
        const { resetHurtInfo, removeItem, loseToolTier } = { ...defaultOption, ...option }

        this.setPlayerAlive();
        this.teleportPlayerToSpawnpoint();
        if ( resetHurtInfo ) { this.resetHurtInfo(); };
        if ( removeItem ) { this.getThisPlayer().runCommand( "clear @s" ); };
        if ( loseToolTier ) { this.loseToolTier(); };
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
 * @returns {BedwarsPlayer} 玩家的起床战争信息
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

/** 当在等待期间时，初始化玩家
 * @param {Player} player 
 */
export function initPlayer( player ) {
    player.runCommand( `clear @s` );
    player.runCommand( `function lib/modify_data/reset_ender_chest` );
    player.runCommand( `effect @s clear` );
    player.addEffect( "instant_health", 1, { amplifier: 49 } );
    player.triggerEvent( `remove_team` )
    delete player.bedwarsInfo;
    player.nameTag = player.name;
}
