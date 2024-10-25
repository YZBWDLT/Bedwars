// 起床战争队伍类

import { world, system, Player, ItemStack, Entity, EnchantmentType, EquipmentSlot, Container, ScoreboardObjective } from "@minecraft/server"
import { overworld, resourceType } from "./constants.js"
import { map } from "./maps.js"
import { BedwarsTeam } from "./team.js";
import { settings } from "./settings.js";

// ===== 常用方法区 =====

/** 在a~b之间取随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 */
export function randomInt(min, max) {
    /** 确保 min <= max */
    if (min > max) { [min, max] = [max, min]; }
    return Math.floor(Math.random() * (max - min + 1)) + min;    // 生成 [min, max] 之间的随机整数
}

/** 将单位为刻的时间转换为以秒为单位的时间
 * @param {Number} tickTime 
 */
export function tickToSecond( tickTime ) {
    return Math.floor( tickTime / 20 ) + 1;
}

/** 将单位为秒的时间转换为以分钟为单位的时间，且可以直接返回字符串
 * @param {Number} secondTime - 时间值，单位：秒
 * @param {"string" | "value"} returnType - 返回类型
 */
export function secondToMinute( secondTime, returnType = "value" ) {
    let minute = Math.floor( secondTime / 60 );
    let second = secondTime - 60 * minute;
    if ( returnType === "string" ) {
        if ( second >= 0 && second < 10 ) { return `${minute}:0${second}` } else { return `${minute}:${second}` }
    }
    else { return { minute: minute, second: second } }
}

/** 获取玩家数目
 * @returns 玩家数目
 */
export function getPlayerAmount() {
    return world.getPlayers().length;
};

/** 检查输入的玩家是否有起床战争信息
 * @param {Player} player 
 */
export function playerIsValid( player ) {
    return player.bedwarsInfo !== undefined
}

/** 检查输入的玩家是否有起床战争信息，并且存活
 * @param {Player} player 
 */
export function playerIsAlive( player ) {
    return player.bedwarsInfo !== undefined && player.bedwarsInfo.deathState.isDeath !== true
}

/** 对特定玩家展示标题和副标题（作为原版API的重写）
 * @param {Player} player 
 * @param {String | import("@minecraft/server").RawMessage} title 
 * @param {String | import("@minecraft/server").RawMessage} subtitle 
 * @param {{
 * fadeInDuration: Number,
 * stayDuration: Number,
 * fadeOutDuration: Number
 * }} options 
 */
export function showTitle( player, title, subtitle = "", options = {} ) {
    const defaultOptions = { fadeInDuration: 10, stayDuration: 70,  fadeOutDuration: 20 }
    const allOptions = { ...defaultOptions, ...options }
    player.onScreenDisplay.setTitle( title, { fadeInDuration: allOptions.fadeInDuration, stayDuration: allOptions.stayDuration, fadeOutDuration: allOptions.fadeOutDuration, subtitle: subtitle } );
}

/** 警告玩家（播放音效）
 * @param {Player} player - 玩家信息
 * @param {import("@minecraft/server").RawMessage} rawtext - 输入的 rawtext
 */
export function warnPlayer( player, rawtext ) {
    player.playSound( "mob.shulker.teleport", { pitch: 0.5, location: player.location } );
    player.sendMessage( rawtext );
};

/** 获取在特定的位置附近是否有玩家
 * @param {import("@minecraft/server").Vector3} pos - 获取特定位置
 * @param {number} r - 检测位置附近的半径
 * @returns 返回玩家信息，或返回 false
 */
export function getPlayerNearby( pos, r ) {
    return overworld.getPlayers( { location: pos, maxDistance: r } )
}

/** 复制坐标，但不影响原有的坐标
 * @param {import("@minecraft/server").Vector3} pos - 坐标
 * @returns {import("@minecraft/server").Vector3} 返回复制的坐标
 */
export function copyPosition( pos ) {
    return { x: pos.x, y: pos.y, z: pos.z }
}

/** 用于按照给定的信息输出特定的 itemStack
 * @param {String} itemId - 物品 ID
 * @param {{
 * amount: Number,
 * enchantments: { id: String, level: Number }[],
 * itemLock: "none" | "inventory" | "slot",
 * lore: String[]
 * name: String
 * }} options 
 * @returns 
 */
export function itemInfo( itemId, options={} ) {

    // 可选项设置
    const defaultOptions = {
        amount: 1,
        enchantments: [],
        itemLock: "none",
        lore: [],
        name: undefined
    }; const allOptions = { ...defaultOptions, ...options };

    // 新建物品
    let item = new ItemStack( itemId, allOptions.amount );

    // 设置附魔
    if ( allOptions.enchantments.length !== 0 ) {
        allOptions.enchantments.forEach( enchantment => {
            // 只有当附魔为大于 0 级时才能施加，否则跳过这个步骤
            if ( enchantment.level > 0 ) {
                item.getComponent( "minecraft:enchantable" ).addEnchantment( { type: new EnchantmentType( enchantment.id ) , level: enchantment.level } )
            }
        } );
    }

    // 设置物品锁定
    item.lockMode = allOptions.itemLock;

    // 设置物品 Lore
    item.setLore( allOptions.lore );

    /** 设置物品的名称 */
    if ( allOptions.name !== undefined ) { item.nameTag = allOptions.name }

    // 返回 itemStack
    return item

}

/** 在特定位置生成物品
 * @param {import("@minecraft/server").Vector3} pos - 坐标
 * @param {String} itemId - 要生成的物品 ID
 * @param {{
 * amount: Number,
 * enchantments: { id: String, level: Number }[],
 * itemLock: "none" | "inventory" | "slot",
 * lore: String[]
 * name: String
 * clearVelocity: Boolean
 * }} options - 可设置项
 */
export function spawnItem( pos, itemId, options = {} ) {

    // 可选项设置
    const defaultOptions = { clearVelocity: true };
    const allOptions = { ...defaultOptions, ...options };

    // 获取 itemStack
    let item = itemInfo( itemId, options );

    // 物品生成
    ( allOptions.clearVelocity === true ) ? ( overworld.spawnItem( item, pos ).clearVelocity( ) ) : ( overworld.spawnItem( item, pos ) );

}

/** 用于给予玩家物品的函数，一般用于命令无法处理的复杂情况
 * @param {Player} player - 要给予物品的玩家
 * @param {String} itemId - 要给予物品的 ID
 * @param {{
 * amount: Number,
 * enchantments: { id: String, level: Number }[],
 * itemLock: "none" | "inventory" | "slot"
 * name: String
 * lore: String[]
 * }} options - 给予物品的附加选项，包括：数目、附魔、物品锁定
 */
export function giveItem( player, itemId, options = {} ) {

    // 获取 itemStack
    let item = itemInfo( itemId, options );

    // 给予玩家物品
    player.getComponent( "minecraft:inventory" ).container.addItem( item )
    
}

/** 用于设置玩家盔甲的函数，一般用于命令无法处理的复杂情况
 * @param {Player} player - 要给予物品的玩家
 * @param {String} itemId - 要给予物品的 ID
 * @param { "Head" | "Chest" | "Legs" | "Feet" } slot - 设置要重置的槽位
 * @param {{
 * amount: Number,
 * enchantments: { id: String, level: Number }[],
 * itemLock: "none" | "inventory" | "slot"
 * lore: String[]
 * name: String
 * }} options - 给予物品的附加选项，包括：数目、附魔、物品锁定
 */
export function replaceEquipmentItem( player, itemId, slot, options = {} ) {

    // 获取 itemStack
    let item = itemInfo( itemId, options );

    // 设置玩家物品
    player.getComponent( "minecraft:equippable" ).setEquipment( slot, item )
   
}

/** 用于设置玩家盔甲的函数，一般用于命令无法处理的复杂情况
 * @param {Player} player - 要给予物品的玩家
 * @param {String} itemId - 要给予物品的 ID
 * @param {Number} slot - 设置要重置的槽位，可选值 0 ~ 35
 * @param {{
 * amount: Number,
 * enchantments: { id: String, level: Number }[],
 * itemLock: "none" | "inventory" | "slot"
 * lore: String[]
 * name: String
 * }} options - 给予物品的附加选项，包括：数目、附魔、物品锁定
 */
export function replaceInventoryItem( player, itemId, slot, options = {} ) {

    // 获取 itemStack
    let item = itemInfo( itemId, options )

    // 给予玩家物品
    player.getComponent( "minecraft:inventory" ).container.setItem( slot, item )

}

/** 获取玩家拥有的物品数目
 * @param {Entity} entity 
 * @param {String} itemId 
 */
export function entityHasItemAmount( entity, itemId ) {

    // 获取待测实体的基础信息（包括：物品栏中为 itemId 的物品 inventoryItems、物品栏大小 inventorysize ）
    let inventory = entity.getComponent( "minecraft:inventory" ).container;
    let inventorysize = inventory.size;
    let inventoryItems= [];
    for ( let i = 0; i < inventorysize; i++ ){ inventoryItems.push( inventory.getItem( i ) ); }
    inventoryItems = inventoryItems.filter( item => { return item !== undefined } ).filter( item => { return item.typeId === itemId } );

    // 计算玩家所拥有的物品数目
    let itemAmount = 0;
    inventoryItems.forEach( item => { itemAmount += item.amount } )
    return itemAmount;

}

/** 输入资源类型，返回物品 ID
 * @param {resourceType} resourceType - 资源类型
 * @returns 返回物品 ID
 */
export function resourceTypeToResourceId( resourceType ) {
    switch ( resourceType ) {
        case "iron": return "bedwars:iron_ingot";
        case "gold": return "bedwars:gold_ingot";
        case "diamond": return "bedwars:diamond";
        case "emerald": return "bedwars:emerald";
        default: return "";
    }
}

/** 用于获取特定槽位下，特定附魔的等级
 * @param {Player} player - 要检测的玩家
 * @param {EquipmentSlot} slot - 要检测的槽位
 * @param {String} enchantmentId - 要检测的附魔
 * @returns {Number} 当该物品未定义或该物品无特定附魔时，返回 0 ；其余情况，返回附魔等级。
 */
export function getEnchantmentLevel( player, slot, enchantmentId ) {

    // 当该物品未定义时，返回 0
    if ( player.getComponent( "minecraft:equippable" ).getEquipment( slot ) === undefined ) {
        return 0;

    // 当该物品对应的附魔未定义时，返回 0
    } else if ( player.getComponent( "minecraft:equippable" ).getEquipment( slot ).getComponent( "minecraft:enchantable" ).getEnchantment( enchantmentId ) === undefined ) {
        return 0;

    // 除此之外的情况（即物品和附魔都有定义），返回对应数值
    } else {
        return player.getComponent( "minecraft:equippable" ).getEquipment( slot ).getComponent( "minecraft:enchantable" ).getEnchantment( enchantmentId ).level
    }
}

/** 使每个玩家都执行一个 callback 函数
 * @param {function(Player): void} callback - 一个接受 Player 类型参数的函数
 */
export function eachPlayer( callback ) {
    world.getPlayers().forEach( player => { callback( player ) } )
}

/** 使每个拥有有效数据的玩家都执行一个 callback 函数；没有有效数据的玩家将不会执行任何东西。
 * @param {function(Player): void} callback - 一个接受 Player 类型参数的函数
 */
export function eachValidPlayer( callback ) {
    let players = world.getPlayers().filter( player => playerIsValid( player ) )
    if ( players.length !== 0 ) { players.forEach( player => { callback( player ) } ) }
}

/** 使每个队伍都执行一个 callback 函数
 * @param {function(BedwarsTeam): void} callback - 一个接受 BedwarsTeam 类型参数的函数
 */
export function eachTeam( callback ) {
    map().teamList.forEach( team => { callback( team ) } )
}

/** 清除特定类型的物品
 * @param {String} itemId - 待清除的物品 ID
 */
export function removeItem( itemId ) {
    overworld.getEntities( { type: "minecraft:item" } ).forEach( item => {
        if ( item.getComponent( "minecraft:item" ).itemStack.typeId === itemId ) { item.remove( ) }
    } )
}

/** 检测某实体是否拥有ID中含有给定字符串的物品
 * @param {Entity} entity 
 * @param {String} stringOfItemId 
 */
export function hasItemTypeTest( entity, stringOfItemId ) {
    /** @type {Container} */ let entityItems = entity.getComponent("minecraft:inventory").container
    let eligibleItems = []; let item;
    for ( let i = 0 ; i < entityItems.size; i++ ) {
        item = entityItems.getItem( i );
        if ( item !== undefined && item.typeId.includes( stringOfItemId ) ) {
            eligibleItems.push( item );
        }
    }
    return eligibleItems;
}

/** 从队伍的名称获取到队伍的数字ID
 * @param {"red"|"blue"|"yellow"|"green"|"white"|"cyan"|"pink"|"gray"|"orange"|"brown"|"purple"|undefined} teamName - 待转换的队伍名称
 */
export function teamNameToTeamNumber( teamName ) {
    switch ( teamName ) {
        case "red": return 1; case "blue": return 2; case "yellow": return 3; case "green": return 4;
        case "white": return 5; case "cyan": return 6; case "pink": return 7; case "gray": return 8;
        case "orange": return 9; case "brown": return 10; case "purple": return 11; default: return 12;
    }
}

/** 从队伍的数字ID获取到队伍的名称
 * @param {1|2|3|4|5|6|7|8|9|10|11|12} teamNumber - 待转换的队伍数字ID
 */
export function teamNumberToTeamName( teamNumber ) {
    switch ( teamNumber ) {
        case 1: return "red"; case 2: return "blue"; case 3: return "yellow"; case 4: return "green";
        case 5: return "white"; case 6: return "cyan"; case 7: return "pink"; case 8: return "gray";
        case 9: return "orange"; case 10: return "brown"; case 11: return "purple"; default: return undefined;
    }
}

/** 当在等待期间时，初始化玩家
 * @param {Player} player 
 */
export function initPlayer( player ) {
    player.runCommand( `clear @s` );
    player.runCommand( `function lib/modify_data/reset_ender_chest` )
    player.runCommand( `effect @s clear` )
    player.addEffect( "instant_health", 1, { amplifier: 49 } )
    delete player.bedwarsInfo;
    player.nameTag = player.name
}

/** 返回将输入坐标中心化（x + 0.5，z + 0.5）的坐标
 * @param {import("@minecraft/server").Vector3} pos 待中心化的坐标
 */
export function centerPosition( pos ) {
    return { ...pos, x: pos.x + 0.5, z: pos.z + 0.5 }
}

// ===== 玩家类 =====

/**
 * 玩家类
 */
export class BedwarsPlayer{

    constructor( name, team ) {
        this.name = name;
        this.team = team;
        this.runtimeId = 0;
        this.isSpectator = false;
        this.isEliminated = false;
        this.equipment = { pickaxe: 0, axe: 0, armor: 1, shears: 0 };
        this.magicMilk = { enabled: false, remainingTime: 0 };
        this.deathState = { isDeath: false, respawnCountdown: 100, deathType: "", isRejoinedPlayer: false };
        this.killCount = { kill: 0, finalKill: 0, bed: 0 };
        this.lastHurt = { attacker: undefined, attackedSinceLastAttack: 100 };
    }

    /**
     * 按队伍设定玩家的昵称颜色
     * @param {String} name - 输入玩家的 name 
     * @returns 按队伍输出玩家的 nameTag
     */
    setNameColor( name ){
        switch ( this.team ) {
            case "red": return `§c${name}`;
            case "blue": return `§9${name}`;
            case "yellow": return `§e${name}`;
            case "green": return `§a${name}`;
            case "white": return `§f${name}`;
            case "cyan": return `§3${name}`;
            case "pink": return `§d${name}`;
            case "gray": return `§7${name}`;
            case "orange": return `§6${name}`;
            case "brown": return `§n${name}`;
            case "purple": return `§5${name}`;
            case undefined: return name;
            default: return name;
        }
    };

    /**
     * 当自家床被破坏后，播放消息
     * @param {Player} player - 要将此类消息播报给的玩家
     * @param {String} bedKiller - 破坏床的玩家的 nameTag
     */
    selfBedDestroyed( player, bedKiller ){
        showTitle( player, { translate: "title.bedDestroyed" }, { translate: "subtitle.bedDestroyed" } )
        player.playSound( "mob.wither.death" );
        player.sendMessage( [ "\n", { translate: "message.bedDestroyed", with: [ `${bedKiller}` ] }, "\n " ] );
    }

    /**
     * 当别队家床被破坏后，播放消息
     * @param {Player} player - 要将此类消息播报给的玩家
     * @param {String} bedKiller - 破坏床的玩家的 nameTag
     * @param {String} teamId - 被破坏床的队伍的队伍名称
     */
    otherBedDestroyed( player, bedKiller, teamId ){
        let soundPos = player.location; soundPos.y += 12;   // 末影龙的麦很炸（确信）
        player.playSound( "mob.enderdragon.growl", { location: soundPos } );
        player.sendMessage( [ "\n", { translate: "message.otherBedDestroyed", with: { rawtext: [ { translate: `team.${teamId}` }, { text: `${bedKiller}` } ] } }, "\n " ] );
    }

    /**
     * 获取玩家所在的队伍
     */
    getTeam( ) {
        return map().teamList.filter( team => { return team.id === this.team } )[0]
    }

    /**
     * 获取玩家信息
     */
    getThisPlayer() {
        return world.getPlayers().filter( player => { return player.name === this.name } )[0]
    }

    /**
     * 在物品栏中显示陷阱状态
     */
    showTrapsInInventory() {

        /** 获取基本信息 */
        let team = this.getTeam()
        let trap1 = team.teamUpgrade.trap1Type;
        let trap2 = team.teamUpgrade.trap2Type;
        let trap3 = team.teamUpgrade.trap3Type;

        /** 获取陷阱名称 @param { "" | "its_a_trap" | "counter_offensive_trap" | "alarm_trap" | "miner_fatigue_trap" } trapQueueType - 陷阱类型 */
        let trapName = ( trapQueueType ) => { switch ( trapQueueType ) { case "": return "无陷阱！"; case "its_a_trap": return "这是个陷阱！"; case "counter_offensive_trap": return "反击陷阱"; case "alarm_trap": return "报警陷阱"; case "miner_fatigue_trap": return "挖掘疲劳陷阱"; } }

        /** 获取陷阱颜色 @param { "" | "its_a_trap" | "counter_offensive_trap" | "alarm_trap" | "miner_fatigue_trap" } trapQueueType - 陷阱类型 */
        let trapColor = ( trapQueueType ) => { return trapQueueType === "" ? "§r§c" : "§r§a"}

        /** 获取下个陷阱要消耗的钻石数 */
        let nextTrapNeedsDiamond = () => { return team.teamUpgrade.trap1Type === "" ? "§b1 钻石" : ( team.teamUpgrade.trap2Type === "" ? "§b2 钻石" : ( team.teamUpgrade.trap3Type === "" ? "§b4 钻石" : "§c陷阱队列已满！" ) ) }

        /** 获取陷阱的代表物品 @param { "" | "its_a_trap" | "counter_offensive_trap" | "alarm_trap" | "miner_fatigue_trap" } trapQueueType - 陷阱类型 */
        let trapItem = ( trapQueueType ) => { switch ( trapQueueType ) { case "": return "minecraft:light_gray_stained_glass"; case "its_a_trap": return "minecraft:tripwire_hook"; case "counter_offensive_trap": return "minecraft:feather"; case "alarm_trap": return "minecraft:redstone_torch"; case "miner_fatigue_trap": return "minecraft:iron_pickaxe"; } }

        replaceInventoryItem( this.getThisPlayer(), trapItem(trap1), 15, { name: `${trapColor(trap1)}陷阱 #1 ： ${trapName(trap1)}`, lore: [ "§r§7第一个敌人进入你的基地时将触发此陷阱！", "", "§r§7购买的陷阱将在此排队触发。\n陷阱的价格将随着队列中陷阱的数量而增加。", "", `§r§7下个陷阱： ${nextTrapNeedsDiamond()}` ], itemLock: "slot" } )
        replaceInventoryItem( this.getThisPlayer(), trapItem(trap2), 16, { name: `${trapColor(trap2)}陷阱 #2 ： ${trapName(trap2)}`, lore: [ "§r§7第二个敌人进入你的基地时将触发此陷阱！", "", "§r§7购买的陷阱将在此排队触发。\n陷阱的价格将随着队列中陷阱的数量而增加。", "", `§r§7下个陷阱： ${nextTrapNeedsDiamond()}` ], itemLock: "slot" } )
        replaceInventoryItem( this.getThisPlayer(), trapItem(trap3), 17, { name: `${trapColor(trap3)}陷阱 #3 ： ${trapName(trap3)}`, lore: [ "§r§7第三个敌人进入你的基地时将触发此陷阱！", "", "§r§7购买的陷阱将在此排队触发。\n陷阱的价格将随着队列中陷阱的数量而增加。", "", `§r§7下个陷阱： ${nextTrapNeedsDiamond()}` ], itemLock: "slot" } )

    }

    /**
     * 传送玩家到重生点
     */
    teleportPlayerToSpawnpoint() {
        this.getThisPlayer().teleport( this.getTeam().spawnpoint, { facingLocation: this.getTeam().bedInfo.pos } )
    }

    /**
     * 当玩家死亡后，执行此内容
     * @param {Entity} killer - 击杀者的信息
     */
    playerDied( killer = undefined ) {

        /** 设置玩家为死亡状态 */
        this.deathState.isDeath = true;
        let player = this.getThisPlayer()

        /** 给予击杀者奖励和击杀数 <lang> @param {Player} killer */
        let killBonus = ( killer, isFinalKill = false ) => {
            let ironIngotAmount = entityHasItemAmount( player, "bedwars:iron_ingot" );
            let goldIngotAmount = entityHasItemAmount( player, "bedwars:gold_ingot" );
            let diamondAmount = entityHasItemAmount( player, "bedwars:diamond" );
            let emeraldAmount = entityHasItemAmount( player, "bedwars:emerald" );
            if ( ironIngotAmount > 0 ) {
                killer.runCommand( `give @s bedwars:iron_ingot ${ironIngotAmount}` )
                killer.sendMessage( `§f+${ironIngotAmount}块铁锭` )
            }
            if ( goldIngotAmount > 0 ) {
                killer.runCommand( `give @s bedwars:gold_ingot ${goldIngotAmount}` )
                killer.sendMessage( `§6+${goldIngotAmount}块金锭` )
            }
            if ( diamondAmount > 0 ) {
                killer.runCommand( `give @s bedwars:diamond ${diamondAmount}` )
                killer.sendMessage( `§b+${diamondAmount}钻石` )
            }
            if ( emeraldAmount > 0 ) {
                killer.runCommand( `give @s bedwars:emerald ${emeraldAmount}` )
                killer.sendMessage( `§2+${emeraldAmount}绿宝石` )
            }
            killer.playSound( "random.orb", { location: killer.location } )
            if ( playerIsValid( killer ) ) {
                isFinalKill ? killer.bedwarsInfo.killCount.finalKill++ : killer.bedwarsInfo.killCount.kill++
            }
        }

        /** 玩家有床时 */
        if ( this.getTeam().bedInfo.isExist ) {

            /** 设置死亡重生时间 */
            this.deathState.respawnCountdown = this.deathState.isRejoinedPlayer ? settings.respawnTime.rejoinedPlayers : settings.respawnTime.normalPlayers;
            this.deathState.isRejoinedPlayer = false;

            /** 按类型播报死亡消息，分发击杀奖励 */
            if ( this.deathState.deathType === "entityAttack" && killer.typeId === "minecraft:player" ) {
                world.sendMessage( { translate: "message.playerDied.beKilled", with: [ `${player.nameTag}`, `${killer.nameTag}` ] } );
                killBonus( killer );
            } else if ( this.deathState.deathType === "entityExplosion" && this.lastHurt.attacker !== undefined ) {
                world.sendMessage( { translate: "message.playerDied.beKilled", with: [ `${player.nameTag}`, `${this.lastHurt.attacker.nameTag}` ] } );
                killBonus( this.lastHurt.attacker );
            } else if ( this.deathState.deathType === "projectile" && killer.typeId === "minecraft:player" ) {
                world.sendMessage( { translate: "message.playerDied.beShot", with: [ `${player.nameTag}`, `${killer.nameTag}` ] } );    
                killBonus( killer );
            } else if ( this.deathState.deathType === "fall" && this.lastHurt.attacker !== undefined ) {
                world.sendMessage( { translate: "message.playerDied.beKilledFall", with: [ `${player.nameTag}`, `${this.lastHurt.attacker.nameTag}` ] } );    
                killBonus( this.lastHurt.attacker );
            } else if ( this.deathState.deathType === "void" && this.lastHurt.attacker !== undefined ) {
                world.sendMessage( { translate: "message.playerDied.beKilledVoid", with: [ `${player.nameTag}`, `${this.lastHurt.attacker.nameTag}` ] } );    
                killBonus( this.lastHurt.attacker );
            } else if ( this.deathState.deathType === "void" && this.lastHurt.attacker === undefined ) {
                world.sendMessage( { translate: "message.playerDied.fellIntoVoid", with: [ `${player.nameTag}` ] } );    
            } else {
                world.sendMessage( { translate: "message.playerDied.died", with: [ `${player.nameTag}` ] } );
            }

        /** 玩家没有床时 */
        } else {

            /** 设置不能重生，提示玩家已被淘汰 */
            this.deathState.respawnCountdown = -1;
            this.getThisPlayer().sendMessage( { translate: "message.eliminated" } )
            this.isEliminated = true;

            /** 播报信息，给予击杀者奖励 */
            if ( this.deathState.deathType === "entityAttack" && killer.typeId === "minecraft:player" ) {
                world.sendMessage( { translate: "message.playerDied.finalKill.beKilled", with: [ `${player.nameTag}`, `${killer.nameTag}` ] } );
                killBonus( killer, true );
            } else if ( this.deathState.deathType === "entityExplosion" && this.lastHurt.attacker !== undefined ) {
                world.sendMessage( { translate: "message.playerDied.finalKill.beKilled", with: [ `${player.nameTag}`, `${this.lastHurt.attacker.nameTag}` ] } );
                killBonus( this.lastHurt.attacker, true );
            } else if ( this.deathState.deathType === "projectile" && killer.typeId === "minecraft:player" ) {
                world.sendMessage( { translate: "message.playerDied.finalKill.beShot", with: [ `${player.nameTag}`, `${killer.nameTag}` ] } );    
                killBonus( killer, true );
            } else if ( this.deathState.deathType === "fall" && this.lastHurt.attacker !== undefined ) {
                world.sendMessage( { translate: "message.playerDied.finalKill.beKilledFall", with: [ `${player.nameTag}`, `${this.lastHurt.attacker.nameTag}` ] } );    
                killBonus( this.lastHurt.attacker, true );
            } else if ( this.deathState.deathType === "void" && this.lastHurt.attacker !== undefined ) {
                world.sendMessage( { translate: "message.playerDied.finalKill.beKilledVoid", with: [ `${player.nameTag}`, `${this.lastHurt.attacker.nameTag}` ] } );    
                killBonus( this.lastHurt.attacker, true );
            } else if ( this.deathState.deathType === "void" && this.lastHurt.attacker === undefined ) {
                world.sendMessage( { translate: "message.playerDied.finalKill.fellIntoVoid", with: [ `${player.nameTag}` ] } );    
            } else {
                world.sendMessage( { translate: "message.playerDied.finalKill.died", with: [ `${player.nameTag}` ] } );
            }
            
        }

        /** 清除玩家的物品 */
        player.runCommand( `clear @s` )

    }

    /**
     * 当玩家重生后，执行此内容
     */
    playerRespawned() {

        let player = this.getThisPlayer()

        /** 设置玩家的游戏模式 */
        player.getGameMode() !== "creative" ? player.setGameMode( "survival" ) : null;

        /** 设置玩家为非死亡状态 */
        this.deathState.isDeath = false; this.deathState.respawnCountdown = 0;

        /** 清除玩家的物品 */
        player.runCommand( "clear @s" )

        /** 将玩家的镐和斧降级 */
        this.equipment.axe > 1 ? this.equipment.axe-- : null;
        this.equipment.pickaxe > 1 ? this.equipment.pickaxe-- : null;

        /** 显示信息 */
        showTitle( player, { translate: "title.respawned" }, "", { fadeInDuration: 0 } );
        player.sendMessage( { translate: "message.respawned" } );

        /** 将玩家传送到重生点位置 */
        this.teleportPlayerToSpawnpoint()

        /** 清空玩家的受伤信息 */
        this.lastHurt.attackedSinceLastAttack = 200;
        this.lastHurt.attacker = undefined;
        this.deathState.deathType = ""
    }

    /**
     * 给玩家提供剑
     */
    swordSupplier() {

        let player = this.getThisPlayer();
        let haveSwordTest = () => {
            let types = [ "wooden", "stone", "iron", "diamond" ];
            let haveSword = false;
            for ( let type of types ) {
                if ( player.runCommand( `execute if entity @s[hasitem={item=bedwars:${type}_sword}]` ).successCount === 1 ) {
                    haveSword = true;
                }
            }
            return haveSword
        }
        if ( !haveSwordTest() ) {
            if ( this.getTeam().teamUpgrade.sharpenedSwords === false ) {
                player.runCommand( `give @s bedwars:wooden_sword 1 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
            } else {
                giveItem( player, "bedwars:wooden_sword", { enchantments: [ { id: "sharpness", level: 1 } ], itemLock: "inventory" } );
            }
        }

    }

    /**
     * 给玩家提供斧头
     */
    axeSupplier() {

        let player = this.getThisPlayer();

        /** 判断玩家是否有斧头 */
        let haveAxeTest = () => {
            let types = [ "wooden", "stone", "iron", "diamond" ];
            let haveAxe = false;
            for ( let type of types ) {
                if ( player.runCommand( `execute if entity @s[hasitem={item=bedwars:${type}_axe}]` ).successCount === 1 ) {
                    haveAxe = true;
                }
            }
            return haveAxe
        }
        if ( !haveAxeTest() ) {

            /** 设置斧头的种类 */
            let axeType = () => {
                if ( this.equipment.axe === 1 ) { return "bedwars:wooden_axe" }
                else if ( this.equipment.axe === 2 ) { return "bedwars:stone_axe" }
                else if ( this.equipment.axe === 3 ) { return "bedwars:iron_axe" }
                else { return "bedwars:diamond_axe" }
            }

            /** 设置斧头的附魔 */
            let axeEnchantmentLevel = () => {
                if ( this.equipment.axe === 1 || this.equipment.axe === 2  ) { return 1 }
                else if ( this.equipment.axe === 3 ) { return 2 }
                else { return 3 }
            }
            let axeEnchantment = [ { id: "efficiency", level: axeEnchantmentLevel() } ];
            this.getTeam().teamUpgrade.sharpenedSwords ? axeEnchantment.push( { id: "sharpness", level: 1 } ) : null;

            /** 给予斧头 */
            this.equipment.axe >= 1 ? giveItem( player, axeType(), { itemLock: "inventory", enchantments: axeEnchantment } ) : null
        }

    }

    /**
     * 给玩家提供镐子
     */
    pickaxeSupplier() {

        let player = this.getThisPlayer();

        /** 判断玩家是否有镐子 */
        let havePickaxeTest = () => {
            let types = [ "wooden", "iron", "golden", "diamond" ];
            let havePickaxe = false;
            for ( let type of types ) {
                if ( player.runCommand( `execute if entity @s[hasitem={item=bedwars:${type}_pickaxe}]` ).successCount === 1 ) {
                    havePickaxe = true;
                }
            }
            return havePickaxe
        }
        if ( !havePickaxeTest() ) {

            /** 设置镐子的种类 */
            let pickaxeType = () => {
                if ( this.equipment.pickaxe === 1 ) { return "bedwars:wooden_pickaxe" }
                else if ( this.equipment.pickaxe === 2 ) { return "bedwars:iron_pickaxe" }
                else if ( this.equipment.pickaxe === 3 ) { return "bedwars:golden_pickaxe" }
                else { return "bedwars:diamond_pickaxe" }
            }

            /** 设置镐子的附魔 */
            let pickaxeEnchantmentLevel = () => {
                if ( this.equipment.pickaxe === 1 || this.equipment.pickaxe === 2  ) { return 1 }
                else if ( this.equipment.pickaxe === 3 ) { return 2 }
                else { return 3 }
            }
            let pickaxeEnchantment = [ { id: "efficiency", level: pickaxeEnchantmentLevel() } ];

            /** 给予镐子 */
            this.equipment.pickaxe >= 1 ? giveItem( player, pickaxeType(), { itemLock: "inventory", enchantments: pickaxeEnchantment } ) : null
        }

    }

    /**
     * 给玩家提供剪刀
     */
    shearsSupplier() {

        let player = this.getThisPlayer();

        if ( player.runCommand( `execute if entity @s[hasitem={item=bedwars:shears}]` ).successCount === 0 ) {
            /** 给予剪刀 */
            this.equipment.shears >= 1 ? giveItem( player, "bedwars:shears", { itemLock: "inventory" } ) : null
        }

    }

    show2TeamsScoreboard() {

        /** @param {BedwarsTeam} team */
        let teamState = ( team ) => {
            if ( team.bedInfo.isExist ) { return "§a✔" }
            else if ( team.getAliveTeamMember().length > 0 ) { return `§a${team.getAliveTeamMember().length}` }
            else { return "§c✘" }
        }

        /** @param {BedwarsTeam} team */
        let playerInTeam = ( team ) => {
            if ( this.team === team.id ) { return "§7（你）" } else { return "" }
        }

        let infoBoardTitle = "§l§e       起床战争§r       "
        let infoBoardMode = `§82队经典模式 ${map().gameId}§r`
        let infoBoardGameEvent = `${map().getEventName()} - §a${secondToMinute( tickToSecond( map().gameEvent.nextEventCountdown ), "string" )}§r`
        let infoBoardTeam1 = `${map().teamList[0].getTeamName("name")} §f${map().teamList[0].getTeamName("full_name")} ： ${teamState(map().teamList[0])} ${playerInTeam(map().teamList[0])}`
        let infoBoardTeam2 = `${map().teamList[1].getTeamName("name")} §f${map().teamList[1].getTeamName("full_name")} ： ${teamState(map().teamList[1])} ${playerInTeam(map().teamList[1])}`
        let infoBoardKillCount = `§f击杀数 ： §a${this.killCount.kill}`
        let infoBoardFinalKillCount = `§f最终击杀数 ： §a${this.killCount.finalKill}`
        let infoBoardBedBreakCount = `§f破坏床数 ： §a${this.killCount.bed}`
        let infoBoardAuthor = "§e一只卑微的量筒"
        let infoBoardSpectator = `§f您当前为旁观者`

        let player = this.getThisPlayer()
        if ( this.team !== undefined ) {
            player.onScreenDisplay.setActionBar( `${infoBoardTitle}\n${infoBoardMode}\n\n${infoBoardGameEvent}\n\n${infoBoardTeam1}\n${infoBoardTeam2}\n\n${infoBoardKillCount}\n${infoBoardFinalKillCount}\n${infoBoardBedBreakCount}\n\n${infoBoardAuthor}` )
        } else {
            player.onScreenDisplay.setActionBar( `${infoBoardTitle}\n${infoBoardMode}\n\n${infoBoardGameEvent}\n\n${infoBoardTeam1}\n${infoBoardTeam2}\n\n${infoBoardSpectator}\n\n${infoBoardAuthor}` )
        }

    }

    /**
     * 为玩家展示四队记分板
     */
    show4TeamsScoreboard() {

        /** @param {BedwarsTeam} team */
        let teamState = ( team ) => {
            if ( team.bedInfo.isExist ) { return "§a✔" }
            else if ( team.getAliveTeamMember().length > 0 ) { return `§a${team.getAliveTeamMember().length}` }
            else { return "§c✘" }
        }

        /** @param {BedwarsTeam} team */
        let playerInTeam = ( team ) => {
            if ( this.team === team.id ) { return "§7（你）" } else { return "" }
        }

        let infoBoardTitle = "§l§e       起床战争§r       "
        let infoBoardMode = `§84队经典模式 ${map().gameId}§r`
        let infoBoardGameEvent = `${map().getEventName()} - §a${secondToMinute( tickToSecond( map().gameEvent.nextEventCountdown ), "string" )}§r`
        let infoBoardTeam1 = `${map().teamList[0].getTeamName("name")} §f${map().teamList[0].getTeamName("full_name")} ： ${teamState(map().teamList[0])} ${playerInTeam(map().teamList[0])}`
        let infoBoardTeam2 = `${map().teamList[1].getTeamName("name")} §f${map().teamList[1].getTeamName("full_name")} ： ${teamState(map().teamList[1])} ${playerInTeam(map().teamList[1])}`
        let infoBoardTeam3 = `${map().teamList[2].getTeamName("name")} §f${map().teamList[2].getTeamName("full_name")} ： ${teamState(map().teamList[2])} ${playerInTeam(map().teamList[2])}`
        let infoBoardTeam4 = `${map().teamList[3].getTeamName("name")} §f${map().teamList[3].getTeamName("full_name")} ： ${teamState(map().teamList[3])} ${playerInTeam(map().teamList[3])}`
        let infoBoardKillCount = `§f击杀数 ： §a${this.killCount.kill}`
        let infoBoardFinalKillCount = `§f最终击杀数 ： §a${this.killCount.finalKill}`
        let infoBoardBedBreakCount = `§f破坏床数 ： §a${this.killCount.bed}`
        let infoBoardAuthor = "§e一只卑微的量筒"
        let infoBoardSpectator = `§f您当前为旁观者`

        let player = this.getThisPlayer()
        if ( this.team !== undefined ) {
            player.onScreenDisplay.setActionBar( `${infoBoardTitle}\n${infoBoardMode}\n\n${infoBoardGameEvent}\n\n${infoBoardTeam1}\n${infoBoardTeam2}\n${infoBoardTeam3}\n${infoBoardTeam4}\n\n${infoBoardKillCount}\n${infoBoardFinalKillCount}\n${infoBoardBedBreakCount}\n\n${infoBoardAuthor}` )
        } else {
            player.onScreenDisplay.setActionBar( `${infoBoardTitle}\n${infoBoardMode}\n\n${infoBoardGameEvent}\n\n${infoBoardTeam1}\n${infoBoardTeam2}\n${infoBoardTeam3}\n${infoBoardTeam4}\n\n${infoBoardSpectator}\n\n${infoBoardAuthor}` )
        }
    }

    show8TeamsScoreboard() {
        /** @param {BedwarsTeam} team */
        let teamState = ( team ) => {
            if ( team.bedInfo.isExist ) { return "§a✔" }
            else if ( team.getAliveTeamMember().length > 0 ) { return `§a${team.getAliveTeamMember().length}` }
            else { return "§c✘" }
        }
        
        /** @param {BedwarsTeam} team */
        let playerInTeam = ( team ) => {
            if ( this.team === team.id ) { return "§7（你）" } else { return "" }
        }
        
        let infoBoardTitle = "§l§e       起床战争§r       "
        let infoBoardMode = `§88队经典模式 ${map().gameId}§r`
        let infoBoardGameEvent = `${map().getEventName()} - §a${secondToMinute( tickToSecond( map().gameEvent.nextEventCountdown ), "string" )}§r`
        let infoBoardTeam1 = `${map().teamList[0].getTeamName("name")} §f${map().teamList[0].getTeamName("full_name")} ： ${teamState(map().teamList[0])} ${playerInTeam(map().teamList[0])}`
        let infoBoardTeam2 = `${map().teamList[1].getTeamName("name")} §f${map().teamList[1].getTeamName("full_name")} ： ${teamState(map().teamList[1])} ${playerInTeam(map().teamList[1])}`
        let infoBoardTeam3 = `${map().teamList[2].getTeamName("name")} §f${map().teamList[2].getTeamName("full_name")} ： ${teamState(map().teamList[2])} ${playerInTeam(map().teamList[2])}`
        let infoBoardTeam4 = `${map().teamList[3].getTeamName("name")} §f${map().teamList[3].getTeamName("full_name")} ： ${teamState(map().teamList[3])} ${playerInTeam(map().teamList[3])}`
        let infoBoardTeam5 = `${map().teamList[4].getTeamName("name")} §f${map().teamList[4].getTeamName("full_name")} ： ${teamState(map().teamList[4])} ${playerInTeam(map().teamList[4])}`
        let infoBoardTeam6 = `${map().teamList[5].getTeamName("name")} §f${map().teamList[5].getTeamName("full_name")} ： ${teamState(map().teamList[5])} ${playerInTeam(map().teamList[5])}`
        let infoBoardTeam7 = `${map().teamList[6].getTeamName("name")} §f${map().teamList[6].getTeamName("full_name")} ： ${teamState(map().teamList[6])} ${playerInTeam(map().teamList[6])}`
        let infoBoardTeam8 = `${map().teamList[7].getTeamName("name")} §f${map().teamList[7].getTeamName("full_name")} ： ${teamState(map().teamList[7])} ${playerInTeam(map().teamList[7])}`
        let infoBoardAuthor = "§e一只卑微的量筒"
        let infoBoardSpectator = `§f您当前为旁观者`
        
        let player = this.getThisPlayer()
        if ( this.team !== undefined ) {
            player.onScreenDisplay.setActionBar( `${infoBoardTitle}\n${infoBoardMode}\n\n${infoBoardGameEvent}\n\n${infoBoardTeam1}\n${infoBoardTeam2}\n${infoBoardTeam3}\n${infoBoardTeam4}\n${infoBoardTeam5}\n${infoBoardTeam6}\n${infoBoardTeam7}\n${infoBoardTeam8}\n\n${infoBoardAuthor}` )
        } else {
            player.onScreenDisplay.setActionBar( `${infoBoardTitle}\n${infoBoardMode}\n\n${infoBoardGameEvent}\n\n${infoBoardTeam1}\n${infoBoardTeam2}\n${infoBoardTeam3}\n${infoBoardTeam4}\n${infoBoardTeam5}\n${infoBoardTeam6}\n${infoBoardTeam7}\n${infoBoardTeam8}\n\n${infoBoardSpectator}\n\n${infoBoardAuthor}` )
        }
        
    }

    /**
     * 玩家退出时，备份数据
     * @param {Player} player - 正在退出的玩家信息
     */
    dataBackup( player ) {
        let name = player.name;
    
        system.run( () => {
            overworld.runCommand( `scoreboard objectives add "${name}" dummy` )
            overworld.runCommand( `scoreboard players set team "${name}" ${teamNameToTeamNumber( this.team )}` )
            overworld.runCommand( `scoreboard players set axeTier "${name}" ${this.equipment.axe}` )
            overworld.runCommand( `scoreboard players set pickaxeTier "${name}" ${this.equipment.pickaxe}` )
            overworld.runCommand( `scoreboard players set shearsTier "${name}" ${this.equipment.shears}` )
            overworld.runCommand( `scoreboard players set armorTier "${name}" ${this.equipment.armor}` )
            overworld.runCommand( `scoreboard players set killCount "${name}" ${this.killCount.kill}` )
            overworld.runCommand( `scoreboard players set finalKillCount "${name}" ${this.killCount.finalKill}` )
            overworld.runCommand( `scoreboard players set bedDestroyed "${name}" ${this.killCount.bed}` )
            overworld.runCommand( `scoreboard players set runtimeId "${name}" ${this.runtimeId}` )
        } )
    
    }

    /**
     * @param {ScoreboardObjective} data 
     */
    dataReset( data ) {

        let player = this.getThisPlayer()

        /** 将备份记分板中的数据还原到玩家数据中，然后移除备份记分板 */
        this.equipment.axe = data.getScore( "axeTier" );
        this.equipment.pickaxe = data.getScore( "pickaxeTier" );
        this.equipment.shears = data.getScore( "shearsTier" );
        this.equipment.armor = data.getScore( "armorTier" );
        this.killCount.kill = data.getScore( "killCount" );
        this.killCount.finalKill = data.getScore( "finalKillCount" );
        this.killCount.bed = data.getScore( "bedDestroyed" );
        this.runtimeId = data.getScore( "runtimeId" );
        world.scoreboard.removeObjective( player.name )

        /** 杀死该玩家，然后设置更长时间的重生时间 */
        this.deathState.isRejoinedPlayer = true;
        player.kill()

        /** 播报消息 */
        this.getTeam().bedInfo.isExist ? player.sendMessage( { translate: "message.playerRejoin.haveBed" } ) : player.sendMessage( { translate: "message.playerRejoin.haveNoBed" } );

    }

    /** */
    showHealth( ) {
        this.getThisPlayer().runCommand( `scoreboard players set @s health ${Math.floor(this.getThisPlayer().getComponent("health").currentValue)}` )
    }

}

/**
 * 打印对象键值对
 * @param {Object} obj - 输入对象
 */
export function object_print(obj) {
    if (obj == undefined) return world.sendMessage(`<§6Undefined§r>`) // 如果输入的内容是Undefined，则整体输出Undefined
    let str_l_1 = []
    try { str_l_1.push(`<§6Object ${obj.constructor.name}`) }
    catch { str_l_1.push(`<§6Object Module`) } // str_l_1现在输出对象的构造函数名，并会尝试检查错误
    let str_l_2 = []
    for (let key in obj) {  // 对象中的每个元素遍历
        let a = `    §a${key} : ` ; let b = ``
        try {obj[key]} catch {continue} // 忽略obj[key]可能造成的错误
        if (obj[key] instanceof Function) { // 如果得到的obj[key]是一个对象中的方法，则输出为`${key}: <Bound Method>`
            b = `§e<Bound Method>`
            str_l_2.push(a + b)
        }
        else {  // 其他情况（即obj[key]不是一个方法）下
            let obj_name = ""
            try {obj_name = obj[key].constructor.name} catch {obj_name = obj[key]}  // 尝试输出构造函数名，如果输出不了一点则直接输出obj[key]本身
            if (!["String","Number","Boolean"].includes(obj_name) &&  obj_name != undefined && obj_name != null) b = `§b<Object ${obj_name}>`
                    // 字符串、数值、布尔值，undefined和null都是直接输出的
            else b = `§b${obj[key]}`    // 如果满足上面的几种情况，直接输出该键对应的值本身
            str_l_1.push(a + b) // 将上面所输出的值添加，以保证非Function是输出在上面的
        }
        
    }
    str_l_2.push("§r>") // 结尾
    world.sendMessage(str_l_1.join('\n') + "\n" + str_l_2.join('\n'));
}
export function object_print_no_method(obj) {
    if (obj == undefined) return world.sendMessage(`<§6Undefined§r>`) // 如果输入的内容是Undefined，则整体输出Undefined
    let str_l_1 = []
    try { str_l_1.push(`<§6Object ${obj.constructor.name}`) }
    catch { str_l_1.push(`<§6Object Module`) } // str_l_1现在输出对象的构造函数名，并会尝试检查错误
    let str_l_2 = []
    for (let key in obj) {  // 对象中的每个元素遍历
        let a = `    §a${key} : ` ; let b = ``
        try {obj[key]} catch {continue} // 忽略obj[key]可能造成的错误
        if (obj[key] instanceof Function) { // 如果得到的obj[key]是一个对象中的方法，则输出为`${key}: <Bound Method>`
        }
        else {  // 其他情况（即obj[key]不是一个方法）下
            let obj_name = ""
            try {obj_name = obj[key].constructor.name} catch {obj_name = obj[key]}  // 尝试输出构造函数名，如果输出不了一点则直接输出obj[key]本身
            if (!["String","Number","Boolean"].includes(obj_name) &&  obj_name != undefined && obj_name != null) b = `§b<Object ${obj_name}>`
                    // 字符串、数值、布尔值，undefined和null都是直接输出的
            else b = `§b${obj[key]}`    // 如果满足上面的几种情况，直接输出该键对应的值本身
            str_l_1.push(a + b) // 将上面所输出的值添加，以保证非Function是输出在上面的
        }
        
    }
    str_l_2.push("§r>") // 结尾
    world.sendMessage(str_l_1.join('\n') + "\n" + str_l_2.join('\n'));
}
export function object_print_actionbar(obj) {
    if (obj == undefined) return eachPlayer( player => { player.onScreenDisplay.setActionBar(`<§6Undefined§r>`) } )// 如果输入的内容是Undefined，则整体输出Undefined
    let str_l_1 = []
    try { str_l_1.push(`<§6Object ${obj.constructor.name}`) }
    catch { str_l_1.push(`<§6Object Module`) } // str_l_1现在输出对象的构造函数名，并会尝试检查错误
    let str_l_2 = []
    for (let key in obj) {  // 对象中的每个元素遍历
        let a = `    §a${key} : ` ; let b = ``
        try {obj[key]} catch {continue} // 忽略obj[key]可能造成的错误
        if (obj[key] instanceof Function) { // 如果得到的obj[key]是一个对象中的方法，则输出为`${key}: <Bound Method>`
            b = `§e<Bound Method>`
            str_l_2.push(a + b)
        }
        else {  // 其他情况（即obj[key]不是一个方法）下
            let obj_name = ""
            try {obj_name = obj[key].constructor.name} catch {obj_name = obj[key]}  // 尝试输出构造函数名，如果输出不了一点则直接输出obj[key]本身
            if (!["String","Number","Boolean"].includes(obj_name) &&  obj_name != undefined && obj_name != null) b = `§b<Object ${obj_name}>`
                    // 字符串、数值、布尔值，undefined和null都是直接输出的
            else b = `§b${obj[key]}`    // 如果满足上面的几种情况，直接输出该键对应的值本身
            str_l_1.push(a + b) // 将上面所输出的值添加，以保证非Function是输出在上面的
        }
        
    }
    str_l_2.push("§r>") // 结尾
    eachPlayer( player => { player.onScreenDisplay.setActionBar(str_l_1.join('\n') + "\n" + str_l_2.join('\n')) } );
}
export function object_print_actionbar_no_method(obj) {
    if (obj == undefined) return eachPlayer( player => { player.onScreenDisplay.setActionBar(`<§6Undefined§r>`) } )// 如果输入的内容是Undefined，则整体输出Undefined
    let str_l_1 = []
    try { str_l_1.push(`<§6Object ${obj.constructor.name}`) }
    catch { str_l_1.push(`<§6Object Module`) } // str_l_1现在输出对象的构造函数名，并会尝试检查错误
    let str_l_2 = []
    for (let key in obj) {  // 对象中的每个元素遍历
        let a = `    §a${key} : ` ; let b = ``
        try {obj[key]} catch {continue} // 忽略obj[key]可能造成的错误
        if (obj[key] instanceof Function) { // 如果得到的obj[key]是一个对象中的方法，则输出为`${key}: <Bound Method>`
        }
        else {  // 其他情况（即obj[key]不是一个方法）下
            let obj_name = ""
            try {obj_name = obj[key].constructor.name} catch {obj_name = obj[key]}  // 尝试输出构造函数名，如果输出不了一点则直接输出obj[key]本身
            if (!["String","Number","Boolean"].includes(obj_name) &&  obj_name != undefined && obj_name != null) b = `§b<Object ${obj_name}>`
                    // 字符串、数值、布尔值，undefined和null都是直接输出的
            else b = `§b${obj[key]}`    // 如果满足上面的几种情况，直接输出该键对应的值本身
            str_l_1.push(a + b) // 将上面所输出的值添加，以保证非Function是输出在上面的
        }
        
    }
    str_l_2.push("§r>") // 结尾
    eachPlayer( player => { player.onScreenDisplay.setActionBar(str_l_1.join('\n') + "\n" + str_l_2.join('\n')) } );
}
/**
 * 打印对象
 * @param message - 输入的对象
 */
export function sendMessage( message ) {
    world.sendMessage( `${message}` )
}
