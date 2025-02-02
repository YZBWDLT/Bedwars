/**
 * ===== 物品管理器 =====
 * 基于原版 SAPI 扩展的物品功能。
 */

import { ContainerSlot, EnchantmentType, Entity, EquipmentSlot, ItemStack, Player } from "@minecraft/server";
import { overworld, Vector } from "./positionManager";

/**
 * @typedef enchantment 附魔信息
 * @property {Number} level 附魔等级（允许输入 0，但它什么也不会做）
 * @property {String} id 附魔 ID
 */

/**
 * @typedef itemOptions 物品信息可选项
 * @property {Number} amount 物品数量
 * @property {enchantment[]} enchantments 物品附魔
 * @property {"none"|"inventory"|"slot"} itemLock 物品锁定
 * @property {String[]} lore 物品备注
 * @property {String} name 物品名称
 * @property {Boolean} clearVelocity （仅在生成物品实体时使用）是否清除物品生成时的向量
 */

/** 默认物品信息可选项设置 @type {itemOptions} */
const defaultOptions = { amount: 1, enchantments: [], itemLock: "none", lore: [], name: "", clearVelocity: false };

/** 按照给定条件生成一个 ItemStack
 * @param {String} itemId 物品 ID
 * @param {itemOptions} options 物品信息可选项
 */
function generateItemStack( itemId, options={} ) {

    /** 可选项设置 */
    const allOptions = { ...defaultOptions, ...options }

    /** 新建物品 */
    let item = new ItemStack( itemId, allOptions.amount );

    /** 附魔设定 */
    if ( allOptions.enchantments.length !== 0 ) {
        allOptions.enchantments.filter( enchantment => enchantment.level > 0 ).forEach( enchantment => {
            item.getComponent( "minecraft:enchantable" ).addEnchantment( { type: new EnchantmentType( enchantment.id ), level: enchantment.level } )
        } )
    }

    /** 物品锁定设定 */
    item.lockMode = allOptions.itemLock;

    /** 物品备注设定 */
    item.setLore( allOptions.lore );

    /** 物品名称设定 */
    if ( allOptions.name !== "" ) { item.nameTag = allOptions.name }

    /** 输出 ItemStack */
    return item;

}

/** 在特定位置生成物品
 * @param {Vector} pos 生成位置
 * @param {String} itemId 物品 ID
 * @param {itemOptions} options 物品信息可选项
 */
export function spawnItem( pos, itemId, options={} ) {

    /** 可选项设置 */
    const allOptions = { ...defaultOptions, ...options };

    /** 获取 ItemStack */
    let item = generateItemStack( itemId, allOptions );

    /** 物品生成 */
    if ( allOptions.clearVelocity ) { overworld.spawnItem( item, pos ).clearVelocity( ) } else { overworld.spawnItem( item, pos ) }

}

/** 给予玩家物品
 * @param {Player} player 待给予物品的玩家
 * @param {String} itemId 物品 ID
 * @param {itemOptions} options 物品信息可选项
 */
export function giveItem( player, itemId, options={} ) {

    /** 可选项设置 */
    const allOptions = { ...defaultOptions, ...options };

    /** 获取 ItemStack */
    let item = generateItemStack( itemId, allOptions );

    /** 物品给予 */
    player.getComponent( "minecraft:inventory" ).container.addItem( item )

}

/** 设置玩家装备栏
 * @param {Player} player 待给予装备的玩家
 * @param {String} itemId 物品 ID
 * @param {EquipmentSlot} slot 装备槽
 * @param {itemOptions} options 物品信息可选项
 */
export function replaceEquipmentItem( player, itemId, slot, options={} ) {

    /** 可选项设置 */
    const allOptions = { ...defaultOptions, ...options };

    /** 获取 ItemStack */
    let item = generateItemStack( itemId, allOptions );
    
    /** 物品设置 */
    player.getComponent( "minecraft:equippable" ).setEquipment( slot, item )
    
}

/** 设置实体物品栏特定位置的物品
 * @param {Entity} entity 待设置物品的实体
 * @param {String} itemId 物品 ID
 * @param {Number} slot 槽位位置
 * @param {itemOptions} options 物品信息可选项
 */
export function replaceInventoryItem( entity, itemId, slot, options={} ) {

    /** 可选项设置 */
    const allOptions = { ...defaultOptions, ...options };

    /** 获取 ItemStack */
    let item = generateItemStack( itemId, allOptions );
    
    /** 物品设置 */
    entity.getComponent( "minecraft:inventory" ).container.setItem( slot, item )

}

/** 清除物品
 * @param {Entity} entity 待清除物品的实体
 * @param {String} itemId 待清除物品的 ID
*/
export function removeItem( entity, itemId, count = 1, data = -1 ) {
    entity.runCommand( `clear @s ${itemId} ${data} ${count}` )
}

/** 清除物品实体
 * @param {String} itemId 
 */
export function removeItemEntity( itemId ) {
    overworld.getEntities( { type: "minecraft:item" } ).filter( item => item.getComponent( "minecraft:item" ).itemStack.typeId === itemId ).forEach( item => { item.remove( ) } );
}

/** ===== 物品栏类 ===== */


/** 获取给定实体全部物品栏的物品
 * @param {Entity} entity 待检测实体
 * @returns { { item: ItemStack|undefined, slot: Number }[] }
 */
function getAllInventoryItems( entity ) {

    /** 待测试实体的物品栏信息 */
    let inventory = entity.getComponent( "minecraft:inventory" ).container;
    let inventorySize = inventory.size;

    /** 获取实体的全部物品栏内物品 */
    let inventoryItems = [];
    for ( let i = 0; i < inventorySize; i++ ) {
        inventoryItems.push( { item: inventory.getItem( i ), slot: i } );
    }

    return inventoryItems;

}

/** 获取给定实体全部物品栏的槽位信息
 * @param {Entity} entity 待检测实体
 * @returns { { slotContainer: ContainerSlot, slot: Number }[] }
 */
function getAllSlots( entity ) {

    /** 待测试实体的物品栏信息 */
    let inventory = entity.getComponent( "minecraft:inventory" ).container;
    let inventorySize = inventory.size;

    /** 获取实体的全部物品栏内物品 */
    let inventoryItems = [];
    for ( let i = 0; i < inventorySize; i++ ) {
        inventoryItems.push( { slotContainer: inventory.getSlot( i ), slot: i } );
    }

    return inventoryItems;

}

/** 获取实体是否拥有物品
 * @description 采用 hasitem 检测
 * @param {Entity} entity 待检测实体
 * @param {String} item 物品 ID
 * @param {{quantity: Number|String, location: String, slot: Number|String, data: Number}} options 可选项
 */
export function hasItem( entity, item, options={} ) {

    /** 获取可选项字符串 */
    let quantity = () => { return options.quantity ? `,quantity=${options.quantity}` : ``; };
    let location = () => { return options.location ? `,location=${options.location}` : ``; };
    let slot = () => { return options.slot ? `,slot=${options.slot}` : ``; };
    let data = () => { return options.data ? `,data=${options.data}` : ``; };

    /** 检测物品 */
    return entity.runCommand( `execute if entity @s[hasitem={item=${item}${quantity()}${location()}${slot()}${data()}}]` ).successCount !== 0;
    
}

/** 令所有物品栏中的有效物品执行某些函数
 * @param {Entity} entity 获取物品栏的实体
 * @param {function(ItemStack, number)} func 对每个物品执行的函数。接受两个参数，参数1：物品栏的物品；参数2：物品所处的槽位ID。
*/
export function eachValidItem( entity, func ) {

    getAllInventoryItems( entity ).filter( itemInfo => itemInfo.item !== undefined ).forEach( itemInfo => { func( itemInfo.item, itemInfo.slot ) } )

}

/** 令所有物品栏中的有效槽位执行某些函数
 * @param {Entity} entity 获取物品栏的实体
 * @param {function(ContainerSlot, number)} func 对每个物品执行的函数。接受两个参数，参数1：槽位；参数2：物品所处的槽位ID。
 */
export function eachValidSlot( entity, func ) {

    getAllSlots( entity ).filter( slotInfo => slotInfo.slotContainer.hasItem() ).forEach( slotInfo => { func( slotInfo.slotContainer, slotInfo.slot ) } )

}

/** 获取实体拥有的特定物品数目
 * @param {Entity} entity 待测试实体
 * @param {String} itemId 物品 ID
 */
export function getItemAmount( entity, itemId ) {

    /** 计算玩家拥有的物品数目 */
    let itemAmount = 0;
    eachValidItem( entity, item => { if ( item.typeId === itemId ) { itemAmount += item.amount } } )
    return itemAmount;

}

/** 用于获取特定物品栏槽位下，特定附魔的等级
 * @param {Player} player - 要检测的玩家
 * @param {Number} slot - 要检测的槽位
 * @param {String} enchantmentId - 要检测的附魔
 * @returns {Number} 当该物品未定义或该物品无特定附魔时，返回 0 ；其余情况，返回附魔等级。
 */
export function getInventoryEnchantmentLevel( player, slot, enchantmentId ) {

    /** 当该物品未定义时，返回 0 */
    if ( !player.getComponent( "minecraft:inventory" ).container.getItem( slot ) ) { return 0; }

    /** 当该物品对应的附魔未定义时，返回 0 */
    else if ( !player.getComponent( "minecraft:inventory" ).container.getItem( slot ).getComponent( "minecraft:enchantable" ).getEnchantment( enchantmentId ) ) { return 0; }

    /** 除此之外的情况（即物品和附魔都有定义），返回对应数值 */
    else { return player.getComponent( "minecraft:inventory" ).container.getItem( slot ).getComponent( "minecraft:enchantable" ).getEnchantment( enchantmentId ).level }

}

/** 用于获取特定装备槽位下，特定附魔的等级
 * @param {Player} player - 要检测的玩家
 * @param {EquipmentSlot} slot - 要检测的槽位
 * @param {String} enchantmentId - 要检测的附魔
 * @returns {Number} 当该物品未定义或该物品无特定附魔时，返回 0 ；其余情况，返回附魔等级。
 */
export function getEquipmentEnchantmentLevel( player, slot, enchantmentId ) {

    /** 当该物品未定义时，返回 0 */
    if ( !player.getComponent( "minecraft:equippable" ).getEquipment( slot ) ) { return 0; }

    /** 当该物品对应的附魔未定义时，返回 0 */
    else if ( !player.getComponent( "minecraft:equippable" ).getEquipment( slot ).getComponent( "minecraft:enchantable" ).getEnchantment( enchantmentId ) ) { return 0; }

    /** 除此之外的情况（即物品和附魔都有定义），返回对应数值 */
    else { return player.getComponent( "minecraft:equippable" ).getEquipment( slot ).getComponent( "minecraft:enchantable" ).getEnchantment( enchantmentId ).level }

}
