/** 起床战争队伍 */

import { Player, world } from "@minecraft/server";
import { BedwarsPlayer, centerPosition, copyPosition, eachPlayer, eachValidPlayer, getPlayerNearby, playerIsAlive, playerIsValid, randomInt, removeItem, resourceTypeToResourceId, warnPlayer, spawnItem, showTitle } from "./methods"
import { overworld } from "./constants";
import { map } from "./maps";
import { settings } from "./settings";

/** @enum {validTeams[]} 可用队伍列表 */
export const validTeams = [ "red", "blue", "yellow", "green", "pink", "cyan", "white", "gray", "purple", "brown", "orange" ];

/** 【类】队伍类 */
export class BedwarsTeam{

    /** 【属性】队伍 ID 
     * @type {"red"|"blue"|"yellow"|"green"|"pink"|"cyan"|"white"|"gray"|"purple"|"brown"|"orange"}
     */
    id = "red";

    /** 【属性】床信息，包括床位置、朝向、存在信息 */
    bedInfo = {
        /** 床脚位置 @type {import("@minecraft/server").Vector3} */ pos: { x: 0, y: 0, z: 0 },
        /** 朝向 @type {0|1|2|3} */ direction: 0,
        /** 床是否存在 */ isExist: true
    }

    /** 【属性】资源点信息，包括资源点位置和各类资源生成次数、倒计时 */
    spawnerInfo = {
        /** 资源生成位置 @type {import("@minecraft/server").Vector3} */ spawnerPos: { x: 0, y: 0, z: 0 },
        /** 铁生成次数 */ ironSpawned: 0,
        /** 金生成次数 */ goldSpawned: 0,
        /** 绿宝石生成次数 */ emeraldSpawned: 0,
        /** 铁生成倒计时 */ ironCountdown: 8,
        /** 金生成倒计时 */ goldCountdown: 120,
        /** 绿宝石生成倒计时 */ emeraldCountdown: 1500
    }

    /** 【属性】重生点信息
     * @type {import("@minecraft/server").Vector3}
     */
    spawnpoint = { x: 0, y: 0, z: 0 };

    /** 【属性】队伍是否有效，开始时未分配到队员的队伍即为无效队伍 */
    isValid = true;

    /** 【属性】队伍是否被淘汰，淘汰的队伍是没有床、没有存活队员的有效队伍 */
    isEliminated = false;

    /** 【属性】箱子信息 */
    chestInfo = {
        /** 箱子位置 @type {import("@minecraft/server").Vector3} */ chestPos: { x: 0, y: 0, z: 0 },
        /** 箱子朝向 @type {0|1|2|3} */ chestDirection: 0,
        /** 末影箱位置 @type {import("@minecraft/server").Vector3}*/ enderChestPos: { x: 0, y: 0, z: 0 },
        /** 末影箱朝向 @type {0|1|2|3} */ enderChestDirection: 0
    };

    /** 【属性】团队升级信息 */
    teamUpgrade = {
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

    /** 【属性】陷阱信息 */
    trapInfo = {
        /** 陷阱冷却启用状态 */ cooldownEnabled: false,
        /** 陷阱冷却倒计时，单位：游戏刻 */ cooldown: 600,
        /** 是否正在报警 */ isAlarming: false,
        /** 报警次数 */ alarmedTimes: 0
    };

    /** 【构建器】
     * @param {"red"|"blue"|"yellow"|"green"|"pink"|"cyan"|"white"|"gray"|"purple"|"brown"|"orange"} id - 队伍 ID ，必须为选定值的某一个
     * @param {import("@minecraft/server").Vector3} bedPos - 床的位置
     * @param {0 | 1 | 2 | 3} bedDirection - 床的方向
     * @param {import("@minecraft/server").Vector3} resourceSpawnerPos - 资源点位置
     * @param {import("@minecraft/server").Vector3} spawnpointPos - 重生点位置
     */
    constructor( id, bedPos, bedDirection, resourceSpawnerPos, spawnpointPos ) {
        this.id = ( validTeams.includes( id ) ) ? id : undefined;
        this.bedInfo.pos = bedPos;
        this.bedInfo.direction = bedDirection;
        this.spawnerInfo.spawnerPos = centerPosition( resourceSpawnerPos );
        this.spawnpoint = centerPosition( spawnpointPos );
    }

    /** 【方法】获取本队的队伍名或队伍颜色
     * @param { "format_code" | "name" | "full_name" } type - 欲获取的内容，"format_code"：队伍颜色，"name"：队伍名称（带颜色）
     */
    getTeamName( type ) {
        switch ( this.id ) {
            case "red": return type === "format_code" ? `§c` : ( type === "name" ? `§c红` : `红队` )
            case "blue": return type === "format_code" ? `§9` : ( type === "name" ? `§9蓝` : "蓝队" )
            case "yellow": return type === "format_code" ? `§e` : ( type === "name" ? `§e黄` : "黄队" )
            case "green": return type === "format_code" ? `§a` : ( type === "name" ? `§a绿` : "绿队" )
            case "white": return type === "format_code" ? `§f` : ( type === "name" ? `§f白` : "白队" )
            case "cyan": return type === "format_code" ? `§3` : ( type === "name" ? `§3青` : "青队" )
            case "pink": return type === "format_code" ? `§d` : ( type === "name" ? `§d粉` : "粉队" )
            case "gray": return type === "format_code" ? `§7` : ( type === "name" ? `§7灰` : "灰队" )
            case "orange": return type === "format_code" ? `§6` : ( type === "name" ? `§6橙` : "橙队" )
            case "brown": return type === "format_code" ? `§n` : ( type === "name" ? `§n棕` : "棕队" )
            case "purple": default: return type === "format_code" ? `§5` : ( type === "name" ? `§5紫` : "紫队" )
        }
    }

    /** 【方法】获取本队所有玩家 */
    getTeamMember( ) {
        return world.getPlayers().filter( player => { return playerIsValid(player) && player.bedwarsInfo.team === this.id } )
    }

    /** 【方法】获取本队未被淘汰的玩家 */
    getAliveTeamMember( ) {
        return world.getPlayers().filter( player => { return playerIsValid(player) && player.bedwarsInfo.team === this.id && !(player.bedwarsInfo.isEliminated) } )
    }

    /** 【方法】床被无效玩家破坏时
     * @param {Player} breaker 破坏者信息
     */
    bedDestroyedByInvalidPlayer( breaker ) {
        this.setBed( );
        warnPlayer( breaker, { translate: "message.invalidPlayer.breakingBed" } );
    };

    /** 【方法】床被自家玩家破坏时
     * @param {Player} breaker 破坏者信息
     */
    bedDestroyedBySelfPlayer( breaker ) {
        this.setBed( );
        warnPlayer( breaker, { translate: "message.selfTeamPlayer.breakingBed" } );
    };
    
    /** 【方法】床被别队玩家破坏时
     * @param {Player} breaker 破坏者信息
     */
    bedDestroyedByOtherPlayer( breaker ) {
        this.bedInfo.isExist = false;
        /** @type {BedwarsPlayer} */ let breakerInfo = breaker.bedwarsInfo;
        breakerInfo.killCount.bed++;
        eachPlayer( player => {
            /** @type {BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;
            if ( playerInfo.team === this.id ) { playerInfo.selfBedDestroyed( player, breaker.nameTag ); }
            else { playerInfo.otherBedDestroyed( player, breaker.nameTag, this.id ); }
        } )
    }

    /** 【方法】放置床 */
    setBed( ){
        /** 设置床脚位置 */
        let pos = () => {
            let placePos = copyPosition( this.bedInfo.pos );
            switch ( this.bedInfo.direction ) {
                case 0: case 1: return placePos;
                case 2: return { ...placePos, x: placePos.x -= 1 };
                case 3: return { ...placePos, z: placePos.z -= 1 };
            }
        }
        /** 设置床旋转，不同旋转角度可能会导致床产生偏移 */
        let rotation = () => {
            switch (this.bedInfo.direction) {
                case 0: return "None";
                case 1: return "Rotate90";
                case 2: return "Rotate180";
                case 3: default: return "Rotate270";
            }
        }
        /** 加载结构 */
        world.structureManager.place( `beds:${this.id}_bed`, overworld, pos(), { rotation: rotation() } );
    };

    /** 【方法】为某队添加某队员
     * @param {Player} player - 待添加队伍的队员
     */
    addPlayer( player ){
        /** @type {BedwarsPlayer} */ let playerInfo = new BedwarsPlayer( player.name, this.id );
        playerInfo.runtimeId = map().gameId
        player.bedwarsInfo = playerInfo
        player.triggerEvent( `team_${this.id}` )
        player.nameTag = player.bedwarsInfo.setNameColor( player.name );
    };

    /** 【方法】在队伍的资源点位置刷新资源
     * @param {"iron"|"gold"|"emerald"} resourceType - 生成资源类型
     */
    spawnResources( resourceType ) {

        /** 生成点附近存活玩家的信息 */
        let nearbyPlayers = getPlayerNearby( this.spawnerInfo.spawnerPos, 2.5 ).filter( player => playerIsAlive( player ) );

        /** 生成判定函数：用于判断欲生成的资源是否已到达生成上限，如果未达到则生成之。绿宝石不共享倍率最大容量。
         * @param {import("@minecraft/server").Vector3} spawnPos - 生成位置
         */
        let spawnTest = ( spawnPos ) => {
            if ( resourceType === "iron" && this.spawnerInfo.ironSpawned < settings.resourceMaxSpawnTimes.iron * this.getForgeBonus() ) {
                spawnItem( spawnPos, "bedwars:iron_ingot", { clearVelocity: map().spawnerInfo.clearResourceVelocity } );
                this.spawnerInfo.ironSpawned++;
            }
            else if ( resourceType === "gold" && this.spawnerInfo.goldSpawned < settings.resourceMaxSpawnTimes.gold * this.getForgeBonus() ) {
                spawnItem( spawnPos, "bedwars:gold_ingot", { clearVelocity: map().spawnerInfo.clearResourceVelocity } );
                this.spawnerInfo.goldSpawned++;
            }
            else if ( resourceType === "emerald" && this.spawnerInfo.emeraldSpawned < settings.resourceMaxSpawnTimes.emerald && this.teamUpgrade.forge >= 3 ) {
                spawnItem( spawnPos, "bedwars:emerald", { clearVelocity: map().spawnerInfo.clearResourceVelocity } );
                this.spawnerInfo.emeraldSpawned++;
            }
        }

        /** ===== 判断逻辑 ===== */

        /** 生成点附近有玩家时，则直接给予玩家物品 */
        if ( nearbyPlayers.length !== 0 ) {
            let itemId = resourceTypeToResourceId( resourceType );
            if ( resourceType === "iron" || resourceType === "gold" ) {
                nearbyPlayers.forEach( player => { player.runCommand( `give @s ${itemId}` ); } );
            }
            if ( resourceType === "emerald" && this.teamUpgrade.forge >= 3 ) {
                nearbyPlayers.forEach( player => { player.runCommand( `give @s ${itemId}` ); } );
            }
        }
        /** 生成点附近没有玩家时，分散式生成启用时，以3*3分散式生成掉落物 */
        else if ( nearbyPlayers.length === 0 && map().spawnerInfo.distributeResource ) {
            let spawnPos = copyPosition( this.spawnerInfo.spawnerPos )
            spawnPos.x += randomInt( -1, 1 ); spawnPos.z += randomInt( -1, 1 );
            spawnTest( spawnPos );
        }
        /** 生成点附近没有玩家时，分散式生成未启用时，直接在原位生成掉落物 */
        else {
            spawnTest( this.spawnerInfo.spawnerPos );
        }
    };

    /** 【方法】移除队伍资源点的生成次数（可在有玩家接近时使用）
     */
    resetSpawnerSpawnedTimes( ) {
        this.spawnerInfo.goldSpawned = 0;
        this.spawnerInfo.ironSpawned = 0;
        this.spawnerInfo.emeraldSpawned = 0;
    };

    /** 【方法】获取资源因锻炉团队升级得到的速度加成和容量加成
     * @returns 若团队锻炉升级为 1 级，速度提升 50% ；为 2~3 级时，提升 100% ；为 4 级时，提升 200%
     */
    getForgeBonus( ) {
        switch ( this.teamUpgrade.forge ) {
            case 0: return 1;
            case 1: return 1.5;
            case 2: case 3: return 2;
            case 4: return 3;
        }
    }

    /** 【方法】当陷阱被触发时，执行的事件
     * @param {Player} enemyPlayer - 触发陷阱的敌人信息
     */
    triggerTrap( enemyPlayer ) {

        let teamPlayers = this.getTeamMember( );
        let trapTriggeredMessage = ( trapType ) => {
            teamPlayers.forEach( teamPlayer => {
                showTitle( teamPlayer, { translate: "title.trapTriggered" }, { translate: "subtitle.trapTriggered", with: { rawtext: [ { translate: `message.bedwars:upgrade_${trapType}` } ] } } )
                warnPlayer( teamPlayer, { translate: "message.trapTriggered", with: { rawtext: [ { translate: `message.bedwars:upgrade_${trapType}` } ] } } )
            } )
        }

        /** 启动陷阱 */
        switch ( this.teamUpgrade.trap1Type ) {
            case "its_a_trap":
                trapTriggeredMessage( this.teamUpgrade.trap1Type );
                enemyPlayer.addEffect( "blindness", 160 );
                enemyPlayer.addEffect( "slowness", 160 );
                break;
            case "counter_offensive_trap":
                trapTriggeredMessage( this.teamUpgrade.trap1Type );
                let teamPlayersNearBed = teamPlayers.filter( teamPlayer => getPlayerNearby( this.bedInfo.pos, 20 ).includes( teamPlayer ) )
                if ( teamPlayersNearBed.length !== 0 ) {
                    teamPlayersNearBed.forEach( teamPlayer => {
                        teamPlayer.addEffect( "jump_boost", 300, { amplifier: 1 } );
                        teamPlayer.addEffect( "speed", 300, { amplifier: 1 } );
                    } )
                }
                break;
            case "alarm_trap":
                enemyPlayer.removeEffect( "invisibility" )
                teamPlayers.forEach( teamPlayer => {
                    showTitle( teamPlayer, { translate: "title.trapTriggered.alarmTrap" }, { translate: "subtitle.trapTriggered.alarmTrap", with: [ `${enemyPlayer.bedwarsInfo.getTeam().getTeamName( "name" )}`, `${enemyPlayer.nameTag}` ] } )
                    warnPlayer( teamPlayer, { translate: "message.trapTriggered.alarmTrap", with: [ `${enemyPlayer.bedwarsInfo.getTeam().getTeamName( "name" )}`, `${enemyPlayer.nameTag}` ] } )    
                } )
                this.trapInfo.isAlarming = true;
                this.trapInfo.alarmedTimes = 0;
                break;
            case "miner_fatigue_trap":
                trapTriggeredMessage( this.teamUpgrade.trap1Type );
                enemyPlayer.addEffect( "mining_fatigue", 200 );
                break;
        }

        /** 陷阱顺延 */
        this.teamUpgrade.trap1Type = this.teamUpgrade.trap2Type;
        this.teamUpgrade.trap2Type = this.teamUpgrade.trap3Type;
        this.teamUpgrade.trap3Type = "";
        /** 开启 30 秒的冷却 */
        this.trapInfo.cooldownEnabled = true;
        this.trapInfo.cooldown = 600;

    }

    /** 【方法】施加疯狂矿工和治愈池的效果 */
    teamUpgradeEffect( ) {

        /** 疯狂矿工 */
        if ( this.teamUpgrade.maniacMiner > 0 ) {
            this.getTeamMember().forEach( player => { player.addEffect( "haste", 600, { amplifier: this.teamUpgrade.maniacMiner - 1 } ) } );
        }

        /** 治愈池 */
        if ( this.teamUpgrade.healPool ) {
            let playerInBase = getPlayerNearby( this.spawnpoint, map().healPoolRadius );
            this.getTeamMember().forEach( player => {
                if ( playerInBase.length !== 0 && playerInBase.includes( player ) ) {
                    player.addEffect( "regeneration", 100, { amplifier: 0 } )
                };
            } )
        }

    }

    /** 【方法】设置队伍为无效队伍 */
    setTeamInvalid() {
        this.isValid = false;
        this.isEliminated = true;
        this.bedInfo.isExist = false;
        overworld.runCommand( `setblock ${this.bedInfo.pos.x} ${this.bedInfo.pos.y} ${this.bedInfo.pos.z} air destroy` )
        removeItem( "minecraft:bed" );
    }

    /** 【方法】设置队伍已被淘汰 */
    setTeamEliminated() {
        this.isEliminated = true;
        eachValidPlayer( player => { player.sendMessage( [ "\n", { translate: "message.teamEliminated", with: [ `${this.getTeamName("name")}` ] }, "\n " ] ) } )
    }

}

