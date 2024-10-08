// 起床战争队伍类

import { world, system, Player, ItemStack, Entity, EnchantmentType, EquipmentSlot, Container, ScoreboardObjective } from "@minecraft/server"
import { overworld, resourceType, shopitemType, validTeams } from "./constants.js"

// ===== 常用方法区 =====

/**
 * 在a~b之间取随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 */
export function randomInt(min, max) {
    if (min > max) {    // 确保 min <= max
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;    // 生成 [min, max] 之间的随机整数
}

/**
 * 打乱一个数组
 * @param {Array} array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // 生成一个随机索引 j
        const j = Math.floor(Math.random() * (i + 1));
        
        // 交换元素 array[i] 和 array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * 将单位为刻的时间转换为以秒为单位的时间
 * @param {Number} tickTime 
 * @returns 
 */
export function tickToSecond( tickTime ) {
    return Math.floor( tickTime / 20 ) + 1
}

/**
 * 
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

/**
 * 获取玩家数目
 * @returns 玩家数目
 */
export function getPlayerAmount() {
    return world.getPlayers().length;
};

/**
 * 检查输入的玩家是否有起床战争信息
 * @param {Player} player 
 */
export function playerIsValid( player ) {
    return player.bedwarsInfo !== undefined
}

/**
 * 检查输入的玩家是否有起床战争信息，并且存活
 * @param {Player} player 
 */
export function playerIsAlive( player ) {
    return player.bedwarsInfo !== undefined && player.bedwarsInfo.deathState.isDeath !== true
}

/**
 * 
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

/**
 * 警告玩家
 * @param {Player} player - 玩家信息
 * @param {import("@minecraft/server").RawMessage} rawtext - 输入的 rawtext
 */
export function warnPlayer( player, rawtext ) {
    player.playSound( "mob.shulker.teleport", { pitch: 0.5, location: player.location } );
    player.sendMessage( rawtext );
};

/**
 * 获取在特定的位置附近是否有玩家
 * @param {import("@minecraft/server").Vector3} pos - 获取特定位置
 * @param {number} r - 检测位置附近的半径
 * @returns 返回玩家信息，或返回 false
 */
export function getPlayerNearby( pos, r ) {
    return overworld.getPlayers( { location: pos, maxDistance: r } )
}

/**
 * 复制坐标，但不影响原有的坐标
 * @param {import("@minecraft/server").Vector3} pos - 坐标
 * @returns {import("@minecraft/server").Vector3} 返回复制的坐标
 */
export function copyPosition( pos ) {
    return { x: pos.x, y: pos.y, z: pos.z }
}

/**
 * 用于按照给定的信息输出特定的 itemStack
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
function itemInfo( itemId, options={} ) {

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

/**
 * 生成物品
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
    const defaultOptions = { clearVelocity: true
    }; const allOptions = { ...defaultOptions, ...options }

    // 获取 itemStack
    let item = itemInfo( itemId, options );

    // 物品生成
    ( allOptions.clearVelocity === true ) ? ( overworld.spawnItem( item, pos ).clearVelocity( ) ) : ( overworld.spawnItem( item, pos ))

}

/**
 * 用于给予玩家物品的函数，一般用于命令无法处理的复杂情况
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

/**
 * 用于设置玩家盔甲的函数，一般用于命令无法处理的复杂情况
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

    // 给予玩家物品
    player.getComponent( "minecraft:equippable" ).setEquipment( slot, item )
   
}

/**
 * 用于设置玩家盔甲的函数，一般用于命令无法处理的复杂情况
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

/**
 * 获取玩家拥有的物品数目
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

/**
 * 输入资源类型，返回物品 ID
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

/**
 * 用于获取特定槽位下，特定附魔的等级
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

/**
 * 使每个玩家都执行一个 callback 函数
 * @param {function(Player): void} callback - 一个接受 Player 类型参数的函数
 */
export function eachPlayer( callback ) {
    world.getPlayers().forEach( player => { callback( player ) } )
}

/**
 * 使每个拥有有效数据的玩家都执行一个 callback 函数；没有有效数据的玩家将不会执行任何东西。
 * @param {function(Player): void} callback - 一个接受 Player 类型参数的函数
 */
export function eachValidPlayer( callback ) {
    let players = world.getPlayers().filter( player => playerIsValid( player ) )
    if ( players.length !== 0 ) { players.forEach( player => { callback( player ) } ) }
}

/**
 * 使每个队伍都执行一个 callback 函数
 * @param {function(BedwarsTeam): void} callback - 一个接受 BedwarsTeam 类型参数的函数
 */
export function eachTeam( callback ) {
    world.bedwarsMap.teamList.forEach( team => { callback( team ) } )
}

/**
 * 清除特定类型的物品
 * @param {String} itemId - 待清除的物品 ID
 */
export function removeItem( itemId ) {
    overworld.getEntities( { type: "minecraft:item" } ).forEach( item => {
        if ( item.getComponent( "minecraft:item" ).itemStack.typeId === itemId ) { item.remove( ) }
    } )
}

/**
 * 检测某实体是否拥有ID中含有给定字符串的物品
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

/**
 * 从队伍的名称获取到队伍的数字ID
 * @param {"red"|"blue"|"yellow"|"green"|"white"|"cyan"|"pink"|"gray"|"orange"|"brown"|"purple"|undefined} teamName - 待转换的队伍名称
 */
export function teamNameToTeamNumber( teamName ) {
    switch ( teamName ) {
        case "red": return 1; case "blue": return 2; case "yellow": return 3; case "green": return 4;
        case "white": return 5; case "cyan": return 6; case "pink": return 7; case "gray": return 8;
        case "orange": return 9; case "brown": return 10; case "purple": return 11; default: return 12;
    }
}

/**
 * 从队伍的数字ID获取到队伍的名称
 * @param {1|2|3|4|5|6|7|8|9|10|11|12} teamNumber - 待转换的队伍数字ID
 */
export function teamNumberToTeamName( teamNumber ) {
    switch ( teamNumber ) {
        case 1: return "red"; case 2: return "blue"; case 3: return "yellow"; case 4: return "green";
        case 5: return "white"; case 6: return "cyan"; case 7: return "pink"; case 8: return "gray";
        case 9: return "orange"; case 10: return "brown"; case 11: return "purple"; default: return undefined;
    }
}

/**
 * 当在等待期间时，初始化玩家
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

// ===== 地图类、队伍类、玩家类、设置 =====


/**
 * 可用设置
 */
export const settings = {
    minWaitingPlayers: 2,
    gameStartWaitingTime: 400,
    resourceMaxSpawnTimes: { iron: 72, gold: 7, diamond: 8, emerald: 4 },
    respawnTime: { normalPlayers: 110, rejoinedPlayers: 200 },
    invalidTeamCouldSpawnResources: true,
    randomMap:{ allow2Teams: true, allow4Teams: true, allow8Teams: true },
    creativePlayerCanBreakBlocks: false
}


/**
 * 地图类
 */
export class BedwarsMap{

    /** 队伍数，在使用addTeam方法时，此数值将自加 */
    teamCount = 0;
    /** @type {BedwarsTeam[]} 全体队伍信息 */
    teamList = [];
    /** 游戏ID，只有ID与本局游戏相同的玩家允许进入游戏 */
    gameId = randomInt( 1000, 9999 )
    /**
     * @type {0|1|2|3|4}
     * 游戏阶段是用于控制起床战争所处阶段的。
     * 0：正在清空地图；1：正在生成地图；2：正在等待中；3：游戏中；4：游戏结束
     */
    gameStage = 0;
    /** 游戏结束后，自动开启下一场游戏的倒计时 */
    nextGameCountdown = 200;
    /** 清空地图时，正在清除的高度层 */
    resetMapCurrentHeight = 116;
    /** 生成地图时，结构加载的倒计时 */
    structureLoadCountdown = 120;
    /**
     * @type {{ pos: import("@minecraft/server").Vector3, direction: Number, type: "blocks_and_items" | "weapon_and_armor" | "team_upgrade" }[]}
     * 商人信息，包括位置、朝向、类型
     */
    traderInfo = [];
    /** 游戏事件，包括下一个事件的倒计时、下一个事件的ID、下一个事件的名称 */
    gameEvent = { nextEventCountdown: 7200, nextEventId: "diamond_tier_2", nextEventName: "钻石生成点 II 级" };


    /**
     * @param {String} id 地图 ID
     * @param {String} name 地图名称
     * @param {{
     * ironInterval: Number,
     * goldInterval: Number,
     * diamondInterval: Number,
     * emeraldInterval: Number,
     * spawnpointPos: import("@minecraft/server").Vector3,
     * healPoolRadius: Number
     * highestBlockLimit: Number
     * distributeResource: Boolean,
     * clearResourceVelocity: Boolean,
     * ironSpawnTimes: Number
     * }} options - 
     * 可选项：
     * ~Interval：资源生成间隔（单位：刻），
     * spawnpointPos：重生点位置，
     * healPoolRadius：治愈池有效范围，
     * highestBlockLimit：最高方块限制，
     * distributeResource: 是否分散式生成资源，
     * clearResourceVelocity: 是否清除生成资源的向量，
     * ironSpawnTimes: 一次性生成铁的数目（这会同时延长铁的生成时间）
     */
    constructor( id, name, options = {} ) {
        const defaultOptions = {
            ironInterval: 8, goldInterval: 120, diamondInterval: 800, emeraldInterval: 1500,
            spawnpointPos: { x: 0, y: 100, z: 0 },
            healPoolRadius: 20,
            highestBlockLimit: 110,
            distributeResource: true,
            clearResourceVelocity: true,
            ironSpawnTimes: 1
        }; const allOptions = { ...defaultOptions, ...options };

        this.id = id;
        this.name = name;
        this.spawnerInfo = {
            ironInterval: allOptions.ironInterval, goldInterval: allOptions.goldInterval,
            /** @type {{ pos: import("@minecraft/server").Vector3, spawned: Number }[]} */ diamondInfo: [], diamondLevel: 1, diamondInterval: allOptions.diamondInterval, diamondCountdown: allOptions.diamondInterval,
            /** @type {{ pos: import("@minecraft/server").Vector3, spawned: Number }[]} */ emeraldInfo: [], emeraldLevel: 1, emeraldInterval: allOptions.emeraldInterval, emeraldCountdown: allOptions.emeraldInterval,
            distributeResource: allOptions.distributeResource, clearResourceVelocity: allOptions.clearResourceVelocity, ironSpawnTimes: allOptions.ironSpawnTimes
        };
        this.spawnpointPos = allOptions.spawnpointPos
        this.healPoolRadius = allOptions.healPoolRadius
        this.gameStartCountdown = settings.gameStartWaitingTime;
        this.highestBlockLimit = allOptions.highestBlockLimit
    };

    /**
     * 进行地图初始化
     */
    init( ) {

        /** 设置地图阶段 */
        this.gameStage = 0;

        /** 移除玩家的bedwarsInfo，还原玩家名字颜色 */
        eachPlayer( player => { initPlayer( player ) } )

        /** 设置为禁止 PVP */
        world.gameRules.pvp = false;

        /** 移除多余实体 */
        overworld.getEntities().filter( entity => { return entity.typeId !== "minecraft:player" } ).forEach( entity => { entity.remove() } )

        /** 移除多余记分板 */
        world.scoreboard.getObjectives().forEach( objective => { if ( objective !== undefined ) { world.scoreboard.removeObjective( objective ) } } )

        /** 进行初始化命令函数 */
        overworld.runCommand( `function lib/init/map` )

    }

    /**
     * 在等待大厅时展示的记分板
     */
    waitingScoreboard( ) {

        /** 展示内容 */
        let infoBoardTitle = "§l§e     起床战争§r     ";
        let infoBoardMapName = `§f地图： §a${this.name}§r`;
        let infoBoardWaitingPlayer = `§f玩家： §a${getPlayerAmount()}/16§r`;
        let infoBoardProgress = ``;
        let infoBoardTeamCount = `§f队伍数： §a${this.teamCount}§r`;
        let infoBoardMode = `§f模式： §a经典§r`;
        let infoBoardAuthor = `§e一只卑微的量筒§r`

        if ( this.gameStage === 0 ) { infoBoardProgress = `§f清除原地图中...§r` }
        else if ( this.gameStage === 1 ) { infoBoardProgress = `§f生成地图中...§r` }
        else if ( this.gameStage === 2 && getPlayerAmount() < settings.minWaitingPlayers ) { infoBoardProgress = `§f等待中...§r` }
        else { infoBoardProgress = `§f即将开始： §a${tickToSecond(this.gameStartCountdown)}秒§r` }

        eachPlayer( player => { player.onScreenDisplay.setActionBar( `${infoBoardTitle}\n§8${this.gameId}\n\n${infoBoardMapName}\n${infoBoardWaitingPlayer}\n\n${infoBoardProgress}\n\n${infoBoardTeamCount}\n${infoBoardMode}\n\n${infoBoardAuthor}` ) } )

    }

    /**
     * 生成地图
     */
    generateMap( ) {
        overworld.runCommand( `function maps/${this.id}/generate` )
        overworld.runCommand( `function lib/modify_data/set_border` )
    }

    /**
     * 设置队伍岛的羊毛颜色与床
     */
    teamIslandInit( ) {

        /** 羊毛颜色 */
        overworld.runCommand( `function maps/${this.id}/team_island` )

        /** 放置床 */
        eachTeam( team => { team.setBed() } )

    }

    /**
     * 随机分配玩家的队伍。
     * 分配逻辑为，现在有玩家数目playerAmount、分配队伍数teamCount和随机玩家列表Player[]，
     * 先用玩家数目除以分配队伍数，playerAmount / teamCount = a ... b
     * 然后，先为所有队伍分配 a 人，这样还剩下 b 人，将这 b 人随机插入到随机列表中
     * @param {Number} 
     */
    assignPlayersRandomly(  ){

        /** 获取所有玩家和队伍 */
        let players = world.getPlayers(); players = shuffleArray( players );
        let copiedTeamList = [ ...this.teamList ]; copiedTeamList = shuffleArray( copiedTeamList );

        let a = getPlayerAmount() / this.teamCount; let b = getPlayerAmount() % this.teamCount;
        eachTeam( team => {
            for ( let i = 0; i < a; i++ ) { team.addPlayer( players[i] ) };
            players.splice( 0, a );
        } )
        if ( players.length !== 0 ) {
            players.forEach( player => {
                copiedTeamList[0].addPlayer( player ); copiedTeamList.splice( 0, 1 )
            } )
        }

    };

    /**
     * 将本地图中可能需要用于检测的队伍加入到地图信息中
     * @param {BedwarsTeam} team - 要加入的队伍信息
     */
    addTeam( team ){
        // 检查要加入的内容是否为有效的队伍
        if ( team === undefined || team.id === undefined ) { world.sendMessage( { translate: "message.invalidTeam" } ); }
        // 若为有效的队伍，且为合理的 ID 时，则添加队伍
        else if ( validTeams.includes( team.id ) ) { this.teamList.push( team ); this.teamCount++ }
        // 如果不是合理的ID，则报错
        else { world.sendMessage( { translate: "message.invalidTeamId", with: [team.id] } ); }
    };

    /**
     * 为本地图新增商人
     * @param {import("@minecraft/server").Vector3} pos - 新增的商人位置
     * @param {Number} direction - 商人的初始朝向，为 0 ~ 360
     * @param {"blocks_and_items" | "weapon_and_armor" | "team_upgrade"} type - 商人类型
     */
    addTrader( pos, direction, type ) {
        this.traderInfo.push( { pos: { ...pos, x: pos.x + 0.5, z: pos.z + 0.5 }, direction: direction, type: type } )
    }

    /**
     * 添加资源点位置
     * @param {"diamond"|"emerald"} resourceType - 欲添加的资源点类型
     * @param {Number} x - 资源点的 x 坐标
     * @param {Number} y - 资源点的 y 坐标
     * @param {Number} z - 资源点的 z 坐标
     */
    addSpawner( resourceType, x, y, z ) {
        switch ( resourceType ) {
            case "diamond": this.spawnerInfo.diamondInfo.push( { pos: { x: x + 0.5, y: y, z: z + 0.5 }, spawned: 0 } ); break;
            case "emerald": this.spawnerInfo.emeraldInfo.push( { pos: { x: x + 0.5, y: y, z: z + 0.5 }, spawned: 0 } ); break;
            default: break;
        }
    };

    /**
     * 在队伍的资源点位置刷新资源
     * @param {"diamond"|"emerald"} resourceType - 生成的资源类型
     */
    spawnResources( resourceType ) {
        if ( resourceType === "diamond" ) {
            this.spawnerInfo.diamondInfo.forEach( spawner => {
                if ( spawner.spawned < settings.resourceMaxSpawnTimes.diamond ) {
                    spawnItem( spawner.pos, "bedwars:diamond" );
                    spawner.spawned++;
                }
            } );
        } else {
            this.spawnerInfo.emeraldInfo.forEach( spawner => {
                if ( spawner.spawned < settings.resourceMaxSpawnTimes.emerald ) {
                    spawnItem( spawner.pos, "bedwars:emerald" );
                    spawner.spawned++;
                }
            } );
        }
    };

    /**
     * 移除特定位置资源点的生成次数，在玩家接近时使用
     * @param {import("@minecraft/server").Vector3} pos - 移除该位置对应的资源点的生成次数
     */
    resetSpawnerSpawnedTimes( pos ){
        this.spawnerInfo.diamondInfo.forEach( spawner => { if ( pos === spawner.pos ) { spawner.spawned = 0 } } )
        this.spawnerInfo.emeraldInfo.forEach( spawner => { if ( pos === spawner.pos ) { spawner.spawned = 0 } } )
    }

    /**
     * 按照资源等级返回生成倒计时
     * @param {"diamond"|"emerald"} resourceType - 资源类型
     */
    getResourcesSpawnCountdown( resourceType ) {
        if ( resourceType === "diamond" ) { return 50 - 10 * this.spawnerInfo.diamondLevel; }
        else { return 60 - 10 * this.spawnerInfo.diamondLevel; }
    };

    /**
     * 显示文本实体和动画实体，并更新并显示生成点数据
     */
    showTextAndAnimation( ) {

        /** 设置文本的内容, @param {1|2|3} spawnerLevel */
        let levelText = ( spawnerLevel ) => {
            if ( spawnerLevel === 1 ) { return "I" }
            else if ( spawnerLevel === 2 ) { return "II" }
            else { return "III" }
        };

        /** 更新动画和文本内容,
         * @param {{ pos: import("@minecraft/server").Vector3; spawned: number }[]} resourceInfo - 资源点信息
         * @param {"bedwars:diamond_spawner"|"bedwars:emerald_spawner"} animationEntityId - 旋转实体的ID
         * @param {String} text1 - 第一行
         * @param {String} text2 - 第二行
         * @param {String} text3 - 第三行
         */
        let updateTextAndAnimation = ( resourceInfo, animationEntityId, text1, text2, text3 ) => {

            resourceInfo.forEach( spawner => {

                /** 旋转动画实体和文本实体的位置 */
                let animationEntityPos = { x: spawner.pos.x, y: spawner.pos.y - 1, z: spawner.pos.z };
                let textLine1Pos = { x: spawner.pos.x, y: spawner.pos.y + 3.5, z: spawner.pos.z };
                let textLine2Pos = { x: spawner.pos.x, y: spawner.pos.y + 3.0, z: spawner.pos.z };
                let textLine3Pos = { x: spawner.pos.x, y: spawner.pos.y + 2.5, z: spawner.pos.z };

                /** 获取各个钻石点的位置的旋转动画实体和文本实体 */
                let animationEntity = overworld.getEntities( { type: animationEntityId, location: animationEntityPos, maxDistance: 0.5 } )[0];
                let textLine1 = overworld.getEntities( { type: "bedwars:text_display", location: textLine1Pos, maxDistance: 0.5 } )[0];
                let textLine2 = overworld.getEntities( { type: "bedwars:text_display", location: textLine2Pos, maxDistance: 0.5 } )[0];
                let textLine3 = overworld.getEntities( { type: "bedwars:text_display", location: textLine3Pos, maxDistance: 0.5 } )[0];

                /** 判断钻石点的位置是否有动画实体和文本实体，如果没有则生成 */
                if ( animationEntity === undefined ) { animationEntity = overworld.spawnEntity( animationEntityId, animationEntityPos ) };
                if ( textLine1 === undefined ) { textLine1 = overworld.spawnEntity( "bedwars:text_display", textLine1Pos ) };
                if ( textLine2 === undefined ) { textLine2 = overworld.spawnEntity( "bedwars:text_display", textLine2Pos ) };
                if ( textLine3 === undefined ) { textLine3 = overworld.spawnEntity( "bedwars:text_display", textLine3Pos ) };

                /** 更新文本 */
                textLine1.nameTag = text1;
                textLine2.nameTag = text2;
                textLine3.nameTag = text3;
    
            } )

        }

        updateTextAndAnimation( this.spawnerInfo.diamondInfo, "bedwars:diamond_spawner", `§e等级 §c${levelText(this.spawnerInfo.diamondLevel)}`, `§b§l钻石`, `§e在 §c${tickToSecond(this.spawnerInfo.diamondCountdown)} §e秒后产出` )
        updateTextAndAnimation( this.spawnerInfo.emeraldInfo, "bedwars:emerald_spawner", `§e等级 §c${levelText(this.spawnerInfo.emeraldLevel)}`, `§2§l绿宝石`, `§e在 §c${tickToSecond(this.spawnerInfo.emeraldCountdown)} §e秒后产出` )

    }

    /** 生成商人 */
    setTrader() {

        this.traderInfo.forEach( traderInfo => {

            /** 设置新的商人的位置和朝向 */
            let trader = overworld.spawnEntity( "bedwars:trader", traderInfo.pos );
            trader.setRotation( { x: 0, y: traderInfo.direction } )

            /** 设置商人的类型和皮肤 */
            trader.triggerEvent( `${traderInfo.type}_trader` );
            trader.triggerEvent( `assign_skin_randomly` );
    
            /** 设置商人的名字 <lang> */
            if ( traderInfo.type === "blocks_and_items" ) { trader.nameTag = `§a方块与物品`; }
            else if ( traderInfo.type === "weapon_and_armor" ) { trader.nameTag = `§c武器与盔甲`; }
            else { trader.nameTag = `§b团队升级`; }

        } )

    }

    /** 获取下一个游戏事件的名称 */
    getEventName( ) {
        switch ( this.gameEvent.nextEventId ) {
            case "diamond_tier_2": this.gameEvent.nextEventName = "钻石生成点 II 级"; return this.gameEvent.nextEventName;
            case "emerald_tier_2": this.gameEvent.nextEventName = "绿宝石生成点 II 级"; return this.gameEvent.nextEventName;
            case "diamond_tier_3": this.gameEvent.nextEventName = "钻石生成点 III 级"; return this.gameEvent.nextEventName;
            case "emerald_tier_3": this.gameEvent.nextEventName = "绿宝石生成点 III 级"; return this.gameEvent.nextEventName;
            case "bed_destruction": this.gameEvent.nextEventName = "床自毁"; return this.gameEvent.nextEventName;
            case "death_match": this.gameEvent.nextEventName = "绝杀模式"; return this.gameEvent.nextEventName;
            case "game_end": default: this.gameEvent.nextEventName = "游戏结束"; return this.gameEvent.nextEventName;
        }
    }

    /** 触发游戏事件 */
    triggerEvent( ) {
        switch ( this.gameEvent.nextEventId ) {
            case "diamond_tier_2":
                world.sendMessage( { translate: "message.diamondSpawnerUpgradedToTier2" } )
                this.spawnerInfo.diamondLevel = 2;
                this.gameEvent.nextEventId = "emerald_tier_2";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "emerald_tier_2":
                world.sendMessage( { translate: "message.emeraldSpawnerUpgradedToTier2" } )
                this.spawnerInfo.emeraldLevel = 2;
                this.gameEvent.nextEventId = "diamond_tier_3";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "diamond_tier_3":
                world.sendMessage( { translate: "message.diamondSpawnerUpgradedToTier3" } )
                this.spawnerInfo.diamondLevel = 3;
                this.gameEvent.nextEventId = "emerald_tier_3";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "emerald_tier_3":
                world.sendMessage( { translate: "message.emeraldSpawnerUpgradedToTier3" } )
                this.spawnerInfo.emeraldLevel = 3;
                this.gameEvent.nextEventId = "bed_destruction";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "bed_destruction":

                /** 破坏所有队伍的床 */
                eachTeam( team => {
                    team.bedInfo.isExist = false;
                    overworld.runCommand( `setblock ${team.bedInfo.pos.x} ${team.bedInfo.pos.y} ${team.bedInfo.pos.z} air destroy` )
                    removeItem( "minecraft:bed" )
                } );
                eachPlayer( player => {
                    player.playSound( "mob.wither.death", { location: player.location } );
                    showTitle( player, { translate: "title.bedDestroyed" }, { translate: "subtitle.bedDestroyed.allTeams" } )
                    player.sendMessage( { translate: "message.bedDestroyed.allTeams" } )
                } );

                this.gameEvent.nextEventId = "death_match";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "death_match":

                /** 生成末影龙 */
                eachTeam( team => { if ( team.isEliminated === false ) {
                    overworld.spawnEntity( "minecraft:ender_dragon", this.spawnpointPos );
                    if ( team.teamUpgrade.dragonBuff === true ) { overworld.spawnEntity( "minecraft:ender_dragon", this.spawnpointPos ) }
                } } )
                eachPlayer( player => {
                    showTitle( player, { translate: "title.deathMatch" } )
                } )

                /** 在 0 60 0 生成一个基岩，以防止末影龙抽风 */
                overworld.runCommand( `setblock 0 60 0 bedrock` )
                this.gameEvent.nextEventId = "game_end";
                this.gameEvent.nextEventCountdown = 7200
                break;
            case "game_end":
                this.gameOver( undefined )
                break;
        }
    }

    /**
     * 游戏结束事件
     * @param {BedwarsTeam|undefined} winningTeam - 获胜队伍，如若为undefined则为平局结束
     */
    gameOver( winningTeam ) {

        /** 设置游戏结束 */
        this.gameStage = 4; this.nextGameCountdown = 200;

        /** 判断何队获胜 */
        if ( winningTeam === undefined ) {
            eachPlayer( player => {
                showTitle( player, { translate: "title.gameOver" } )
                player.sendMessage( { translate: "message.gameOver.endInATie" } )
            } )
            overworld.getEntities( { type: "minecraft:ender_dragon" } ).forEach( dragon => { dragon.kill() } )
        } else {
            eachValidPlayer( player => {

                /** @type {BedwarsPlayer} */ let playerInfo = player.bedwarsInfo

                /** 分别为获胜队伍和未获胜队伍展示标题 */
                if ( playerInfo.team === winningTeam.id ) { showTitle( player, { translate: "title.victory" } ) }
                else { showTitle( player, { translate: "title.gameOver" } ) }

            } )

            let getWinningPlayers = () => {
                let winnersName = [];
                winningTeam.getTeamMember().forEach( winner => { winnersName.push( winner.name ) } );
                return winnersName.join( ", " )
            }

            let killCountRank = () => {
                let players = world.getPlayers().filter( player => { return playerIsValid( player ) && player.bedwarsInfo.team !== undefined } );
                /** @type { { name: String, totalKillCount: Number }[] } */ let rank = []; players.forEach( player => { rank.push( { name: player.name, totalKillCount: player.bedwarsInfo.killCount.kill + player.bedwarsInfo.killCount.finalKill } ) } );
                rank.sort( ( a, b ) => b.totalKillCount - a.totalKillCount );
                let theFirst = `§e§l击杀数第一名§r§7 - ${rank[0].name} - ${rank[0].totalKillCount}`;
                let theSecond = ``; if ( rank[1] !== undefined ) { theSecond = `§6§l击杀数第二名§r§7 - ${rank[1].name} - ${rank[1].totalKillCount}` }
                let theThird = ``; if ( rank[2] !== undefined ) { theThird = `§c§l击杀数第三名§r§7 - ${rank[2].name} - ${rank[2].totalKillCount}` }
                return [ theFirst, theSecond, theThird ]
            }

            /** 通报获胜队伍 <lang> */
            world.sendMessage( [ { translate: "message.greenLine" }, "\n§l§f      起床战争§r      ", "\n", `\n${winningTeam.getTeamName( "name" )}队§7 - ${getWinningPlayers()}`, "\n\n", killCountRank().join( "\n" ), "\n", { translate: "message.greenLine" } ] )

            /** 初始化下一局的计时器 */
            this.nextGameCountdown = 200;
            
        }


    }

    /** 游戏开始事件 */
    gameStart( ) {
        /** 开始游戏 */
        this.gameStage = 3;

        /** 分配玩家队伍 */
        this.assignPlayersRandomly()

        /** 设置商人 */
        this.setTrader()

        /** 设置为可PVP */
        world.gameRules.pvp = true;

        eachValidPlayer( player => {
            /** @type {BedwarsPlayer} */ let playerInfo = player.bedwarsInfo

            /** 将玩家传送到队伍中 */
            playerInfo.teleportPlayerToSpawnpoint()

            /** 调整玩家的游戏模式 */
            player.getGameMode() !== "creative" ? player.setGameMode( "survival" ) : null;

            /** 播报消息 */
            player.sendMessage( [ { translate: "message.greenLine" }, "\n", { translate: "message.gameStartTitle" }, "\n\n", { translate: "message.gameStartIntroduction" }, "\n\n", { translate: "message.greenLine" } ] )
        } )

        /** 如果一个队伍没有分配到人，则设置为无效的队伍 */
        eachTeam( team => { if ( team.getTeamMember().length === 0 ) { team.setTeamInvalid() } } )

        /** 移除等待大厅 */
        overworld.runCommand( `fill -12 117 -12 12 127 12 air` )


    }

    /**
     * 为地图新增旁观者（team = undefined）
     * @param {Player} player 
     */
    addSpectator( player ) {
        let playerInfo = new BedwarsPlayer( player.name, undefined );
        playerInfo.isSpectator = true;
        playerInfo.deathState.isDeath = true;
        playerInfo.deathState.respawnCountdown = -1;
        player.bedwarsInfo = playerInfo
        player.triggerEvent( `remove_team` )
        player.nameTag = player.name;
    }

    /** 获取未被淘汰的队伍 */
    getAliveTeam( ) {
        return this.teamList.filter( team => team.isEliminated === false )
    }

    /** 获取地图是否为solo模式 */
    isSolo( ) {
        return this.teamCount > 4
    }

}


/**
 * 队伍类
 * @param {string} id - 队伍ID
 */
export class BedwarsTeam{

    /** 队伍是否有效，开始时未分配到队员的队伍即为无效队伍 */
    isValid = true;

    /** 队伍是否被淘汰，淘汰的队伍是没有床、没有存活队员的有效队伍 */
    isEliminated = false;

    /** 箱子信息 */
    chestInfo = {
        chestPos: { x: 0, y: 0, z: 0 }, chestDirection: 0,
        enderChestPos: { x: 0, y: 0, z: 0 }, enderChestDirection: 0
    };

    /** 队伍升级信息 */
    teamUpgrade = { reinforcedArmor: 0, healPool: false, maniacMiner: 0, sharpenedSwords: false, forge: 0, dragonBuff: false, trap1Type: "", trap2Type: "", trap3Type: "" };

    /** 陷阱信息 */
    trapInfo = { isEnabled: false, value: 600, isAlarming: false, alarmedTimes: 0 };

    /**
     * @param {validTeams} id - 队伍 ID ，必须为选定值的某一个
     * @param {import("@minecraft/server").Vector3} bedPos - 床的位置
     * @param {0 | 1 | 2 | 3} bedDirection - 床的方向
     * @param {import("@minecraft/server").Vector3} resourceSpawnerPos - 资源点位置
     * @param {import("@minecraft/server").Vector3} spawnpointPos - 重生点位置
     */
    constructor( id, bedPos, bedDirection, resourceSpawnerPos, spawnpointPos ) {

        this.id = ( validTeams.includes( id ) ) ? id : undefined;
        this.bedInfo = { pos: bedPos, direction: bedDirection, isExist: true }
        this.spawnerInfo = { 
            spawnerPos: { ...resourceSpawnerPos, x: resourceSpawnerPos.x + 0.5, z: resourceSpawnerPos.z + 0.5 },
            ironSpawned: 0, ironCountdown: 8,
            goldSpawned: 0, goldCountdown: 120,
            emeraldSpawned: 0, emeraldCountdown: 1500
        };
        this.spawnpoint = { ...spawnpointPos, x: spawnpointPos.x + 0.5, z: spawnpointPos.z + 0.5 };
    }

    /**
     * 获取旋转角度，以用于结构加载
     * @param {Number} direction - 床的方向，可选值 0,1,2,3
     * @returns 按照床的方向返回值
     */
    getRotation( direction ) {
        switch (direction) {
            case 0: return "None";
            case 1: return "Rotate90";
            case 2: return "Rotate180";
            case 3: return "Rotate270";
            default: return "None";
        }
    };

    /**
     * 获取本队的队伍名或队伍颜色
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

    /**
     * 获取本队玩家
     * @returns {Player[]} 返回本队的玩家列表
     */
    getTeamMember( ) {
        return world.getPlayers().filter( player => { return playerIsValid(player) && player.bedwarsInfo.team === this.id } )
    }

    /**
     * 获取本队未被淘汰的玩家
     * @returns {Player[]} 返回本队存活的玩家列表
     */
    getAliveTeamMember( ) {
        return world.getPlayers().filter( player => { return playerIsValid(player) && player.bedwarsInfo.team === this.id && !(player.bedwarsInfo.isEliminated) } )
    }

    /**
     * 床被无效玩家破坏时
     * @param {Player} killer 
     */
    bedDestroyedByInvalidPlayer( killer ) {
        this.setBed( );
        warnPlayer( killer, { translate: "message.invalidPlayer.breakingBed" } );
    };

    /**
     * 床被自家玩家破坏时
     * @param {Player} killer 
     */
    bedDestroyedBySelfPlayer( killer ) {
        this.setBed( );
        warnPlayer( killer, { translate: "message.selfTeamPlayer.breakingBed" } );
    };
    
    /**
     * 床被别家玩家破坏时
     * @param {Player} killer 
     */
    bedDestroyedByOtherPlayer( killer ) {
            
        // 设置床的状态
        this.bedInfo.isExist = false;
        let teamId = this.id
        /** @type {BedwarsPlayer} */    let killerInfo = killer.bedwarsInfo;

        // 全体通报
        eachPlayer( player => {
            /** @type {BedwarsPlayer} */    let playerInfo = player.bedwarsInfo;
            if ( playerInfo.team === this.id ) {
                playerInfo.selfBedDestroyed( player, killer.nameTag );
            } else {
                playerInfo.otherBedDestroyed( player, killer.nameTag, teamId );
            }
        } )

        // 为床破坏者的分数+1
        killerInfo.killCount.bed++;

    }

    /**
     * 放置床，以应对玩家错误破坏自己队伍的床的情况，和初始时放置床的状况
     */
    setBed( ){

        // 不同旋转角度可能会导致床产生偏移
        let placePos = { x: this.bedInfo.pos.x, y: this.bedInfo.pos.y, z: this.bedInfo.pos.z };
        let direction = this.bedInfo.direction;
        switch ( direction ) {
            case 0:
            case 1:
                break;
            case 2:
                placePos.x -= 1;
                break;
            case 3:
                placePos.z -= 1;
                break;
        }
        world.structureManager.place( `beds:${this.id}_bed`, overworld, placePos, { rotation: this.getRotation( direction ) } );
        
    };

    /**
     * 为某队添加某队员，并将数据返回到玩家的Player对象上
     * @param {Player} player
     */
    addPlayer( player ){
        /** @type {BedwarsMap} */ let map = world.bedwarsMap
        /** @type {BedwarsPlayer} */ let bedwarsInfo = new BedwarsPlayer( player.name, this.id );
        bedwarsInfo.runtimeId = map.gameId
        player.bedwarsInfo = bedwarsInfo
        player.triggerEvent( `team_${this.id}` )
        player.nameTag = player.bedwarsInfo.setNameColor( player.name );
    };

    /**
     * 在队伍的资源点位置刷新资源
     * @param {resourceType} resourceType - 生成资源类型，可选值 "iron", "gold", "emerald"
     * @param {Boolean} distributeResource  - 是否分散资源生成，例如集中在一处生成还是分为多处生成
     * @param {Boolean} [clearVelocity=true] - 是否在生成时清除资源的方向
     */
    spawnResources( resourceType, distributeResource, clearVelocity = true ) {

        // 获取生成点信息，以及生成点附近是否有玩家
        let nearbyPlayers = getPlayerNearby( this.spawnerInfo.spawnerPos, 2.5 ).filter( player => playerIsAlive( player ) );

        // 生成判定函数：用于判断欲生成的资源是否已到达生成上限，如果未达到则生成之 | 绿宝石不共享倍率最大容量
        let spawnTest = ( spawnPos ) => {
            if ( resourceType === "iron" && this.spawnerInfo.ironSpawned < settings.resourceMaxSpawnTimes.iron * this.getForgeSpeedBonus() ) {
                spawnItem( spawnPos, "bedwars:iron_ingot", { clearVelocity: clearVelocity } );
                this.spawnerInfo.ironSpawned++;
            }
            else if ( resourceType === "gold" && this.spawnerInfo.goldSpawned < settings.resourceMaxSpawnTimes.gold * this.getForgeSpeedBonus() ) {
                spawnItem( spawnPos, "bedwars:gold_ingot", { clearVelocity: clearVelocity } );
                this.spawnerInfo.goldSpawned++;
            }
            else if ( resourceType === "emerald" && this.spawnerInfo.emeraldSpawned < settings.resourceMaxSpawnTimes.emerald && this.teamUpgrade.forge >= 3 ) {
                spawnItem( spawnPos, "bedwars:emerald", { clearVelocity: clearVelocity } );
                this.spawnerInfo.emeraldSpawned++;
            }
        }

        // 生成点附近有玩家时，则直接给予玩家物品
        if ( nearbyPlayers.length !== 0 ) {
            let itemId = resourceTypeToResourceId( resourceType );
            if ( resourceType === "iron" || resourceType === "gold" ) {
                nearbyPlayers.forEach( player => { player.runCommand( `give @s ${itemId}` ); } );
            }
            if ( resourceType === "emerald" && this.teamUpgrade.forge >= 3 ) {
                nearbyPlayers.forEach( player => { player.runCommand( `give @s ${itemId}` ); } );
            }

        // 队伍可用时，但生成点附近无玩家时，生成掉落物（分散式）
        } else if ( nearbyPlayers.length === 0 && distributeResource === true ) {
            let spawnPos = copyPosition( this.spawnerInfo.spawnerPos )
            spawnPos.x += randomInt( -1, 1 ); spawnPos.z += randomInt( -1, 1 );
            spawnTest( spawnPos );
    
        // 队伍可用时，但生成点附近无玩家时，生成掉落物（非分散式）
        } else {
            spawnTest( this.spawnerInfo.spawnerPos )
        }
    };

    /**
     * 移除队伍资源点的生成次数（可在有玩家接近时使用）
     */
    resetSpawnerSpawnedTimes( ) {
        this.spawnerInfo.goldSpawned = 0;
        this.spawnerInfo.ironSpawned = 0;
    };

    /**
     * 获取资源因锻炉团队升级得到的速度加成
     * @returns 若团队锻炉升级为 1 级，速度提升 50% ；为 2~3 级时，提升 100% ；为 4 级时，提升 200%
     */
    getForgeSpeedBonus( ) {
        if ( this.teamUpgrade.forge === 0 ) {
            return 1
        } else if ( this.teamUpgrade.forge === 1 ) {
            return 1.5
        } else if ( 2 <= this.teamUpgrade.forge <= 3 ) {
            return 2
        } else {
            return 3
        }
    }

    /**
     * 当陷阱被触发时，执行的事件
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
        this.teamUpgrade.trap1Type = this.teamUpgrade.trap2Type; this.teamUpgrade.trap2Type = this.teamUpgrade.trap3Type; this.teamUpgrade.trap3Type = "";
        /** 开启 30 秒的冷却 */
        this.trapInfo.isEnabled = true; this.trapInfo.value = 600;

    }

    /**
     * 施加疯狂矿工和治愈池的效果
     */
    teamUpgradeEffect( ) {

        /** 疯狂矿工 */
        if ( this.teamUpgrade.maniacMiner > 0 ) {
            this.getTeamMember().forEach( player => { player.addEffect( "haste", 600, { amplifier: this.teamUpgrade.maniacMiner - 1 } ) } )
        }

        /** 治愈池 */
        if ( this.teamUpgrade.healPool === true ) {
            let playerInBase = getPlayerNearby( this.spawnpoint, world.bedwarsMap.healPoolRadius )
            this.getTeamMember().forEach( player => {
                if ( playerInBase.length !== 0 && playerInBase.includes( player ) ) { player.addEffect( "regeneration", 100, { amplifier: 0 } ) }
            } )
        }


    }

    /**
     * 设置队伍为无效队伍
     */
    setTeamInvalid() {
        this.isValid = false;
        this.bedInfo.isExist = false;
        overworld.runCommand( `setblock ${this.bedInfo.pos.x} ${this.bedInfo.pos.y} ${this.bedInfo.pos.z} air destroy` )
        removeItem( "minecraft:bed" )
    }

    /**
     * 设置队伍已被淘汰
     */
    setTeamEliminated() {
        this.isEliminated = true;
        eachValidPlayer( player => { player.sendMessage( [ "\n", { translate: "message.teamEliminated", with: [ `${this.getTeamName("name")}` ] }, "\n " ] ) } )
    }

}


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
        /** @type {BedwarsMap} */ let map = world.bedwarsMap;
        return map.teamList.filter( team => { return team.id === this.team } )[0]
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

        /** @type {BedwarsMap} */ let map = world.bedwarsMap

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
        let infoBoardMode = `§82队经典模式 ${map.gameId}§r`
        let infoBoardGameEvent = `${map.getEventName()} - §a${secondToMinute( tickToSecond( map.gameEvent.nextEventCountdown ), "string" )}§r`
        let infoBoardTeam1 = `${map.teamList[0].getTeamName("name")} §f${map.teamList[0].getTeamName("full_name")} ： ${teamState(map.teamList[0])} ${playerInTeam(map.teamList[0])}`
        let infoBoardTeam2 = `${map.teamList[1].getTeamName("name")} §f${map.teamList[1].getTeamName("full_name")} ： ${teamState(map.teamList[1])} ${playerInTeam(map.teamList[1])}`
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

        /** @type {BedwarsMap} */ let map = world.bedwarsMap

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
        let infoBoardMode = `§84队经典模式 ${map.gameId}§r`
        let infoBoardGameEvent = `${map.getEventName()} - §a${secondToMinute( tickToSecond( map.gameEvent.nextEventCountdown ), "string" )}§r`
        let infoBoardTeam1 = `${map.teamList[0].getTeamName("name")} §f${map.teamList[0].getTeamName("full_name")} ： ${teamState(map.teamList[0])} ${playerInTeam(map.teamList[0])}`
        let infoBoardTeam2 = `${map.teamList[1].getTeamName("name")} §f${map.teamList[1].getTeamName("full_name")} ： ${teamState(map.teamList[1])} ${playerInTeam(map.teamList[1])}`
        let infoBoardTeam3 = `${map.teamList[2].getTeamName("name")} §f${map.teamList[2].getTeamName("full_name")} ： ${teamState(map.teamList[2])} ${playerInTeam(map.teamList[2])}`
        let infoBoardTeam4 = `${map.teamList[3].getTeamName("name")} §f${map.teamList[3].getTeamName("full_name")} ： ${teamState(map.teamList[3])} ${playerInTeam(map.teamList[3])}`
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
 * 商店物品类
 */
export class Shopitem{

    /**
     * 
     * @param {"blocks_and_items" | "weapon_and_armor" | "team_upgrade"} traderType - 对应的商人类型
     * @param {String} id - 物品 ID（自动生成商店物品 ID 为 bedwars:shopitem_(id) ）
     * @param {"iron" | "gold" | "diamond" | "emerald"} costResourceType - 购买时消耗的资源类型
     * @param {Number} costResourceAmount - 购买时消耗的资源数量
     * @param {Number} itemAmount - 购买时获得的物品数量
     * @param {{ description: String, 
     * tier: 0 | 1 | 2 | 3 | 4, 
     * isHighestTier: true, 
     * loseTierUponDeath: false, 
     * itemId: String, 
     * itemType: shopitemType
     * }} options - 其他可选内容
     */
    constructor( id, traderType, costResourceType, costResourceAmount, itemAmount, options = {} ) {
        const defaultOptions = {
            description: "", 
            tier: 0, 
            isHighestTier: true, 
            loseTierUponDeath: false, 
            itemId: "", 
            itemType: "other",
            costAdder: 0
        }; const allOptions = { ...defaultOptions, ...options };
        
        this.traderType = traderType;
        this.id = id;
        this.costResourceType = costResourceType;
        this.costResourceAmount = costResourceAmount;
        this.itemAmount = itemAmount;
        this.description = allOptions.description;
        this.tier = allOptions.tier;
        this.isHighestTier = allOptions.isHighestTier;
        this.loseTierUponDeath = allOptions.loseTierUponDeath;
        this.itemType = allOptions.itemType
        this.itemId = ( allOptions.itemId !== "" ) ? `${allOptions.itemId}` : `bedwars:${this.id}`;
        this.shopitemId = ( this.itemType === "teamUpgrade" || this.itemType === "trap" ) ? `bedwars:upgrade_${this.id}` : `bedwars:shopitem_${this.id}`;
    };

    /**
     * 为有色方块设立单独的物品 ID
     * @param {"red" | "blue" | "yellow" | "green" | "pink" | "cyan" | "white" | "gray" | "purple" | "brown" | "orange"} color 
     */
    setColoredId( color ) {
        if ( this.itemType === "coloredBlock" ) { this.itemId = `bedwars:${color}_${this.id}` }
    };

    /**
     * 按照所给定的物品属性自动生成适合的 Lore 显示在商店界面
     */
    generateLore( ) {
        let resourceColor; let resourceName;
        switch ( this.costResourceType ) {
            case "iron": resourceColor = "§f"; resourceName = "铁锭"; break;
            case "gold": resourceColor = "§6"; resourceName = "金锭"; break;
            case "diamond": resourceColor = "§b"; resourceName = "钻石"; break;
            case "emerald": resourceColor = "§2"; resourceName = "绿宝石"; break;
            default: resourceColor = ""; resourceName = ""; break;
        };


        // 如果是有等级的物品：
        if ( this.tier !== 0 ) {

            // 设置等级名称
            let itemTierName = ""; 
            switch ( this.tier ) {
                case 1: itemTierName = "§eI"; break;
                case 2: itemTierName = "§eII"; break;
                case 3: itemTierName = "§eIII"; break;
                case 4: itemTierName = "§eIV"; break;
                default: break;
            };
            // 可以降级的，显示等级和降级提示
            if ( this.loseTierUponDeath === true ) {
                // 不是最高级的道具，显示为可升级
                if ( this.isHighestTier !== true ) {
                    return [ "", `§r§7 花费： ${resourceColor}${this.costResourceAmount} ${resourceName}`, `§r§7 等级： ${itemTierName}`, "", `§r§7 此道具可升级。`, "§r§7 死亡将会导致损失一级！", "", "§r§7 每次重生时，至少为最低等级。" ]
                // 反之显示为最高级
                } else {
                    return [ "", `§r§7 花费： ${resourceColor}${this.costResourceAmount} ${resourceName}`, `§r§7 等级： ${itemTierName}`, "", `§r§7 此道具为最高等级。`, "§r§7 死亡将会导致损失一级！", "", "§r§7 每次重生时，至少为最低等级。" ]
                }
            // 不可以降级的，显示等级
            } else {
                return [ "", `§r§7 花费： ${resourceColor}${this.costResourceAmount} ${resourceName}`, `§r§7 等级： ${itemTierName}`, "", `§r§7 ${this.description}` ]
            }

        // 如果不是有等级的物品：
        } else {

            // 有描述的，显示描述
            if ( this.description !== "" ) {
                return [ "", `§r§7 花费： ${resourceColor}${this.costResourceAmount} ${resourceName}`, "", `§r§7 ${this.description}` ]
            } else {
                return [ "", `§r§7 花费： ${resourceColor}${this.costResourceAmount} ${resourceName}` ]
            }

        }
    };

    /**
     * 将物品放入对应商人的物品栏之中
     * @param {Number} slotLocation - 欲放置的槽位
     */
    setTraderItem( slotLocation ) {

        // 设置欲放置物品的基本属性：商店物品（shopitem）、放置物品的数目、Lore
        let item = new ItemStack( this.shopitemId, this.itemAmount );
        item.setLore( this.generateLore( ) );

        // 获取物品可于何商人的物品栏中放置，例如具有"blocks_and_items"的物品将放入到所有具有"blocks_and_items_trader"的家族的商人
        // 这里将返回符合条件的所有商人列表
        let traders = overworld.getEntities( { type: "bedwars:trader" } );
        traders = traders.filter( trader => { return trader.getComponent( "minecraft:type_family" ).hasTypeFamily( `${this.traderType}_trader` ) } );

        // 对于每个商人，放置物品
        traders.forEach( trader => {

            // 获取商人的物品栏信息，和特定物品栏槽位信息
            let entityInventory = trader.getComponent( "minecraft:inventory" ).container;
            let entityInventorySlot = entityInventory.getItem( slotLocation );

            // 如果该槽位是空槽位、商店物品 ID 不对应或商店物品数目不对应，则重新放置
            // 这里分开，是防止 undefined 影响后面的代码
            if ( entityInventorySlot === undefined ) {
                entityInventory.setItem( slotLocation, item )
            } else if ( entityInventorySlot.typeId !== this.shopitemId || entityInventorySlot.amount !== this.itemAmount ) {
                entityInventory.setItem( slotLocation, item )
            }
        } )
    };

    /**
     * 玩家购买物品
     * @param {Player} player - 购买的玩家
     * @param {BedwarsTeam[]} teamList - 队伍列表
     */
    playerPurchaseItems( player ) {

        /** 获取资源 ID */ let resourceId = resourceTypeToResourceId( this.costResourceType );

        /** 判断玩家是否可以购买物品，如果有则执行callback函数作为成功执行的情况
         * @param {{ itemGot: Boolean, isTeamUpgrade: Boolean, costAdder: Number, currentLevel: Number, name: String, trapQueueFull: Boolean }} options */
        let purchaseTest = ( callback, options = {} ) => {
            const defaultOptions = {
                itemGot: false,
                isTeamUpgrade: false,
                costAdder: 0,
                currentLevel: 0,
                name: "",
                trapQueueFull: false
            };
            const allOptions = { ...defaultOptions, ...options }

            let realCostAmount = this.costResourceAmount + allOptions.costAdder

            /** 如果玩家已拥有了此物品，或者当此物品有等级之分且玩家要购买的等级小于当前等级 + 1 时，则阻止购买 */
            if ( allOptions.itemGot || ( this.tier !== 0 && this.tier < allOptions.currentLevel + 1 ) ) {
                warnPlayer( player, { translate: `message.alreadyGotItem` } );
            }
            /** 如果此物品有等级之分，且玩家要购买的等级大于当前等级 + 1时，则阻止购买 */
            else if ( this.tier !== 0 && this.tier > allOptions.currentLevel + 1 ) { switch ( this.itemType ) {
                case "axe": warnPlayer( player, { translate: `message.needItem`, with: { rawtext: [ { translate: `message.bedwars:shopitem_${allOptions.name}_axe` } ] } } ); break;
                case "pickaxe": warnPlayer( player, { translate: `message.needItem`, with: { rawtext: [ { translate: `message.bedwars:shopitem_${allOptions.name}_pickaxe` } ] } } ); break;
                case "teamUpgrade": warnPlayer( player, { translate: `message.needItem`, with: { rawtext: [ { translate: `message.bedwars:upgrade_${allOptions.name}_tier_${this.tier - 1}` } ] } } ); break;
            } }
            /** 如果物品类型为陷阱，且三个陷阱已排满时，则阻止购买 */
            else if ( this.itemType === "trap" && allOptions.trapQueueFull ) {
                warnPlayer( player, { translate: `message.trapQueueFull` } )
            }
            /** 如果玩家资源不够，则阻止购买 */
            else if ( player.runCommand( `execute if entity @s[hasitem={item=${resourceId},quantity=${realCostAmount}..}]` ).successCount === 0 ) {
                warnPlayer( player, { translate: `message.resourceNotEnough`, with: { rawtext: [ { translate: `item.${resourceId}` }, { translate: `item.${resourceId}` }, { text: `${realCostAmount - entityHasItemAmount( player, resourceId )}` } ] } } );
            }
            /** 以上条件均满足的情况下，允许购买 */
            else {
                player.runCommand( `clear @s ${resourceId} -1 ${realCostAmount}` );
                if ( !allOptions.isTeamUpgrade ) {
                    player.playSound( "note.pling", { pitch: 2, location: player.location } );
                    player.sendMessage( { translate: `message.purchaseItemsSuccessfully`, with: { rawtext: [ { translate: `message.${this.shopitemId}` } ] } } );        
                } else {
                    eachValidPlayer( teamPlayer => { if ( teamPlayer.bedwarsInfo.team === player.bedwarsInfo.team ) {
                        teamPlayer.sendMessage( { translate: `message.purchaseTeamUpgradeSuccessfully`, with: { rawtext: [ { text: `${player.name}` }, { translate: `message.${this.shopitemId}` } ] } } );
                        teamPlayer.playSound( "note.pling", { pitch: 2, location: teamPlayer.location } );
                    } } )
                }
                callback()
            }
        }
        /** 检测玩家是否拥有商店物品。如果有商店物品：清除商店物品，并执行购买的逻辑。 */
        if ( player.runCommand( `execute if entity @s[hasitem={item=${this.shopitemId}}]` ).successCount !== 0 ) {

            player.runCommand( `clear @s ${this.shopitemId}` );
            /** @type {BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;

            if ( playerInfo === undefined ) { warnPlayer( player, { translate: `message.invalidPlayer.purchaseItems` } ) }
            else {
                let playerTeamUpgrade = playerInfo.getTeam( ).teamUpgrade;
                switch ( this.itemType ) {
                    case "sword": /** 类型为剑，【清除木剑】【按团队升级提供锋利附魔】 */
                        purchaseTest( () => {
                            player.runCommand( `clear @s bedwars:wooden_sword` );
                            if ( !playerInfo.getTeam( ).teamUpgrade.sharpenedSwords ) {
                                player.runCommand( `give @s ${this.itemId} 1 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
                            } else {
                                giveItem( player, this.itemId, { enchantments: [ { id: "sharpness", level: 1 } ], itemLock: "inventory" } )
                            }        
                        } )
                        break;
                    case "armor": /** 类型为盔甲，【记录等级】 */
                        let itemTier = ( this.id === "chain_armor" ) ? 2 : ( ( this.id === "iron_armor" ) ? 3 : ( ( this.id === "diamond_armor" ) ? 4 : 1 ) )
                        purchaseTest( () => {
                            playerInfo.equipment.armor = itemTier; 
                        }, { itemGot: playerInfo.equipment.armor >= itemTier } )
                        break;
                    case "axe": /** 类型为斧头，【记录等级】【按等级依次购买】【提供附魔】【按团队升级提供锋利附魔】 */
                        purchaseTest( () => {

                            playerInfo.equipment.axe++;
                            player.runCommand( `clear @s bedwars:wooden_axe` );
                            player.runCommand( `clear @s bedwars:stone_axe` );
                            player.runCommand( `clear @s bedwars:iron_axe` );

                        }, { currentLevel: playerInfo.equipment.axe, name: this.tier === 2 ? "wooden" : ( this.tier === 3 ? "stone" : ( this.tier === 4 ? "iron" : "wooden" ) ) } )
                        break;
                    case "pickaxe": /** 类型为镐子，【记录等级】【按等级依次购买】【提供附魔】 */

                        purchaseTest( () => {

                            playerInfo.equipment.pickaxe++;
                            player.runCommand( `clear @s bedwars:wooden_pickaxe` );
                            player.runCommand( `clear @s bedwars:iron_pickaxe` );
                            player.runCommand( `clear @s bedwars:golden_pickaxe` );

                        }, { currentLevel: playerInfo.equipment.pickaxe, name: this.tier === 2 ? "wooden" : ( this.tier === 3 ? "iron" : ( this.tier === 4 ? "golden" : "wooden" ) ) } )
                        break;
                    case "coloredBlock": /** 类型为彩色方块，【重设ID】 */
                        purchaseTest( () => {
                            this.setColoredId( playerInfo.team )
                            player.runCommand( `give @s ${this.itemId} ${this.itemAmount} 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
                        } )
                        break;
                    case "knockbackStick": /** 类型为击退棒，【提供附魔】 */
                        purchaseTest( () => {
                            giveItem( player, "bedwars:knockback_stick", { enchantments: [ { id: "knockback", level: 1 } ] } );
                        } )
                        break;
                    case "shears": /** 类型为剪刀，【记录等级】 */
                        purchaseTest( () => {
                            playerInfo.equipment.shears = 1;
                        }, { itemGot: playerInfo.equipment.shears > 0 } )
                        break;
                    case "bow": /** 类型为弓，【提供附魔】 */
                        purchaseTest( () => {
                            let enchantments = [];
                            if ( this.id === "bow_power" ) { enchantments = [ { id: "power", level: 1 } ]; } 
                            if ( this.id === "bow_power_punch" ) { enchantments = [ { id: "power", level: 1 }, { id: "punch", level: 1 } ]; };
                            giveItem( player, this.itemId, { enchantments: enchantments } );
                        } )
                        break;
                    case "potion": /** 类型为药水，【添加Lore】 <lang> */
                        purchaseTest( () => {
                            switch (this.id) {
                                case "potion_jump_boost": giveItem( player, this.itemId, { lore: [ "", "§r§9跳跃提升 V (0:45)" ] } ); break;
                                case "potion_speed": giveItem( player, this.itemId, { lore: [ "", "§r§9迅捷 II (0:45)" ] } ); break;
                                case "potion_invisibility": giveItem( player, this.itemId, { lore: [ "", "§r§9隐身 (0:30)" ] } ); break;
                            }
                        } )
                        break;
                    case "other": /** 类型为其他 */
                        purchaseTest( () => {
                            player.runCommand( `give @s ${this.itemId} ${this.itemAmount} 0 {"item_lock":{"mode":"lock_in_inventory"}}` );
                        } )
                        break;                    
                    case "teamUpgrade": /** 类型为非陷阱的团队升级 */
                        switch (this.id) {
                            case "sharpened_swords": /** 锋利附魔 */
                                purchaseTest( () => {
                                    playerTeamUpgrade.sharpenedSwords = true;
                                }, { itemGot: playerTeamUpgrade.sharpenedSwords, isTeamUpgrade: true } ); break;
                            /** 盔甲强化 */
                            case "reinforced_armor_tier_1": case "reinforced_armor_tier_2": case "reinforced_armor_tier_3": case "reinforced_armor_tier_4":
                                purchaseTest( () => {
                                    playerTeamUpgrade.reinforcedArmor++;
                                }, { currentLevel: playerTeamUpgrade.reinforcedArmor, isTeamUpgrade: true, name: "reinforced_armor" } ); break;
                            /** 疯狂矿工 */
                            case "maniac_miner_tier_1": case "maniac_miner_tier_2":
                                purchaseTest( () => {
                                    playerTeamUpgrade.maniacMiner++;
                                }, { currentLevel: playerTeamUpgrade.maniacMiner, isTeamUpgrade: true, name: "maniac_miner" } ); break;
                            /** 资源锻炉 */
                            case "forge_tier_1": case "forge_tier_2": case "forge_tier_3": case "forge_tier_4":
                                purchaseTest( () => {
                                    playerTeamUpgrade.forge++;
                                }, { currentLevel: playerTeamUpgrade.forge, isTeamUpgrade: true, name: "forge" } ); break;
                            /** 治愈池 */
                            case "heal_pool":
                                purchaseTest( () => {
                                    playerTeamUpgrade.healPool = true;
                                }, { itemGot: playerTeamUpgrade.healPool, isTeamUpgrade: true } ); break;
                            /** 末影龙增益 */
                            case "dragon_buff":
                                purchaseTest( () => {
                                    playerTeamUpgrade.dragonBuff = true;
                                }, { itemGot: playerTeamUpgrade.dragonBuff, isTeamUpgrade: true } ); break;
                            }
                        break;
                    case "trap": /** 类型为陷阱的团队升级 */
                        purchaseTest( () => {

                            if ( playerTeamUpgrade.trap1Type === "" ) { playerTeamUpgrade.trap1Type = this.id; }
                            else if ( playerTeamUpgrade.trap2Type === "" ) { playerTeamUpgrade.trap2Type = this.id; }
                            else { playerTeamUpgrade.trap3Type = this.id; }

                        }, { isTeamUpgrade: true, costAdder: playerTeamUpgrade.trap1Type === "" ? 0: ( playerTeamUpgrade.trap2Type === "" ? 1: ( playerTeamUpgrade.trap3Type === "" ? 3: 7 ) ), trapQueueFull: !(playerTeamUpgrade.trap3Type === "") } )
                        break;
                }
            }
        }
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



/** @enum {Shopitem[]} 方块与物品商品列表 */
export const blocksAndItemsShopitems = [
    new Shopitem( "wool", "blocks_and_items", "iron", 4, 16, { itemType: "coloredBlock", description: "可用于搭桥穿越岛屿。搭出的桥的颜色会对应你的队伍颜色。" } ),
    new Shopitem( "stained_hardened_clay", "blocks_and_items", "iron", 12, 16, { itemType: "coloredBlock", description: "用于保卫床的基础方块。" } ),
    new Shopitem( "planks", "blocks_and_items", "gold", 4, 16, { description: "为床提供保护的不错块选。\n 面对镐子的攻势也很强势。", itemId: "bedwars:oak_planks" } ),
    new Shopitem( "blast_proof_glass", "blocks_and_items", "iron", 12, 4, { itemType: "coloredBlock", description: "免疫爆炸。" } ),
    new Shopitem( "end_stone", "blocks_and_items", "iron", 24, 12, { description: "用于保卫床的坚固方块。" } ),
    new Shopitem( "ladder", "blocks_and_items", "gold", 4, 8, { description: "可用于救助困在树上的猫猫。", itemId: "minecraft:ladder" } ),
    new Shopitem( "obsidian", "blocks_and_items", "emerald", 4, 4, { description: "为你的床提供超级保护。" } ),
    new Shopitem( "potion_jump_boost", "blocks_and_items", "emerald", 1, 1, { description: "§9跳跃提升 V (0:45)", itemType: "potion" } ),
    new Shopitem( "potion_speed", "blocks_and_items", "emerald", 1, 1, { description: "§9速度 II (0:30)", itemType: "potion" } ),
    new Shopitem( "potion_invisibility", "blocks_and_items", "emerald", 2, 1, { description: "§9完全隐身 (0:30)", itemType: "potion" } ),
    new Shopitem( "golden_apple", "blocks_and_items", "gold", 3, 1, { description: "疗伤好物。", itemId: "minecraft:golden_apple" } ),
    new Shopitem( "bed_bug", "blocks_and_items", "iron", 30, 1, { description: "在雪球砸中的地方产生一只持续\n 15 秒的蠹虫，为你吸引火力。" } ),
    new Shopitem( "dream_defender", "blocks_and_items", "iron", 120, 1, { description: "让铁傀儡成为你的守家好帮手。\n 持续 4 分钟。" } ),
    new Shopitem( "fireball", "blocks_and_items", "iron", 40 , 1, { description: "右键发射！击飞在桥上行走的敌人！" } ),
    new Shopitem( "tnt", "blocks_and_items", "gold", 8, 1, { description: "放下后即点燃。要炸毁什么\n 东西，它很在行！" } ),
    new Shopitem( "ender_pearl", "blocks_and_items", "emerald", 4, 1, { description: "快速打入敌人内部。", itemId: "minecraft:ender_pearl" } ),
    new Shopitem( "water_bucket", "blocks_and_items", "gold", 6, 1, { description: "使来犯敌人减速的良好选择。\n 也能应对 TNT 的威胁。", itemId: "minecraft:water_bucket" } ),
    new Shopitem( "bridge_egg", "blocks_and_items", "emerald", 1, 1, { description: "能够沿着其扔出的轨迹\n 创造一座桥梁。" } ),
    new Shopitem( "magic_milk", "blocks_and_items", "gold", 4, 1, { description: "饮用后能够在 30 秒内\n 防止触发敌人的陷阱。" } ),
    new Shopitem( "sponge", "blocks_and_items", "gold", 6, 4, { description: "吸水好手。", itemId: "minecraft:sponge" } )
]
    
/** @enum {Shopitem[]} 武器与盔甲商品列表 */
export const weaponAndArmorShopitems = [ 
    new Shopitem( "stone_sword", "weapon_and_armor", "iron", 10, 1, { itemType: "sword" } ),
    new Shopitem( "iron_sword", "weapon_and_armor", "gold", 7, 1, { itemType: "sword" } ),
    new Shopitem( "diamond_sword", "weapon_and_armor", "emerald", 4, 1, { itemType: "sword" } ),
    new Shopitem( "knockback_stick", "weapon_and_armor", "gold", 5, 1, { itemType: "knockbackStick" } ),
    new Shopitem( "chain_armor", "weapon_and_armor", "iron", 24, 1, { description: "获得永久的锁链护腿靴子。", itemType: "armor" } ),
    new Shopitem( "iron_armor", "weapon_and_armor", "gold", 12, 1, { description: "获得永久的铁护腿靴子。", itemType: "armor" } ),
    new Shopitem( "diamond_armor", "weapon_and_armor", "emerald", 6, 1, { description: "钻石护腿和靴子将一直伴你左右。", itemType: "armor" } ),
    new Shopitem( "shears", "weapon_and_armor", "iron", 20, 1, { description: "破坏羊毛的得力工具。\n 该物品是永久的。", itemType: "shears" } ),
    new Shopitem( "wooden_axe", "weapon_and_armor", "iron", 10, 1, { tier: 1, isHighestTier: false, loseTierUponDeath: true, itemType: "axe" } ),
    new Shopitem( "stone_axe", "weapon_and_armor", "iron", 10, 1, { tier: 2, isHighestTier: false, loseTierUponDeath: true, itemType: "axe" } ),
    new Shopitem( "iron_axe", "weapon_and_armor", "gold", 3, 1, { tier: 3, isHighestTier: false, loseTierUponDeath: true, itemType: "axe" } ),
    new Shopitem( "diamond_axe", "weapon_and_armor", "gold", 6, 1, { tier: 4, isHighestTier: true, loseTierUponDeath: true, itemType: "axe" } ),
    new Shopitem( "wooden_pickaxe", "weapon_and_armor", "iron", 10, 1, { tier: 1, isHighestTier: false, loseTierUponDeath: true, itemType: "pickaxe" } ),
    new Shopitem( "iron_pickaxe", "weapon_and_armor", "iron", 10, 1, { tier: 2, isHighestTier: false, loseTierUponDeath: true, itemType: "pickaxe" } ),
    new Shopitem( "golden_pickaxe", "weapon_and_armor", "gold", 3, 1, { tier: 3, isHighestTier: false, loseTierUponDeath: true, itemType: "pickaxe" } ),
    new Shopitem( "diamond_pickaxe", "weapon_and_armor", "gold", 6, 1, { tier: 4, isHighestTier: true, loseTierUponDeath: true, itemType: "pickaxe" } ),
    new Shopitem( "bow", "weapon_and_armor", "gold", 12, 1, { itemId: "minecraft:bow", itemType: "bow" } ),
    new Shopitem( "bow_power", "weapon_and_armor", "gold", 20, 1, { itemId: "minecraft:bow", itemType: "bow" } ),
    new Shopitem( "bow_power_punch", "weapon_and_armor", "emerald", 6, 1, { itemId: "minecraft:bow", itemType: "bow" } ),
    new Shopitem( "arrow", "weapon_and_armor", "gold", 2, 6, { itemId: "minecraft:arrow" } )
]
    
/** @enum {Shopitem[]} 团队升级商品列表 */
export const teamUpgradeShopitems = [ 
    new Shopitem( "sharpened_swords", "team_upgrade", "diamond", 8, 1, { description: "己方所有成员的剑和斧\n 将永久获得锋利 I 的效果！", itemType: "teamUpgrade" } ),
    new Shopitem( "reinforced_armor_tier_1", "team_upgrade", "diamond", 5, 1, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 I", itemType: "teamUpgrade", tier: 1, isHighestTier: false } ),
    new Shopitem( "reinforced_armor_tier_2", "team_upgrade", "diamond", 10, 2, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 II", itemType: "teamUpgrade", tier: 2, isHighestTier: false } ),
    new Shopitem( "reinforced_armor_tier_3", "team_upgrade", "diamond", 20, 3, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 III", itemType: "teamUpgrade", tier: 3, isHighestTier: false } ),
    new Shopitem( "reinforced_armor_tier_4", "team_upgrade", "diamond", 30, 4, { description: "己方所有成员的盔甲将获得永久保护附魔！\n 效果： 保护 IV", itemType: "teamUpgrade", tier: 4, isHighestTier: true } ),
    new Shopitem( "maniac_miner_tier_1", "team_upgrade", "diamond", 4, 1, { description: "己方所有成员获得永久急迫效果。\n 效果： 急迫 I", itemType: "teamUpgrade", tier: 1, isHighestTier: false } ),
    new Shopitem( "maniac_miner_tier_2", "team_upgrade", "diamond", 6, 2, { description: "己方所有成员获得永久急迫效果。\n 效果： 急迫 II", itemType: "teamUpgrade", tier: 2, isHighestTier: true } ),
    new Shopitem( "forge_tier_1", "team_upgrade", "diamond", 4, 1, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： +50% 资源", itemType: "teamUpgrade", tier: 1, isHighestTier: false } ),
    new Shopitem( "forge_tier_2", "team_upgrade", "diamond", 8, 2, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： +100% 资源", itemType: "teamUpgrade", tier: 2, isHighestTier: false } ),
    new Shopitem( "forge_tier_3", "team_upgrade", "diamond", 12, 3, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： 生成绿宝石", itemType: "teamUpgrade", tier: 3, isHighestTier: false } ),
    new Shopitem( "forge_tier_4", "team_upgrade", "diamond", 16, 4, { description: "升级你岛屿资源池的生成速度和最大容量。\n 效果： +200% 资源", itemType: "teamUpgrade", tier: 4, isHighestTier: true } ),
    new Shopitem( "heal_pool", "team_upgrade", "diamond", 3, 1, { description: "基地附近的队伍成员将拥有生命恢复效果！", itemType: "teamUpgrade" } ),
    new Shopitem( "dragon_buff", "team_upgrade", "diamond", 5, 1, { description: "你的队伍在绝杀模式中将会有两条末影龙而不是一条！", itemType: "teamUpgrade" } ),
    new Shopitem( "its_a_trap", "team_upgrade", "diamond", 1, 1, { description: "造成失明和缓慢效果，持续 8 秒。", itemType: "trap" } ),
    new Shopitem( "counter_offensive_trap", "team_upgrade", "diamond", 1, 1, { description: "赋予基地附近的队友速度 II 与跳跃提升 II\n 效果，持续 15 秒。", itemType: "trap" } ),
    new Shopitem( "alarm_trap", "team_upgrade", "diamond", 1, 1, { description: "让隐身的敌人立刻显形，并警报入侵者的名字和队伍。", itemType: "trap" } ),
    new Shopitem( "miner_fatigue_trap", "team_upgrade", "diamond", 1, 1, { description: "造成挖掘疲劳效果，持续 10 秒。", itemType: "trap" } )
]
    
