/**
 * 起床战争事件集
 * 带有 <lang> 标签的部分，是可能需要使用 .lang 文件翻译的部分
 */

import {
    world, 
    system, 
    Entity, 
    Container, 
    PlayerBreakBlockBeforeEvent, 
    ItemCompleteUseAfterEvent, 
    ProjectileHitEntityAfterEvent, 
    ProjectileHitBlockAfterEvent, 
    PlayerPlaceBlockAfterEvent, 
    ExplosionBeforeEvent, 
    EntityHurtAfterEvent, 
    EntityDieAfterEvent,
    PlayerLeaveBeforeEvent,
    PlayerSpawnAfterEvent,
    ItemUseOnAfterEvent,
    ItemUseOnBeforeEvent,
    ScriptEventCommandMessageAfterEvent
} from "@minecraft/server";
import * as constants from "./constants.js"
import * as methods from "./methods.js"
import * as maps from "./maps.js"

/**
 * 【循环类】等待大厅功能，包括：记分板显示、设置出生点，将玩家传送回来
 */
export function waitingHallFunction( ) {
    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap;

    /** 记分板显示 */
    map.waitingScoreboard()

    /** 将在外面的玩家传送回来 */
    methods.eachPlayer( player => {
        if ( player.runCommand( `execute if entity @s[x=-12,y=119,z=-12,dx=25,dy=10,dz=25]` ).successCount === 0 && player.getGameMode() !== "creative" ) {
            player.setGameMode( "adventure" ); player.teleport( { x:0, y:121, z:0 } )
        }
    } )

}

/**
 * 【循环类】清除原场景功能 | 在开始地图前所进行的地图清除工作
 */

export function resetMapFunction( ) {
    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap;

    /** 清除地图 */
    if ( system.currentTick % 2 === 0 ) {
        map.resetMapCurrentHeight--;
        constants.overworld.runCommand( `fill 0 ${map.resetMapCurrentHeight} 0 105 ${map.resetMapCurrentHeight} 105 air` );
        constants.overworld.runCommand( `fill 0 ${map.resetMapCurrentHeight} 0 -105 ${map.resetMapCurrentHeight} 105 air` );
        constants.overworld.runCommand( `fill 0 ${map.resetMapCurrentHeight} 0 105 ${map.resetMapCurrentHeight} -105 air` );
        constants.overworld.runCommand( `fill 0 ${map.resetMapCurrentHeight} 0 -105 ${map.resetMapCurrentHeight} -105 air` );
        /** 清除进程结束后，生成地图 */
        if ( map.resetMapCurrentHeight <= 0 ) { map.gameStage = 1; map.structureLoadCountdown = 120; }
    }

}

/**
 * 【循环类】地图加载功能 | 加载地图
 */
export function mapLoadFunction( ) {
    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap;

    /** 剩余119刻时加载结构 */
    if ( map.structureLoadCountdown === 119 ) { map.generateMap() }
    /** 剩余19刻时加载队伍颜色 */
    if ( map.structureLoadCountdown === 19 ) { map.teamIslandInit() }
    /** 剩余0刻时，进入下一阶段 */
    if ( map.structureLoadCountdown === 0 ) { map.gameStage = 2; map.gameStartCountdown = methods.settings.gameStartWaitingTime; }

    map.structureLoadCountdown--;

}

/**
 * 【循环类】等待功能
 */
export function waitingFunction() {
    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap;

    /** 大于规定的人数时，开始倒计时 */
    if ( methods.getPlayerAmount() >= methods.settings.minWaitingPlayers ) {
        map.gameStartCountdown--;
        methods.eachPlayer( player => {
            if ( map.gameStartCountdown === 399 ) {
                player.sendMessage( { translate: "message.gameStart", with: [ `20` ] } );
                player.playSound( "note.hat", { location: player.location } );
            } else if ( map.gameStartCountdown === 199 ) {
                player.sendMessage( { translate: "message.gameStart", with: [ `§610` ] } );
                methods.showTitle( player, `§a10`, "", { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 } );
                player.playSound( "note.hat", { location: player.location } );
            } else if ( map.gameStartCountdown < 100 && map.gameStartCountdown % 20 === 19 ) {
                player.sendMessage( { translate: "message.gameStart", with: [ `§c${methods.tickToSecond( map.gameStartCountdown )}` ] } );
                methods.showTitle( player, `§c${methods.tickToSecond( map.gameStartCountdown )}`, "", { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 } );
                player.playSound( "note.hat", { location: player.location } );
            }
        } )

    }

    /** 人数不足时，且已经开始倒计时，则取消倒计时 */
    if ( methods.getPlayerAmount() < methods.settings.minWaitingPlayers && map.gameStartCountdown < methods.settings.gameStartWaitingTime ) {
        map.gameStartCountdown = methods.settings.gameStartWaitingTime;
        methods.eachPlayer( player => {
            player.sendMessage( { translate: "message.needsMorePlayer" } );
            methods.showTitle( player, { translate: "title.needsMorePlayer" }, "", { fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 0 } );
            player.playSound( "note.hat", { location: player.location } );
        } )
    }

    /** 开始游戏 */
    if ( map.gameStartCountdown === 0 ) {
        map.gameStart()
    }

}

/**
 * 【事件类】玩家破坏方块事件，包括破坏原版方块的检测和破坏床的检测
 * @param {PlayerBreakBlockBeforeEvent} event 
 */
export function playerBreakBlockEvent( event ) {

    let blockId = event.block.typeId;

    // 如果玩家破坏的方块是原版方块，且不属于在 constants.breakableVanillaBlocksByPlayer 数组中的可破坏方块，则防止玩家破坏方块
    if ( blockId.includes( "minecraft:" ) && !constants.breakableVanillaBlocksByPlayer.includes( blockId ) && !methods.settings.creativePlayerCanBreakBlocks ) {
        let breaker = event.player;
        system.run( () => {
            methods.warnPlayer( breaker, { translate: "message.breakingInvalidBlocks" } );
        } );
        event.cancel = true;
    }

    // 如果玩家破坏的方块是床，进行判定
    if ( event.block.typeId === "minecraft:bed" ) {
        /** 获取基本信息 */
        let breaker = event.player;
        /** @type {methods.BedwarsPlayer}*/ let breakerInfo = breaker.bedwarsInfo;
        /** @type {methods.BedwarsTeam[]} */ let teamList = world.bedwarsMap.teamList
        system.run( () => {
            /** 获取被破坏的床所属的队伍 | 可能返回 undefined */
            let team = teamList.filter( team => { return constants.overworld.getBlock( team.bedInfo.pos ).typeId === "minecraft:air" && team.bedInfo.isExist === true } )[0];
            if ( team !== undefined ){
                /** 被无信息的玩家破坏时 */
                if ( !methods.playerIsValid( breaker ) || breakerInfo.team === undefined ) { team.bedDestroyedByInvalidPlayer( breaker ) }
                /** 被自己队伍的玩家破坏时 */
                else if ( breakerInfo.team === team.id ) { team.bedDestroyedBySelfPlayer( breaker ); }
                /** 被其他队的玩家破坏时 */
                else { team.bedDestroyedByOtherPlayer( breaker ); };
                // 移除床的掉落物
                methods.removeItem( "minecraft:bed" );
            }
        } )
    }
}

/**
 * 【事件类】玩家喝下药水&魔法牛奶事件，提供药效或魔法牛奶对应标记效果
 * @param {ItemCompleteUseAfterEvent} event 
 */
export function playerUsePotionAndMagicMilkEvent( event ) {
    let itemType = event.itemStack.typeId;
    switch ( itemType ) {
        case "bedwars:potion_jump_boost":
            event.source.addEffect( "jump_boost", 900, { amplifier: 4 } );
            break;
        case "bedwars:potion_speed":
            event.source.addEffect( "speed", 900, { amplifier: 1 } );
            break;
        case "bedwars:potion_invisibility":
            event.source.addEffect( "invisibility", 600, { amplifier: 0 } );
            event.source.triggerEvent( "hide_armor" )
            break;
        case "bedwars:magic_milk": 
            if ( methods.playerIsValid( event.source ) ) {
                event.source.bedwarsInfo.magicMilk.enabled = true;
                event.source.bedwarsInfo.magicMilk.remainingTime = 600;
            }
        break;
    }
}

/**
 * 【循环类】魔法牛奶计时器
 */
export function magicMilkFunction( ) {
    methods.eachValidPlayer( player => { if ( player.bedwarsInfo.magicMilk.enabled ) {
        /** @type {methods.BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;
        playerInfo.magicMilk.remainingTime--;
        if ( playerInfo.magicMilk.remainingTime <= 0 ) {
            player.sendMessage( { translate: "message.magicMilkTimeOut" } )
            playerInfo.magicMilk.enabled = false
        }
    } } )
}

/**
 * 【事件类】玩家扔出床虱事件，在砸中的位置生成蠹虫
 * @param {ProjectileHitEntityAfterEvent | ProjectileHitBlockAfterEvent} event 
 */
export function bedBugEvent( event ) {
    if ( event.projectile.typeId === "bedwars:bed_bug" ) {
        /** 在砸中的位置生成一只蠹虫 */
        let silverfish = event.dimension.spawnEntity( "minecraft:silverfish", event.location ); 
        let thrower = event.source

        if ( methods.playerIsValid( thrower ) ) {
            /** @type {methods.BedwarsPlayer} */let throwerInfo = thrower.bedwarsInfo;

            /** 设置为玩家的队伍，并设置蠹虫的消失时间和名字的时间条 */
            silverfish.triggerEvent( `team_${throwerInfo.team}` );
            silverfish.team = throwerInfo.getTeam( )
            silverfish.name = () => {
                const index = Math.floor( silverfish.killTimer / 60 ); const bars = "■■■■■";
                if (index >= 0 && index <= 4) { return bars.slice(0, 5 - index) + "§7" + bars.slice(5 - index); }
                return "§7■■■■■";
            }

            silverfish.killTimer = 0;
        }
    }
}

/**
 * 【循环类】床虱计时器，每只蠹虫最多存活 15 秒，更新其名称
 */
export function bedbugFunction( ) {
    constants.overworld.getEntities( { type: "minecraft:silverfish" } ).filter( silverfish => { return silverfish.killTimer !== undefined } ).forEach( silverfish => {
        silverfish.killTimer++;
        silverfish.nameTag = `§8[§r${silverfish.team.getTeamName( "format_code" )}${silverfish.name()}§8]\n§l${silverfish.team.getTeamName( "name" )}队 §r${silverfish.team.getTeamName( "format_code" )}蠹虫`;
        if ( silverfish.killTimer >= 300 ) { silverfish.kill( ) };
    } )
}

/**
 * 【事件类】玩家使用梦境守护者事件，在使用的位置生成铁傀儡
 * @param {ItemUseOnBeforeEvent} event
 */
export function dreamDefenderEvent( event ) {
    if ( event.itemStack.typeId === "bedwars:dream_defender" ) {
        event.cancel = true;
        system.run( () => {
            /** 在梦境守护者使用的方块上方生成一只铁傀儡 */ 
            let placePosition = { x: event.block.location.x, y: event.block.location.y + 1, z: event.block.location.z }
            let ironGolem = event.block.dimension.spawnEntity( "minecraft:iron_golem", placePosition ); 
            let placer = event.source
            placer.getGameMode() === "creative" ? null : placer.runCommand( `clear @s bedwars:dream_defender -1 1` ) ;
            if ( methods.playerIsValid( placer ) ) {
                /** @type {methods.BedwarsPlayer} */let placerInfo = placer.bedwarsInfo;
                /** 设置为玩家的队伍，并设置铁傀儡的消失时间和名字的时间条 */
                ironGolem.triggerEvent( `team_${placerInfo.team}` );
                ironGolem.team = placerInfo.getTeam( )
                ironGolem.name = () => {
                    const index = Math.floor( ironGolem.killTimer / 480 ); const bars = "■■■■■■■■■■";
                    if (index >= 0 && index <= 10) { return bars.slice(0, 10 - index) + "§7" + bars.slice(10 - index); }
                    return "§7■■■■■■■■■■";
                }
                ironGolem.killTimer = 0;
            }
        } )
    }
}

/**
 * 【事件类】玩家使用方块事件，如果使用的方块是位于地图限制的最高位置，则阻止玩家使用
 * @param {ItemUseOnBeforeEvent} event
 */
export function playerUseItemOnHeightLimitEvent( event ) {
    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap;
    if ( event.block.location.y > map.highestBlockLimit && event.source.getGameMode() !== "creative" ) {
        event.cancel = true;
        event.source.sendMessage( { translate: "§c达到建筑高度限制！" } )
    }
}

/**
 * 【循环类】梦境守护者计时器，每只铁傀儡最多存活 240 秒，更新其名称
 */
export function dreamDefenderFunction( ) {
    constants.overworld.getEntities( { type: "minecraft:iron_golem" } ).filter( ironGolem => { return ironGolem.killTimer !== undefined } ).forEach( ironGolem => {
        ironGolem.killTimer++;
        ironGolem.nameTag = `§8[§r${ironGolem.team.getTeamName( "format_code" )}${ironGolem.name()}§8]\n§l${ironGolem.team.getTeamName( "name" )}队 §r${ironGolem.team.getTeamName( "format_code" )}铁傀儡`;
        if ( ironGolem.killTimer >= 4800 ) { ironGolem.kill( ) };
    } )
}

/**
 * 【循环类】搭桥蛋功能，经过之处生成掷出者队伍的羊毛；范围3*3，完整度85%
 */
export function bridgeEggFunction( ) {
    constants.overworld.getEntities( { type: "bedwars:bridge_egg" } ).forEach( bridgeEgg => {
        /** @type {Entity} */ let owner = bridgeEgg.getComponent( "minecraft:projectile" ).owner;
        if ( methods.playerIsValid( owner ) ) {
            /** @type {methods.BedwarsPlayer} */ let ownerInfo = owner.bedwarsInfo;
            for (let x = -1; x <= 1; x++) { for (let z = -1; z <= 1; z++) { if ( Math.random() < 0.85 ) {
                bridgeEgg.runCommand(`fill ~${x}~-2~${z} ~${x}~-2~${z} bedwars:${ownerInfo.team}_wool keep`);
                methods.eachPlayer( player => { player.playSound( "random.pop", { location: bridgeEgg.location } ) } )
            } } }
        }
    } )
}

/**
 * 【事件类】玩家放下TNT事件
 * @param {PlayerPlaceBlockAfterEvent} event 
 */
export function playerUseTNTEvent( event ) {
    if ( event.block.typeId === "bedwars:tnt" ) {
        let x = event.block.location.x; let y = event.block.location.y; let z = event.block.location.z; 
        event.player.runCommand( `setblock ${x} ${y} ${z} air` );
        event.player.runCommand( `summon minecraft:tnt ${x+0.5} ${y} ${z+0.5}` )
    }
}

/**
 * 【事件类】玩家放下水桶事件
 * @param {ItemUseOnAfterEvent} event 
 */
export function playerUseWaterBucketEvent( event ) {
    if ( event.itemStack.typeId === "minecraft:water_bucket" ) {
        event.source.runCommand( `clear @s bucket` );
    }
}

/**
 * 【循环类】玩家装备检测与补充，包括剑斧附魔检测、盔甲存在与附魔检测、剑镐斧剪刀供应
 */
export function equipmentFunction( ) {
    methods.eachPlayer( player => { if ( methods.playerIsAlive( player ) ) {

        /** @type {methods.BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;

        /** 剑、斧附魔检测器 */
        if ( playerInfo.getTeam( ).teamUpgrade.sharpenedSwords === true ) {
            [ "wooden", "stone", "iron", "diamond" ].forEach( tier => { [ "sword", "axe" ].forEach( type => { player.runCommand( `/enchant @s[hasitem={item=bedwars:${tier}_${type},location=slot.weapon.mainhand}] sharpness 1` ) } ) } )
        }
        
        /** 盔甲检测器 */
        let playerEquipment = player.getComponent( "minecraft:equippable" );
        let enchantmentLevel = playerInfo.getTeam( ).teamUpgrade.reinforcedArmor
        let equipmentType = ( ) => { switch ( playerInfo.equipment.armor ) { case 2: return "chainmail"; case 3: return "iron"; case 4: return "diamond"; default: return `${playerInfo.team}`; } }
        if ( playerEquipment.getEquipment( "Head" ) === undefined || methods.getEnchantmentLevel( player, "Head", "protection" ) !== enchantmentLevel ) {
            methods.replaceEquipmentItem( player, `bedwars:${playerInfo.team}_helmet`, "Head", { itemLock: "slot", enchantments: [ { id: "protection", level: enchantmentLevel } ] } )
        }
        if ( playerEquipment.getEquipment( "Chest" ) === undefined || methods.getEnchantmentLevel( player, "Chest", "protection" ) !== enchantmentLevel ) {
            methods.replaceEquipmentItem( player, `bedwars:${playerInfo.team}_chestplate`, "Chest", { itemLock: "slot", enchantments: [ { id: "protection", level: enchantmentLevel } ] } )
        }
        if ( playerEquipment.getEquipment( "Legs" ) === undefined || methods.getEnchantmentLevel( player, "Legs", "protection" ) !== enchantmentLevel || playerEquipment.getEquipment( "Legs" ).typeId !== `bedwars:${equipmentType()}_leggings` ) {
            methods.replaceEquipmentItem( player, `bedwars:${equipmentType()}_leggings`, "Legs", { itemLock: "slot", enchantments: [ { id: "protection", level: enchantmentLevel } ] } )
        }
        if ( playerEquipment.getEquipment( "Feet" ) === undefined || methods.getEnchantmentLevel( player, "Feet", "protection" ) !== enchantmentLevel || playerEquipment.getEquipment( "Feet" ).typeId !== `bedwars:${equipmentType()}_boots` ) {
            methods.replaceEquipmentItem( player, `bedwars:${equipmentType()}_boots`, "Feet", { itemLock: "slot", enchantments: [ { id: "protection", level: enchantmentLevel } ] } )
        }

        /** 剑镐斧剪刀供应器 */
        playerInfo.swordSupplier()
        playerInfo.axeSupplier()
        playerInfo.pickaxeSupplier()
        playerInfo.shearsSupplier()
    } } )
}

/**
 * 【事件类】爆炸物事件，包括：防止爆炸破坏特定方块；对无法从爆炸中生成掉落物的自定义方块，手动生成掉落物；火球跳功能
 * @param {ExplosionBeforeEvent} event
 */
export function explosionEvents( event ) {

    /** 将爆炸破坏的方块设置为非原版方块，或属于在 constants.breakableVanillaBlocksByExplosion 数组中的可破坏方块 */
    event.setImpactedBlocks( event.getImpactedBlocks( ).filter( block => { return !block.typeId.includes( "minecraft:" ) || constants.breakableVanillaBlocksByExplosion.includes( block.typeId ) } ) );

    /** 在可破坏的方块列表中，如果有属于 constants.dropsFromExplosion 的方块，则在方块位置生成掉落物 */
    let blockList = [];
    event.getImpactedBlocks().filter( block => { if ( world.gameRules.tntExplosionDropDecay === false && event.source.typeId === "minecraft:tnt" ) { return constants.dropsFromExplosion.includes( block.typeId ) } else { return constants.dropsFromExplosion.includes( block.typeId ) && Math.random() < 0.33 } } ).forEach( block => { blockList.push( { id: block.typeId, pos: block.location } ) } );
    system.run( () => { blockList.forEach( block => { methods.spawnItem( block.pos, block.id, { clearVelocity: false } ); } ); } )

    /** 火球跳：如果爆炸发生在玩家 2.5 格附近，则给玩家一个 y 方向的速度 */
    let pos = methods.copyPosition( event.source.location )
    system.run( () => { let players = methods.getPlayerNearby( pos, 2.5 ); if ( players.length !== 0 ) { players.forEach( player => { player.applyKnockback( 0, 0, 0, 1 + 0.5 * Math.random() ) } ) } } )

}

/**
 * 【循环类】爆炸物功能，对火球和TNT附近的玩家施加抗性提升的效果，以求高破坏低伤害
 */
export function explosionFunction( ) {
    constants.overworld.getEntities( { type: "bedwars:fireball" } ).forEach( fireball => {
        let playerNearFireball = methods.getPlayerNearby( fireball.location, 2.5 );
        if ( playerNearFireball.length !== 0 ) { playerNearFireball.forEach( player => { player.addEffect( "resistance", 5, { showParticles: false, amplifier: 3 } ) } ) } 
    } )
    constants.overworld.getEntities( { type: "minecraft:tnt" } ).forEach( tnt => {
        let playerNeartnt = methods.getPlayerNearby( tnt.location, 2.5 );
        if ( playerNeartnt.length !== 0 ) { playerNeartnt.forEach( player => { player.addEffect( "resistance", 5, { showParticles: false, amplifier: 3 } ) } ) } 
    } )
}

/**
 * 【循环类】药效功能，包括饱和、疯狂矿工（急迫）、治愈池（生命恢复），每秒执行 1 次
 */
export function effectFunction( ) {

    if ( system.currentTick % 20 === 0 ) {

        /** 全局：饱和效果 */
        methods.eachPlayer( player => { player.addEffect( "saturation", 1, { amplifier: 9, showParticles: false } ); } )

        /** 团队升级 */
        if ( world.bedwarsMap.gameStage === 3 ) { methods.eachTeam( team => { team.teamUpgradeEffect( ) } ); };

    }
}

/**
 * 【循环类】陷阱功能，包括陷阱的触发、陷阱的提示
 */
export function trapFunction( ) {

    /** 陷阱信息在玩家物品栏的显示 */
    methods.eachPlayer( player => { if ( methods.playerIsAlive( player ) ) { player.bedwarsInfo.showTrapsInInventory() } } ) 

    /** 陷阱运行 */
    methods.eachTeam( team => {
    
        /** ===== 队伍的陷阱冷却控制 ===== */
        if ( team.trapCooldown.isEnabled === true ) {
            team.trapCooldown.value--;
            if ( team.trapCooldown.value <= 0 ) { team.trapCooldown.isEnabled = false; team.trapCooldown.value = 600; }
        };
    
        /** ===== 陷阱触发 ===== */
    
        /** 获取入侵的敌人信息 */
        let getEnemy = () => {
            /** 获取床 10 格范围内所有玩家 */
            let playersNearBed = methods.getPlayerNearby( team.bedInfo.pos, 10 );
            /** 不是无玩家的情况 */
            if ( playersNearBed.length !== 0 ) {
                let enemies = playersNearBed.filter( player => {
                    /** @type {methods.BedwarsPlayer} */ let playerInfo = player.bedwarsInfo
                    return methods.playerIsAlive( player ) /** 不是无效玩家且不是已死亡的玩家 */
                    && playerInfo.team !== team.id /** 不是本队玩家 */
                    && playerInfo.magicMilk.enabled !== true /** 不是喝了魔法牛奶的玩家 */
                } )
                if ( enemies.length !== 0 ) { return enemies[0] }
            }
        }
    
        let enemy = getEnemy();
        /** 当：1. 该队伍的一号位存在陷阱；2. 该队伍的陷阱不处于冷却状态； 3. 存在未喝魔法牛奶的未死亡合法敌人，
         *  则：触发陷阱
         */
        if ( team.teamUpgrade.trap1Type !== "" && team.trapCooldown.isEnabled === false && enemy !== undefined ) {
            team.triggerTrap( enemy )
        }
    
        /** ===== 警报陷阱 ===== */
        if ( team.alarming.isEnabled === true ) {
            team.alarming.value++;
            methods.eachPlayer( player => {
                if ( team.alarming.value % 4 === 0 ) {
                    player.playSound( "note.pling", { pitch: 1.5, location: team.bedInfo.pos } ) /** 给床附近的人以警告 */
                    team.getTeamMember().forEach( teamPlayer => { teamPlayer.playSound( "note.pling", { pitch: 1.5, location: teamPlayer.location } ) } )
                }
                else if ( team.alarming.value % 4 === 2 ) {
                    player.playSound( "note.pling", { pitch: 1.7, location: team.bedInfo.pos } )
                    team.getTeamMember().forEach( teamPlayer => { teamPlayer.playSound( "note.pling", { pitch: 1.7, location: teamPlayer.location } ) } )
                }
            } )
            if ( team.alarming.value >= 112 ) { team.alarming.isEnabled = false; team.alarming.value = 0; }
        };
    } )

}

/**
 * 【循环类】资源生成功能，分队伍资源生成与世界资源生成，以及玩家位置检测（以调整上限）
 */
export function spawnResourceFunction( ) {

    /** 获取地图信息 */ /** @type { methods.BedwarsMap } */ let map = world.bedwarsMap
    
    /** 各队伍的资源生成 | 铁锭、金锭、绿宝石 | 受设置“允许无效队伍产生资源”的影响 */
    methods.eachTeam( team => { if ( methods.settings.invalidTeamCouldSpawnResources === true || ( methods.settings.invalidTeamCouldSpawnResources === false && team.isValid === true ) ) {
        if ( team.spawnerInfo.ironCountdown <= 0 ) {
            for ( let i = 0; i < map.spawnerInfo.ironSpawnTimes; i++ ) { team.spawnResources( "iron", map.spawnerInfo.distributeResource, map.spawnerInfo.clearResourceVelocity ); }
            team.spawnerInfo.ironCountdown = Math.floor( map.spawnerInfo.ironInterval * map.spawnerInfo.ironSpawnTimes / team.getForgeSpeedBonus() );
        };
        if ( team.spawnerInfo.goldCountdown <= 0 ) {
            team.spawnResources( "gold", map.spawnerInfo.distributeResource, map.spawnerInfo.clearResourceVelocity );
            team.spawnerInfo.goldCountdown = Math.floor( map.spawnerInfo.goldInterval / team.getForgeSpeedBonus() );
        };
        if ( team.spawnerInfo.emeraldCountdown <= 0 ) {
            team.spawnResources( "emerald", map.spawnerInfo.distributeResource, map.spawnerInfo.clearResourceVelocity );
            team.spawnerInfo.emeraldCountdown = map.spawnerInfo.emeraldInterval;
        }
        team.spawnerInfo.ironCountdown--;
        team.spawnerInfo.goldCountdown--;
        team.spawnerInfo.emeraldCountdown--;
        /** 检测玩家在资源点附近时，则清除使用次数 */
        if ( methods.getPlayerNearby( team.spawnerInfo.spawnerPos, 2.5 ).filter( player => methods.playerIsAlive(player) ).length !== 0 ) {
            team.resetSpawnerSpawnedTimes();
        };
    } } )

    /** 世界资源生成 | 钻石点、绿宝石点 */
    if ( map.spawnerInfo.diamondCountdown <= 0 ) {
        map.spawnResources( "diamond" );
        map.spawnerInfo.diamondCountdown = map.spawnerInfo.diamondInterval - 10 * 20 * map.spawnerInfo.diamondLevel ;
    };
    if ( map.spawnerInfo.emeraldCountdown <= 0 ) {
        map.spawnResources( "emerald" );
        map.spawnerInfo.emeraldCountdown = map.spawnerInfo.emeraldInterval - 10 * 20 * map.spawnerInfo.emeraldLevel ;
    };
    map.spawnerInfo.diamondCountdown--;
    map.spawnerInfo.emeraldCountdown--;

    /** 显示资源点动画和生成信息 */
    map.showTextAndAnimation( );

    /** 检测玩家在资源点附近时，则清除使用次数 */
    map.spawnerInfo.diamondInfo.forEach( spawner => {
        if ( methods.getPlayerNearby( spawner.pos, 2.5 ).length !== 0 ) { map.resetSpawnerSpawnedTimes( spawner.pos ); };
    } );
    map.spawnerInfo.emeraldInfo.forEach( spawner => {
        if ( methods.getPlayerNearby( spawner.pos, 2.5 ).length !== 0 ) { map.resetSpawnerSpawnedTimes( spawner.pos ); };
    } );

}

/**
 * 【循环类】交易功能，控制玩家在商人附近锁定物品、交易功能、清除商店物品掉落物
 */
export function tradeFunction() {

    /** 当玩家在商人3格以内时，并且商人在玩家视角之中时，设置其所有物品为itemLock的，以防止玩家将物品放进商人背包之中 */

    methods.eachPlayer( player => {
        let haveTraderNearby = player.runCommand( "execute if entity @e[r=3.5,type=bedwars:trader]" ).successCount === 1
        let haveTraderInView = player.getEntitiesFromViewDirection( { type: "bedwars:trader", maxDistance: 3.5 } )
        let alwaysLockInInventory = [ "bedwars:wooden_sword", "bedwars:wooden_pickaxe", "bedwars:iron_pickaxe", "bedwars:golden_pickaxe", "bedwars:diamond_pickaxe", "bedwars:wooden_axe", "bedwars:stone_axe", "bedwars:iron_axe", "bedwars:diamond_axe", "bedwars:shears"  ]
        if ( haveTraderNearby === true && haveTraderInView.length !== 0 ) {
            /** @type {Container} */ let playerInventory = player.getComponent( "minecraft:inventory" ).container
            for ( let i = 0; i < playerInventory.size; i++ ) {
                if ( playerInventory.getItem(i) !== undefined && playerInventory.getSlot(i).lockMode === "none" && !alwaysLockInInventory.includes(playerInventory.getSlot(i).typeId) ) {
                    playerInventory.getSlot(i).lockMode = "inventory"
                }
            }
        } else {
            /** @type {Container} */ let playerInventory = player.getComponent( "minecraft:inventory" ).container
            for ( let i = 0; i < playerInventory.size; i++ ) {
                if ( playerInventory.getItem(i) !== undefined && playerInventory.getSlot(i).lockMode === "inventory" && !alwaysLockInInventory.includes(playerInventory.getSlot(i).typeId) ) {
                    playerInventory.getSlot(i).lockMode = "none"
                }
            }
            
        }
    } )
    
    
    /** 商人填充物品 */
    for ( let i = 0; i < methods.blocksAndItemsShopitems.length; i++ ) { methods.blocksAndItemsShopitems[i].setTraderItem(i) };
    for ( let i = 0; i < methods.weaponAndArmorShopitems.length; i++ ) { methods.weaponAndArmorShopitems[i].setTraderItem(i) };
    for ( let i = 0; i < methods.teamUpgradeShopitems.length; i++ ) { methods.teamUpgradeShopitems[i].setTraderItem(i) };
    
    /** 玩家购买物品 */
    methods.eachPlayer( player => {
        methods.blocksAndItemsShopitems.forEach( item => { item.playerPurchaseItems( player ) } )
        methods.weaponAndArmorShopitems.forEach( item => { item.playerPurchaseItems( player ) } )
        methods.teamUpgradeShopitems.forEach( item => { item.playerPurchaseItems( player ) } )
    } )
    
    /** 清除不必要的掉落物 */
    constants.overworld.getEntities( { type: "minecraft:item" } ).forEach( item => {
        if ( item.getComponent( "minecraft:item" ).itemStack.typeId.includes( "bedwars:shopitem_" ) || item.getComponent( "minecraft:item" ).itemStack.typeId.includes( "bedwars:upgrade_" ) ) { item.remove( ) }
    } )

    /** 设置玩家不得进入商人区域 */
    methods.eachPlayer( player => {
        if ( methods.playerIsAlive( player ) ) { player.runCommand( `function maps/${world.bedwarsMap.id}/player_into_shop` ) }
    } )
    
}

/**
 * 【循环类】重生功能，包括玩家重生点设定和玩家死亡重生时的事件
 */
export function respawnFunction() {

    methods.eachValidPlayer( player => { 

        /** 玩家重生点设定 */
        player.setSpawnPoint( { ...world.bedwarsMap.spawnpointPos, ...{ dimension: constants.overworld } } )

        /** 玩家死亡时事件 */
        if ( player.bedwarsInfo.deathState.isDeath ) {

            /** @type {methods.BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;
    
            /** 对可重生玩家 */
            if ( playerInfo.deathState.respawnCountdown > 0 ) {
                player.getGameMode() !== "creative" ? player.setGameMode( "spectator" ) : null;
                playerInfo.deathState.respawnCountdown--;
                if ( playerInfo.deathState.respawnCountdown % 20 === 19 ) {
                    methods.showTitle( player, { translate: "title.respawning" }, { translate: "subtitle.respawning", with: [ `${methods.tickToSecond(playerInfo.deathState.respawnCountdown)}` ] }, { fadeInDuration: 0 } )
                    player.sendMessage( { translate: "message.respawning", with: [ `${methods.tickToSecond(playerInfo.deathState.respawnCountdown)}` ] } );
                }
            }
            /** 重生倒计时结束后，重生玩家 */
            else if ( playerInfo.deathState.respawnCountdown === 0 ) {
                playerInfo.playerRespawned()
            }
            /** 对不可重生玩家 */
            else {
                player.getGameMode() !== "creative" ? player.setGameMode( "spectator" ) : null;
            }
    
        }

    } )

}

/**
 * 【事件类】玩家受伤判定（常规攻击），获取攻击玩家信息
 * @param {EntityHurtAfterEvent} event 
 */
export function hurtByPlayerEvent( event ) {

    /** 获取攻击者和被攻击者的信息 */
    let player = event.hurtEntity;
    let attacker = event.damageSource.damagingEntity;

    if ( methods.playerIsValid( player ) ) {
        /** @type {methods.BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;
        if ( attacker !== undefined && attacker.typeId === "minecraft:player" ) {
            playerInfo.lastHurt.attacker = attacker;
            playerInfo.lastHurt.attackedSinceLastAttack = 0;
            if ( player.getComponent( "minecraft:is_sheared" ) !== undefined ) {
                player.triggerEvent( "show_armor" );
                player.sendMessage( { translate: "message.beHitWhenInvisibility" } );
            }
        }
    }

}

/**
 * 【事件类】玩家受伤判定（火球攻击），获取攻击玩家信息；火球爆炸范围4格内均认为是被火球炸伤
 * @param {ProjectileHitBlockAfterEvent | ProjectileHitEntityAfterEvent} event 
 */
export function hurtByFireballsEvent( event ) {

    /** 获取受伤玩家、火球和火球掷出者的信息 */
    let fireball = event.projectile;
    let explosionPos = event.location;
    let fireballOwner = event.source
    if ( fireball.typeId === "bedwars:fireball" && methods.getPlayerNearby( explosionPos, 4 ).length !== 0 ) {
        methods.eachValidPlayer( player => { if ( methods.getPlayerNearby( explosionPos, 4 ).includes( player ) && player !== fireballOwner ) {
            /** @type {methods.BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;
            playerInfo.lastHurt.attacker = fireballOwner;
            playerInfo.lastHurt.attackedSinceLastAttack = 0;
            if ( player.getComponent( "minecraft:is_sheared" ) !== undefined ) {
                player.triggerEvent( "show_armor" );
                player.sendMessage( { translate: "message.beHitWhenInvisibility" } );
            }
        } } )
    }
}

/**
 * 【循环类】玩家受伤计时器，计算玩家自上次受伤的时间，超过 10 秒后则复原
 */
export function playerHurtFunction( ) {
    methods.eachValidPlayer( player => { 
        /** @type {methods.BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;
        if ( playerInfo.lastHurt.attackedSinceLastAttack < 200 ) {
            playerInfo.lastHurt.attackedSinceLastAttack++
        } else {
            playerInfo.lastHurt.attacker = undefined
        }
    } )
}

/**
 * 【事件类】玩家死亡判定，设置玩家的死亡状态，获取死亡类型
 * @param {EntityDieAfterEvent} event 
 */
export function playerDieEvent( event ) {
    let player = event.deadEntity;
    let deathType = event.damageSource.cause;
    let killer = event.damageSource.damagingEntity;
    if ( methods.playerIsValid( player ) ) {
        /** @type {methods.BedwarsPlayer} */ let playerInfo = player.bedwarsInfo;
        if ( [ "entityAttack", "projectile", "fall", "void", "entityExplosion" ].includes( deathType ) ) { playerInfo.deathState.deathType = deathType }
        else { deathType = "other" }
        playerInfo.playerDied( killer )
    }
}

/**
 * 【循环类】设置玩家跌入虚空后，施加大量的 void 类型伤害
 */
export function voidDamageFunction( ) {
    methods.eachValidPlayer( player => { 
        player.runCommand( "execute if entity @s[x=~,y=0,z=~,dx=0,dy=-60,dz=0] run damage @s 200 void" )
    } )
}

/**
 * 【循环类】记分板显示功能，按队伍决定展示何种记分板；以及显示玩家血量
 */
export function scoreboardFunction( ) {

    if ( system.currentTick % 3 === 0 ) {
        /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap

        switch ( map.teamCount ) {
            case 2:
                methods.eachValidPlayer( player => { player.bedwarsInfo.show2TeamsScoreboard() } )
                break;
            case 4:
                methods.eachValidPlayer( player => { player.bedwarsInfo.show4TeamsScoreboard() } )
                break;
            case 8:
                methods.eachValidPlayer( player => { player.bedwarsInfo.show8TeamsScoreboard() } )
                break;
        }
    }

    world.scoreboard.getObjective( "health" ) === undefined ? world.scoreboard.addObjective( "health", "§c❤" ) : null;
    world.scoreboard.getObjectiveAtDisplaySlot( "BelowName" ) === undefined ? world.scoreboard.setObjectiveAtDisplaySlot( "BelowName", { objective: world.scoreboard.getObjective( "health" ) } ) : null
    methods.eachValidPlayer( player => { player.bedwarsInfo.showHealth() } )
}

/**
 * 【循环类】游戏事件功能，在一段时间过后执行一个游戏事件，例如钻石、绿宝石生成点的升级
 */
export function gameEventFunction( ) {
    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap

    if ( map.gameEvent.nextEventCountdown > 0 ) { map.gameEvent.nextEventCountdown-- }
    else { map.triggerEvent() }
}

/**
 * 【循环类】队伍功能，包括队伍淘汰判定、胜利判定
 */
export function teamFunction( ) {
    methods.eachTeam( team => {

        /** 如果一个队伍有床但没有玩家，则设置为无效的队伍 */
        // if ( team.bedInfo.isExist === true && team.getTeamMember().length === 0 ) { team.setTeamInvalid() }

        /** 如果一个队伍没床并且没有玩家，则该队伍为被淘汰 */
        if ( team.bedInfo.isExist === false && team.getAliveTeamMember().length === 0 && team.isEliminated === false ) { team.setTeamEliminated() }

    } )

    /** 如果仅剩一个队伍存活，则该队伍获胜 */
    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap
    if ( map.getAliveTeam().length <= 1 ) { map.gameOver( map.getAliveTeam()[0] ) }
    
}

/**
 * 【事件类】玩家重进事件，玩家进入时恢复数据 | 仅在游戏时试图恢复数据
 * @param {PlayerSpawnAfterEvent} event 
 */
export function playerRejoinEvent( event ) {
    
    /** 获取玩家对应的记分板和队伍 */
    let player = event.player;
    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap

    /** 如果重生的玩家是无效玩家，则为重进的玩家 */
    if ( !methods.playerIsValid( player ) ) {

        /** 尝试获取玩家的游戏 ID，只有 ID 一致时方可继续判断 */
        let data = world.scoreboard.getObjective( player.name );
        let runtimeId = 0;
        if ( data !== undefined ) { runtimeId = data.getScore( "runtimeId" ); }

        if ( runtimeId === map.gameId ) {

            /** 尝试获取玩家的队伍信息，并加入进队伍中，此时能保证备份记分板一定存在 */
            let team = 12; team = data.getScore( "team" )
            methods.eachTeam( teamInfo => { if ( teamInfo.id === methods.teamNumberToTeamName( team ) ) { teamInfo.addPlayer( player ) } } )

            /** 如果玩家已经加入到了队伍之中，此时将拥有合法的玩家数据，同时也 */
            if ( methods.playerIsValid( player ) ) { player.bedwarsInfo.dataReset( data ) }
            /** 如果玩家没能加入到队伍中，则为旁观者 */
            else { world.bedwarsMap.addSpectator( player ); world.scoreboard.removeObjective( player.name ) }

        } else {
            world.bedwarsMap.addSpectator( player )
        }

    }

    /** 等待期间时执行的内容 */
    if ( map.gameStage < 3 ) { methods.initPlayer( player ) }

}

/**
 * 【事件类】玩家离开事件，玩家退出时备份数据 | 仅限游戏时试图备份
 * @param {PlayerLeaveBeforeEvent} event 
 */
export function playerLeaveEvent( event ) {
    let player = event.player;
    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap
    if ( methods.playerIsValid( player ) && map.gameStage >= 3 ) {
        player.bedwarsInfo.dataBackup( player )
    }
}

/**
 * 【循环类】游戏结束功能
 */
export function gameOverEvent( ) {

    /** @type {methods.BedwarsMap} */ let map = world.bedwarsMap
    map.nextGameCountdown--;

    if ( map.nextGameCountdown === 0 ) { maps.regenerateMap() }

}

/**
 * 【事件类】游戏手动设置功能 <lang>
 * @param {ScriptEventCommandMessageAfterEvent} event
 */
export function settingsEvent( event ) {

    let acceptableIds = [
        "bs:minWaitingPlayers",
        "bs:gameStartWaitingTime",
        "bs:resourceMaxSpawnTimes",
        "bs:respawnTime",
        "bs:invalidTeamCouldSpawnResources",
        "bs:randomMap",
        "bs:regenerateMap",
        "bs:creativePlayerCanBreakBlocks"
    ]

    /**
     * 判断执行命令的执行者是否为玩家，并发送给执行者执行消息
     * @param { String | import("@minecraft/server").RawMessage } message
     */
    let sendFeedback = ( message ) => {
        if ( event.sourceType === "Entity" && event.sourceEntity.typeId === "minecraft:player" ) { event.sourceEntity.sendMessage( message ) }
    }

    /**
     * 当命令的参数未给定时，按照特定的格式返回帮助信息和当前值
     * @param {{name:String,typeName:String}[]} pars - 参数信息
     * @param {String} description - 本命令的描述
     * @param {String|Number|Boolean} currentValue - 显示的返回值
     */
    let cmdDescription = (pars, description, currentValue) => {
        const parStrings = pars.map(par => `<${par.name}：${par.typeName}>`).join(' ');
        return `§e${event.id} ${parStrings}§f\n${description}\n§7当前值： ${currentValue}`;
    };

    /**
     * 判断输入的参数是否为布尔值，如果是则执行callback函数，否则报错
     * @param {String} par - 输入的参数
     * @param {String} parName - 输入的参数名称
     * @param {function(Boolean):void} callback
     */
    let booleanPar = ( par, parName, callback ) => {
        if ( par !== "true" && par !== "false" ) { sendFeedback( `§c解析 <${parName}> 参数时出现了问题，该参数只接受布尔值true或false。` ); }
        else if ( par === "true" ) { callback( true ) }
        else { callback( false ) }
    }

    /**
     * 判断输入的参数是否为整数，如果是则执行callback函数，否则报错
     * @param {Number} par - 输入的参数，需转换为数字
     * @param {String} parName - 输入的参数名称
     * @param {function(Number):void} callback
     */
    let intPar = ( par, parName, callback, min = 1 ) => {
        if ( !Number.isInteger( par ) ) { sendFeedback( `§c解析 <${parName}> 参数时出现了问题，该参数只接受整数。` ); }
        else if ( par < min ) { sendFeedback( `§c解析 <${parName}> 参数时出现了问题，该参数不允许小于 ${min} 的值。` ); }
        else ( callback( par ) )
    }

    /**
     * 判断输入的参数是否在所给列表之中，如果是则执行callback函数，否则报错
     * @param {String} par - 输入的参数
     * @param {String} parName - 输入的参数名称
     * @param {String[]} enumArray - 允许的参数
     * @param {function(String):void} callback
     */
    let enumPar = ( par, parName, enumArray, callback ) => {
        if ( !enumArray.includes(par) ) { sendFeedback( `§c解析 <${parName}> 参数时出现了问题，该参数只接受以下值：${enumArray.join(",")}。` ); }
        else ( callback( par ) )
    }

    /** 仅限玩家手动执行命令时执行 */
    if ( acceptableIds.includes( event.id ) ) {
        let par1Name = ""; let par2Name = "";
        let enum1Array = [];
        switch ( event.id ) {
            case "bs:minWaitingPlayers":
                par1Name = "玩家人数";
                if ( event.message === "" ) {
                    sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: "整数" } ],
                        "该值用于控制至少需要多少玩家才可开始游戏。",
                        `§a${methods.settings.minWaitingPlayers}`
                    ) )
                } else {
                    intPar( Number( event.message ), par1Name, par1 => {
                        sendFeedback( `开始游戏需求的玩家人数已更改为${par1}` );
                        methods.settings.minWaitingPlayers = par1;
                    }, 2 )
                }
                break;
            case "bs:gameStartWaitingTime":
                par1Name = "时间";
                if ( event.message === "" ) {
                    sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: "整数" } ],
                        "该值用于控制玩家达到规定数目后，多久后开始游戏。单位：游戏刻。",
                        `§a${methods.settings.gameStartWaitingTime}`
                    ) )
                } else {
                    intPar( Number( event.message ), par1Name, par1 => {
                        sendFeedback( `开始游戏的等待时间已更改为${par1}` );
                        methods.settings.gameStartWaitingTime = par1;
                        world.bedwarsMap.gameStartCountdown = par1;
                    } )
                }
                break;
            case "bs:resourceMaxSpawnTimes":
                par1Name = "资源类型"; enum1Array = [ "iron", "gold", "diamond", "emerald" ];
                par2Name = "最大生成数"
                if ( event.message === "" ) {
                    sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: enum1Array.join( " | " ) }, { name: par2Name, typeName: "整数" } ],
                        "该值用于控制游戏中的资源点最多允许生成的数目。",
                        `\n§7iron = §a${methods.settings.resourceMaxSpawnTimes.iron}\n§7gold = §a${methods.settings.resourceMaxSpawnTimes.gold}\n§7diamond = §a${methods.settings.resourceMaxSpawnTimes.diamond}\n§7emerald = §a${methods.settings.resourceMaxSpawnTimes.emerald}`
                    ) )
                } else {
                    enumPar( event.message.split(" ")[0], par1Name, enum1Array, par1 => {
                        intPar( Number(event.message.split(" ")[1]), par2Name, par2 => {
                            sendFeedback( `${par1}的最大生成数已更改为${par2}` );
                            methods.settings.resourceMaxSpawnTimes[par1] = par2;
                        } )
                    } )
                }
                break;
            case "bs:respawnTime":
                par1Name = "玩家类型"; enum1Array = [ "normalPlayers", "rejoinedPlayers" ];
                par2Name = "重生时长"
                if ( event.message === "" ) {
                    sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: enum1Array.join( " | " ) }, { name: par2Name, typeName: "整数" } ],
                        "该值用于控制游戏中的玩家重生所需要的时长。单位：游戏刻。",
                        `\n§7normalPlayers = §a${methods.settings.respawnTime.normalPlayers}\n§7rejoinedPlayers = §a${methods.settings.respawnTime.rejoinedPlayers}`
                    ) )
                } else {
                    enumPar( event.message.split(" ")[0], par1Name, enum1Array, par1 => {
                        intPar( Number(event.message.split(" ")[1]), "重生时长", par2 => {
                            sendFeedback( `${par1}类型玩家的重生时长已更改为${par2}游戏刻` );
                            methods.settings.respawnTime[par1] = par2;
                        } )
                    } )
                }
                break;
            case "bs:invalidTeamCouldSpawnResources":
                par1Name = "可生成资源"
                if ( event.message === "" ) {
                    sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: "布尔值" } ],
                        "该值用于控制游戏中没有分配到玩家的无效队伍是否能够生成资源。",
                        `§a${methods.settings.invalidTeamCouldSpawnResources}`
                    ) )
                } else {
                    booleanPar( event.message, "可生成资源", par1 => {
                        sendFeedback( `无效队伍生成资源的权限已更改为${par1}` );
                        methods.settings.invalidTeamCouldSpawnResources = par1
                    } )
                }
                break;
            case "bs:randomMap":
                par1Name = "地图类型", enum1Array = [ "allow2Teams", "allow4Teams", "allow8Teams" ]
                par2Name = "允许生成"
                if ( event.message === "" ) {
                    sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: enum1Array.join( " | " ) }, { name: par2Name, typeName: "布尔值" } ],
                        "控制游戏中何种类型的地图允许生成。",
                        `\n§7allow2Teams = §a${methods.settings.randomMap.allow2Teams}\n§7allow4Teams = §a${methods.settings.randomMap.allow4Teams}\n§7allow8Teams = §a${methods.settings.randomMap.allow8Teams}`
                    ) )
                } else {
                    enumPar( event.message.split(" ")[0], par1Name, enum1Array, par1 => {
                        booleanPar( event.message.split(" ")[1], par2Name, par2 => {
                            sendFeedback( `${par1}的允许生成状态已更改为${par2}` );
                            methods.settings.randomMap[par1] = par2;
                        } )
                    } )
                }
                break;
            case "bs:regenerateMap":
                let mapList = [];
                if ( methods.settings.randomMap.allow2Teams === true ) { mapList = mapList.concat(maps.validMapsFor2Teams); }
                if ( methods.settings.randomMap.allow4Teams === true ) { mapList = mapList.concat(maps.validMapsFor4Teams); }
                if ( methods.settings.randomMap.allow8Teams === true ) { mapList = mapList.concat(maps.validMapsFor8Teams); }

                par1Name = "生成地图"; enum1Array = enum1Array.concat( "true", mapList )

                if ( event.message === "" ) {
                    sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: enum1Array.join( " | " ) } ],
                        "立即生成地图。如果填写为true，则生成一张随机地图。\n生成的地图必须满足地图的生成条件，例如当2队地图禁用时，将不允许生成2队地图。",
                        `---`
                    ) )
                } else {
                    enumPar( event.message, par1Name, enum1Array, par1 => {
                        if ( par1 === "true" ) {
                            maps.regenerateMap();
                            sendFeedback( `即将生成一张随机地图。` );
                        }
                        else {
                            maps.regenerateMap( par1 );
                            sendFeedback( `即将生成地图${par1}。` );
                        }
                    } )
                }
                break;
            case "bs:creativePlayerCanBreakBlocks":
                par1Name = "可破坏方块"
                if ( event.message === "" ) {
                    sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: "布尔值" } ],
                        "该值用于控制游戏中创造模式玩家是否能够破坏原版方块。",
                        `§a${methods.settings.creativePlayerCanBreakBlocks}`
                    ) )
                } else {
                    booleanPar( event.message, "可生成资源", par1 => {
                        sendFeedback( `创造模式玩家破坏方块的权限已更改为${par1}` );
                        methods.settings.creativePlayerCanBreakBlocks = par1
                    } )
                }
                break;
        }

    } else {
        sendFeedback( `§c检测到不允许的设置项。允许的设置项包括：\n${acceptableIds.join("\n")}` )
    }
}
