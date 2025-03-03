/**
 * ===== 战斗逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 玩家受伤判定；
 * · 玩家死亡判定；
 * · 玩家重生过程判定；
 * · 当玩家掉落后，施加虚空伤害。
 */

import { Entity, EntityDieAfterEvent, EntityHurtAfterEvent, Player, ProjectileHitBlockAfterEvent, ProjectileHitEntityAfterEvent, world } from "@minecraft/server";
import { overworld } from "../../methods/positionManager";
import { map } from "../../methods/bedwarsMaps";
import { BedwarsPlayer, eachValidPlayer, getPlayerBedwarsInfo, playerIsValid } from "../../methods/bedwarsPlayer";
import { eachNearbyPlayer, entityIsNearby, setPlayerGamemode, showTitle } from "../../methods/playerManager";
import { tickToSecond } from "../../methods/time";
import { getItemAmount } from "../../methods/itemManager";

/** 普通模式战斗相关（Interval）
 * @description 重生点设置：将玩家的重生点设置到地图重生点，玩家死亡后将重生于此。
 * @description 上一次受伤判定：若玩家受伤未超过 10 秒，则保持受伤的记录状态并计时；超过 10 秒，则认为玩家未受到来自其他玩家的伤害。
 * @description 重生过程判定：对于死亡的玩家：（1）改为旁观模式；（2）若玩家有床则进行重生倒计时，倒计时结束后重生之。
 * @description 虚空伤害判定：当玩家掉进虚空后，将尝试施加200点的虚空伤害。
 */
export function combat() {
    eachValidPlayer( ( player, playerInfo ) => {
        /** ===== 重生点设置 ===== */
        player.setSpawnPoint( { ...map().spawnpointPos, dimension: overworld } );
        /** ===== 上一次受伤判定 ===== */
        if ( playerInfo.lastHurt.attackedSinceLastAttack < 200 ) {
            playerInfo.lastHurt.attackedSinceLastAttack++;
            if ( playerInfo.lastHurt.attackedSinceLastAttack >= 200 ) {
                playerInfo.resetHurtInfo();
            }
        };
        /** ===== 重生过程判定 ===== */
        if ( playerInfo.deathState.isDeath ) {
            setPlayerGamemode( player, "spectator" );
            if ( playerInfo.deathState.respawnCountdown > 0 ) {
                playerInfo.deathState.respawnCountdown--; // 进行重生倒计时
                if ( playerInfo.deathState.respawnCountdown % 20 === 19 ) { // 向玩家显示剩余的倒计时
                    showTitle( player, { translate: "title.respawning" }, { translate: "subtitle.respawning", with: [ `${tickToSecond(playerInfo.deathState.respawnCountdown)}` ] }, { fadeInDuration: 0 } )
                    player.sendMessage( { translate: "message.respawning", with: [ `${tickToSecond(playerInfo.deathState.respawnCountdown)}` ] } );
                }
            }
            else if ( playerInfo.deathState.respawnCountdown === 0 ) {
                playerInfo.spawn(); // 玩家在队伍中生成
                showTitle( player, { translate: "title.respawned" }, "", { fadeInDuration: 0 } ); // 显示玩家复活的消息
                player.sendMessage( { translate: "message.respawned" } );
            }
        };


        /** ===== 虚空伤害判定 ===== */
        player.runCommand( "execute if entity @s[x=~,y=0,z=~,dx=0,dy=-60,dz=0] run damage @s 200 void" )
    } )
}

/** 令死亡玩家执行的特殊内容
 * @description 薛定谔的玩家（即卡在暂停菜单或聊天栏界面而不能立刻重生的玩家）会导致非常多的问题，此处为对其的专门处理。
 * @description 重新重生：这类玩家重生后会直接出生在世界重生点，即中岛上方。因此，需要重新重生之。
 * @description 卡床问题：床被破坏后会遇到问题，这样玩家始终不重生，床被破坏后可以恶意卡死亡状态导致游戏无法结束。因此，如果玩家在没有床的状态下死亡超过5秒则直接淘汰。
 * @description 新游戏问题：游戏重开后会遇到问题，这样玩家可能持有错误的队伍信息进入下一局。因此如果检测到玩家的游戏ID不一致则直接设置为旁观者。
 */
export function deadPlayer() {

    /** 检测死亡玩家 */
    overworld.runCommand( "function lib/get_data/player_is_alive" );
    /** 令死亡玩家执行： */
    eachValidPlayer( ( player, playerInfo ) => {
        let isDead = !player.hasTag( "isAlive" );
        let nearSpawnpoint = entityIsNearby( player, map().spawnpointPos, 2 );
        /** 如果玩家不处于死亡状态，则重置其死亡状态的时长 */
        if ( !isDead ) { playerInfo.deathState.stayDeadTime = 0; }
        /** 如果玩家在重生点重生时为生存模式，则强制重新使其生成 */
        if ( nearSpawnpoint && player.getGameMode() === "survival" ) {
            playerInfo.spawn();
        };
        /** 如果玩家在床丢失后仍处于死亡状态，则 5 秒后直接淘汰之 */
        if ( isDead && !playerInfo.getBedState() && !playerInfo.deathState.isDeath ) {
            /** 进行计时 */
            playerInfo.deathState.stayDeadTime++;
            /** 警告之 */
            if ( playerInfo.deathState.stayDeadTime % 20 === 0 && playerInfo.deathState.stayDeadTime !== 100 ) {
                player.sendMessage( `§c§l请立即回到游戏！否则你将在${5 - Math.floor(playerInfo.deathState.stayDeadTime/20)}秒后被淘汰！` );
                player.playSound( "mob.cat.meow" )
            }
            if ( playerInfo.deathState.stayDeadTime === 100 ) {
                playerInfo.setPlayerDead();
                player.sendMessage( { translate: "message.eliminated" } );
                world.sendMessage( { translate: "message.kill.died", with: [ player.nameTag ] }, { translate: "message.finalKill" }, );
            }
        };
        /** 如果玩家的游戏 ID 与本局不匹配，则改为旁观者 */
        if ( isDead && playerInfo.gameId !== map().gameId ) {
            new BedwarsPlayer( player.name, undefined );
        };
    } )
}

/** 普通模式战斗相关（Event）
 * @description 玩家死亡判定：当玩家死亡后，设置其死亡的状态。如果玩家没有床，则通知该玩家已被淘汰。
 * @param {EntityDieAfterEvent} event
 */
export function playerDied( event ) {

    /** ===== 玩家死亡判定 ===== */
    if ( event.deadEntity.typeId === "minecraft:player" ) {
        /** 死亡玩家 @type {Player} */ let player = event.deadEntity;
        /** 死亡类型 */ let deathType = event.damageSource.cause;
        if ( playerIsValid( player ) ) {
            let playerInfo = getPlayerBedwarsInfo( player );
            playerInfo.setPlayerDead( deathType ); // 设置玩家为死亡状态
            if ( !playerInfo.getBedState() ) {
                player.sendMessage( { translate: "message.eliminated" } )
            } // 如果玩家已经没有床，则通知其已被淘汰
            /** 获取击杀者并播报死亡信息 */
            let killer = getKillerAndDeathMessage( player, playerInfo, event.damageSource.damagingEntity ).killer;
            /** 给予击杀者击杀奖励 */
            if ( killer !== undefined && killer.typeId === "minecraft:player" && playerIsValid( killer ) ) { 
                killBonus( player, playerInfo, killer, getPlayerBedwarsInfo( killer ) );
            }
            player.runCommand( `clear @s` ); // 清空死亡玩家的物品
        }
    }
}

/** 当玩家被其他玩家攻击后，记录攻击信息
 * @param {EntityHurtAfterEvent} event 
 */
export function hurtByPlayer( event ) {
    /** 必须满足以下条件才可执行：被攻击者和攻击者是玩家，且都有起床战争信息 */
    /** 被攻击的玩家 */ let player = bedwarsPlayerTest( event.hurtEntity );
    /** 攻击者 */ let attacker = bedwarsPlayerTest( event.damageSource.damagingEntity );
    if ( player && attacker ) {
        let playerInfo = getPlayerBedwarsInfo( player );
        playerInfo.addHurtInfo( attacker );
        showArmor( player );
    }
}

/** 当玩家被火球攻击后，记录攻击信息
 * @param {ProjectileHitBlockAfterEvent | ProjectileHitEntityAfterEvent} event 
 */
export function hurtByFireball( event ) {
    /** 必须满足以下条件才可执行：投掷物为火球，且火球的投掷者为有起床战争信息的玩家 */
    /** 扔出火球的玩家 */ let thrower = bedwarsPlayerTest( event.source );
    if ( event.projectile.typeId === "bedwars:fireball" && thrower !== undefined ) {

        /** 令火球击中点附近 4 格的玩家记录攻击者（不包括该玩家及其队友） */
        eachNearbyPlayer( event.location, 4, player => {
            if ( playerIsValid( player ) ) {
                let playerInfo = getPlayerBedwarsInfo( player );
                let throwerInfo = getPlayerBedwarsInfo( thrower );
                if ( playerInfo.team !== throwerInfo.team ) {
                    playerInfo.addHurtInfo( thrower );
                    showArmor( player );
                }
            }
        } )
    }
}



/** 播报击杀信息，并返回击杀类型和击杀者
 * @description 0：其他、1：被其他玩家杀死、2：被其他玩家射杀、3：被其他玩家炸死、4：被其他玩家扔下去摔死、5：被其他玩家扔到虚空、6：自走虚空、7：被玩家的傀儡击杀
 * @param {Player} player 被击杀者
 * @param {BedwarsPlayer} playerInfo 被击杀者的起床战争信息
 * @param {Entity|undefined} killer 击杀者
 * @returns { {id:Number,killer:Player|undefined} }
 */
function getKillerAndDeathMessage( player, playerInfo, killer ) {

    /** 是否为最终击杀，视玩家是否有床而决定 */ const isFinalKill =  playerInfo.getBedState() ? "" : "message.finalKill";
    /** 玩家的名字（带颜色） */ const playerName = player.nameTag;
    /** 玩家在一般情况下死亡 */
    function diedNormally() {
        world.sendMessage( [ { translate: "message.kill.died", with: [ player.nameTag ] } , { translate: isFinalKill }, ] );
        return { id: 0, killer: void 0 };
    }

    // 击杀者实际存在的情况
    if ( killer !== undefined ) {
        // 击杀者为玩家的情况
        if ( killer.typeId === "minecraft:player" ) {

            /** 击杀者的样式 */ const killStyle = getPlayerBedwarsInfo( killer ).killStyle;
            /** 击杀者的名字 */ const killerName = killer.nameTag;

            // 被射杀
            if ( playerInfo.deathState.deathType === "projectile" ) {
                world.sendMessage( [ { translate: `message.kill.beShot.${killStyle}`, with: [ playerName, killerName ] }, { translate: isFinalKill }, ] )
                return { id: 2, killer };
            }
            // 被击杀
            else {
                world.sendMessage( [ { translate: `message.kill.beKilled.${killStyle}`, with: [ playerName, killerName ] }, { translate: isFinalKill }, ] )
                return { id: 1, killer };
            }

        }
        // 击杀者不为玩家的情况（例如铁傀儡或蠹虫）
        else {

            /** 该实体的主人 @type {Player | undefined} */ const owner = killer.owner;

            // 如果有主人，则设定为被主人的傀儡所杀 message.kill.beKilledGolem.default=%s§7被%s§7的傀儡击杀。
            if ( owner !== undefined ) {

                /** 击杀者的样式 */ const killStyle = getPlayerBedwarsInfo( owner ).killStyle;
                /** 击杀者的名字 */ const ownerName = owner.nameTag

                world.sendMessage( [ { translate: `message.kill.beKilledGolem.${killStyle}`, with: [ playerName, ownerName ] }, { translate: isFinalKill }, ] );
                return { id: 7, killer: owner };

            }
            // 否则，判定为一般死亡
            else {
                diedNormally();
            }

        }

    }
    // 击杀者未实际存在，但上一次受伤信息存在，则击杀者为上一次受伤信息指定的玩家 */
    else if ( playerInfo.lastHurt.attacker !== undefined ) {
        const attacker = playerInfo.lastHurt.attacker;
        const attackerName = attacker.nameTag;
        const killStyle = getPlayerBedwarsInfo( attacker ).killStyle;

        // 被其他玩家炸死
        if ( playerInfo.deathState.deathType === "entityExplosion" ) {
            world.sendMessage( [ { translate: `message.kill.beKilled.${killStyle}`, with: [ playerName, attackerName ] }, { translate: isFinalKill }, ] )
            return { id: 3, killer: attacker };
        }
        // 被其他玩家扔下去摔死
        else if ( playerInfo.deathState.deathType === "fall" ) {
            world.sendMessage( [ { translate: `message.kill.beKilledFall.${killStyle}`, with: [ playerName, attackerName ] }, { translate: isFinalKill }, ] )
            return { id: 4, killer: attacker };
        }
        // 被其他玩家扔到虚空 message.kill.beKilledVoid.default=%s§7被%s§7扔下了虚空。
        else if ( playerInfo.deathState.deathType === "void" ) {
            world.sendMessage( [ { translate: `message.kill.beKilledVoid.${killStyle}`, with: [ playerName, attackerName ] }, { translate: isFinalKill }, ] )
            return { id: 5, killer: attacker };
        }
        // 其他情况
        else {
            diedNormally();
        }
    }
    // 其他则为自身原因
    else {
        // 自走虚空
        if ( playerInfo.deathState.deathType === "void" ) {
            world.sendMessage( [ { translate: `message.kill.fellIntoVoid`, with: [ playerName ] }, { translate: isFinalKill }, ] )
            return { id: 6, killer: void 0 };
        }
        // 其他情况
        else {
            diedNormally();
        }
    }
}

/** 为击杀者提供击杀奖励，并记录击杀数
 * @param {Player} player 被击杀者
 * @param {BedwarsPlayer} playerInfo 被击杀者的起床战争信息
 * @param {Player} killer 击杀者
 * @param {BedwarsPlayer} killerInfo 击杀者的起床战争信息
 */
function killBonus( player, playerInfo, killer, killerInfo ) {

    /** 奖励主逻辑
     * @param {"iron_ingot"|"gold_ingot"|"diamond"|"emerald"} bonusItem 奖励的物品 ID （不包含命名空间）
     * @param {function(Number): String} messageFunc 奖励消息，函数参数为被击杀者的物品数
     */
    let bonusLogic = ( bonusItem, messageFunc ) => {
        let bonusItemAmount = getItemAmount( player, `bedwars:${bonusItem}` );
        if ( bonusItemAmount > 0 ) {
            killer.runCommand( `give @s bedwars:${bonusItem} ${bonusItemAmount}` );
            killer.sendMessage( messageFunc( bonusItemAmount ) )
        }
    };

    /** 击杀后奖励资源 */
    bonusLogic( "iron_ingot", ironAmount => { return `§f+${ironAmount}块铁锭` } );
    bonusLogic( "gold_ingot", goldAmount => { return `§6+${goldAmount}块金锭` } );
    bonusLogic( "diamond", diamondAmount => { return `§b+${diamondAmount}钻石` } );
    bonusLogic( "emerald", emeraldAmount => { return `§2+${emeraldAmount}绿宝石` } );

    /** 击杀音效 */
    killer.playSound( "random.orb", { location: killer.location } );

    /** 记录击杀数 */
    if ( playerInfo.getBedState() ) { killerInfo.killCount.kill++; }
    else { killerInfo.killCount.finalKill++; };

}

/** 显示隐身玩家的盔甲
 * @param {Player} player 
 */
function showArmor( player ) {
    if ( player.getComponent( "minecraft:is_sheared" ) ) {
        player.triggerEvent( "show_armor" );
        player.sendMessage( { translate: "message.beHitWhenInvisibility" } );
    }
}

/** 检测实体是否为有起床战争信息的玩家
 * @param {Entity} entity 
 * @returns { Player | undefined }
 */
function bedwarsPlayerTest( entity ) {
    if ( entity && entity.typeId === "minecraft:player" && playerIsValid( entity ) ) { return entity; }
    else { return void 0; }
}
