// *-*-*-*-*-*-* 库函数 *-*-*-*-*-*-*
// 在库函数中实现原版相关功能，并在其他文件中调用。

// ===== 导入部分 =====

import * as minecraft from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

// ===== 世界 =====

/** 结构操作方法 */
export class StructureUtil {

    /** 放置结构（支持异步）
     * @param {string} structure 结构名
     * @param {"overworld" | "nether" | "the_end"} dimensionId 维度 ID
     * @param {import("@minecraft/server").Vector3} location 位置
     * @param {import("@minecraft/server").StructurePlaceOptions} options 加载选项
     */
    static placeAsync(structure, dimensionId, location, options) {
        minecraft.world.structureManager.place(structure, minecraft.world.getDimension(dimensionId), location, options);
        let animationSeconds = options?.animationSeconds ? options.animationSeconds : 0;
        return minecraft.system.waitTicks(animationSeconds * 20);
    };

    /** 获取结构
     * @param {string} structureId 结构 ID，包含命名空间
     */
    static get(structureId) {
        return minecraft.world.structureManager.get(structureId);
    };

    /** 获取所有结构名 */
    static getAll() {
        return minecraft.world.structureManager.getWorldStructureIds();
    };

    /** 移除结构
     * @param {string} structureId 结构 ID，包含命名空间
     */
    static remove(structureId) {
        let executed = true;
        try { minecraft.world.structureManager.delete(structureId); } catch { executed = false; }
        return executed;
    };

    /** 移除所有结构 */
    static removeAll() {
        this.getAll().forEach(id => this.remove(id));
    };

};

// ===== 维度 =====

/** 维度操作方法 */
export class DimensionUtil {

    /** 令两个坐标间填充方块
     * @param {"overworld" | "nether" | "the_end"} dimensionId 维度 ID
     * @param {import("@minecraft/server").Vector3} from 起始坐标
     * @param {import("@minecraft/server").Vector3} to 终止坐标
     * @param {string} blockId 方块 ID
     */
    static fillBlock(dimensionId, from, to, blockId) {
        const volume = new minecraft.BlockVolume(from, to);
        minecraft.world.getDimension(dimensionId).fillBlocks(volume, blockId);
    };

    /** 令两个坐标间填充方块
     * @param {"overworld" | "nether" | "the_end"} dimensionId 维度 ID
     * @param {import("@minecraft/server").Vector3} from 起始坐标
     * @param {import("@minecraft/server").Vector3} to 终止坐标
     * @param {string[]} replaceBlockIds 待替换的方块 ID
     * @param {string} toBlockId 待替换的方块 ID
     */
    static replaceBlock(dimensionId, from, to, replaceBlockIds, toBlockId) {
        const volume = new minecraft.BlockVolume(from, to);
        minecraft.world.getDimension(dimensionId).fillBlocks(volume, toBlockId, { blockFilter: { includeTypes: replaceBlockIds } })
    };

    /** 在某个位置放置方块
     * @param {"overworld" | "nether" | "the_end"} dimensionId 维度 ID
     * @param {import("@minecraft/server").Vector3} location 起始坐标
     * @param {string} blockId 待替换的方块 ID
     */
    static setBlock(dimensionId, location, blockId) {
        minecraft.world.getDimension(dimensionId).setBlockType(location, blockId);
        return minecraft.world.getDimension(dimensionId).getBlock(location);
    };

    /** 获取和方块交互后，实际放置的方块位置
     * @description 专门适用于interactWithBlock前事件
     * @param {minecraft.Block} interactedBlock 
     * @param {minecraft.Direction} interactedBlockFace 
     */
    static getPlaceLocation(interactedBlock, interactedBlockFace) {
        const blockLocation = interactedBlock.location;
        switch (interactedBlockFace) {
            case "Up": return Vector3Util.add(blockLocation, 0, 1, 0);
            case "Down": return Vector3Util.add(blockLocation, 0, -1, 0);
            case "North": return Vector3Util.add(blockLocation, 0, 0, -1);
            case "South": return Vector3Util.add(blockLocation, 0, 0, 1);
            case "West": return Vector3Util.add(blockLocation, -1, 0, 0);
            case "East": return Vector3Util.add(blockLocation, 1, 0, 0);
            default: return blockLocation;
        };
    };

};

// ===== 坐标 =====

/** Vector2 的操作方法 */
export class Vector2Util {

    /** 返回两个坐标是否相同
     * @param {import("@minecraft/server").Vector2} pos1 坐标1
     * @param {import("@minecraft/server").Vector2} pos2 坐标2
     */
    static isEqual(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    };

}

/** Vector3 的操作方法 */
export class Vector3Util {

    /** 返回复制后的坐标
     * @param {import("@minecraft/server").Vector3} vector 
     * @returns {import("@minecraft/server").Vector3}
     */
    static copy(vector) {
        return { x: vector.x, y: vector.y, z: vector.z };
    };

    /** 将某个轴的坐标添加某个特定的值
     * @param {import("@minecraft/server").Vector3} vector 输入的方向向量
     * @returns {import("@minecraft/server").Vector3}
     */
    static add(vector, xAdder = 0, yAdder = 0, zAdder = 0) {
        return { x: vector.x + xAdder, y: vector.y + yAdder, z: vector.z + zAdder };
    };

    /** 返回将输入坐标中心化（x + 0.5，z + 0.5）的坐标
     * @param {import("@minecraft/server").Vector3} vector 待中心化的坐标
     */
    static center(vector) {
        return this.add(vector, 0.5, 0, 0.5);
    };

    /** 返回两个坐标是否相同
     * @param {import("@minecraft/server").Vector3} pos1 坐标1
     * @param {import("@minecraft/server").Vector3} pos2 坐标2
     */
    static isEqual(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y && pos1.z === pos2.z;
    };

    /** 检查在多个坐标下是否存在特定的坐标
     * @param {import("@minecraft/server").Vector3[]} positions 
     * @param {import("@minecraft/server").Vector3} testPos 
     */
    static hasPosition(positions, testPos) {
        return positions.some(position => this.isEqual(testPos, position));
    };

    /** 返回两个坐标之间的距离
     * @param {import("@minecraft/server").Vector3} pos1 坐标1
     * @param {import("@minecraft/server").Vector3} pos2 坐标2
     */
    static distance(pos1, pos2) {
        const { x: x1, y: y1, z: z1 } = pos1;
        const { x: x2, y: y2, z: z2 } = pos2;
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
    };

    /** 返回向量模长
     * @param {import("@minecraft/server").Vector3} vector3 
     */
    static length(vector3) {
        return Math.sqrt(vector3.x ** 2 + vector3.y ** 2 + vector3.z ** 2);
    };

    /** 返回归一化的向量
     * @param {import("@minecraft/server").Vector3} vector3 
     * @returns {import("@minecraft/server").Vector3}
     */
    static normalize(vector3) {
        return { x: vector3.x / this.length(vector3), y: vector3.y / this.length(vector3), z: vector3.z / this.length(vector3) };
    };

}

// ===== 玩家 & 实体 =====

/** TitleOptions 类型定义
 * @typedef TitleOptions 标题可选项
 * @property {Number} fadeInDuration 淡入时间，默认 10 刻
 * @property {Number} stayDuration 持续时间，默认 70 刻
 * @property {Number} fadeOutDuration 淡出时间，默认 20 刻
 */

/** 默认设置 @type {TitleOptions} */
const defaultTitleOptions = {
    fadeInDuration: 10,
    stayDuration: 70,
    fadeOutDuration: 20
}

/** 实体操作方法 */
export class EntityUtil {

    /** 生成实体
     * @param {string} typeId 
     * @param {import("@minecraft/server").Vector3} location 
     * @param {import("@minecraft/server").SpawnEntityOptions} options 
     * @param {"overworld"|"nether"|"the_end"} dimensionId 待生成的维度
     */
    static add(typeId, location, options, dimensionId = "overworld") {
        return minecraft.world.getDimension(dimensionId).spawnEntity(typeId, location, options);
    };

    /** 获取实体
     * @param {string} typeId 实体 ID
     * @param {"overworld"|"nether"|"the_end"} dimensionId 待检查的维度
     */
    static get(typeId, dimensionId = "overworld") {
        return minecraft.world.getDimension(dimensionId).getEntities({ type: typeId });
    };

    /** 检查实体是否在特定位置周围
     * @param {minecraft.Entity} entity 待检查的实体
     * @param {import("@minecraft/server").Vector3} pos 待检查的坐标
     * @param {number} r 待检查的范围
     * @param {"overworld"|"nether"|"the_end"|"entity_dimension"} dimensionId 待检查的维度，指定为entity_dimension时将在实体自身维度检测
     */
    static isNearby(entity, pos, r, dimensionId = "entity_dimension") {
        if (dimensionId === "entity_dimension") return entity.dimension.getEntities({ location: pos, maxDistance: r }).some(nearbyEntity => nearbyEntity.id === entity.id);
        else return minecraft.world.getDimension(dimensionId).getEntities({ location: pos, maxDistance: r }).some(nearbyEntity => nearbyEntity.id === entity.id);
    };

    /**
     * 检查实体是否在特定长方体区域内
     * @param {minecraft.Entity} entity 待检查的实体
     * @param {minecraft.BlockVolume} volume 方块区域
     * @param {"overworld"|"nether"|"the_end"|"entity_dimension"} dimensionId 待检查的维度，指定为entity_dimension时将在实体自身维度检测
     */
    static isInVolume(entity, volume, dimensionId = "entity_dimension") {
        let from = volume.from;
        let to = volume.to;
        let delta = Vector3Util.add({ x: 0, y: 0, z: 0 }, to.x - from.x, to.y - from.y, to.z - from.z);
        if (dimensionId == "entity_dimension") return entity.dimension.getEntities({ location: from, volume: delta }).some(nearbyEntity => nearbyEntity.id === entity.id);
        else return minecraft.world.getDimension(dimensionId).getEntities({ location: from, volume: delta }).some(nearbyEntity => nearbyEntity.id === entity.id);
    };

    /** 移除其他除玩家之外的实体
     * @param {"overworld"|"nether"|"the_end"} dimensionId 维度 ID
     */
    static removeAll(dimensionId = "overworld") {
        minecraft.world.getDimension(dimensionId).getEntities().filter(entity => entity.typeId != "minecraft:player").forEach(entity => entity.remove());
    };

};

/** 玩家操作方法 */
export class PlayerUtil {

    /** 获取全部玩家 */
    static getAll() {
        return minecraft.world.getAllPlayers();
    };

    /** 获取玩家数目 */
    static getAmount() {
        return minecraft.world.getAllPlayers().length;
    };

    /** 获取离特定位置较接近的玩家
     * @param {import("@minecraft/server").Vector3} pos 
     * @param {number} r 
     * @param {"overworld"|"nether"|"the_end"} [dimension] 
     */
    static getNearby(pos, r, dimension = "overworld") {
        return minecraft.world.getDimension(dimension).getPlayers({ location: pos, maxDistance: r });
    };

    /** 移除玩家的末影箱物品
     * @param {minecraft.Player} player 
     */
    static resetEnderChest(player) {
        for (let i = 0; i < 27; i++) player.runCommand(`replaceitem entity @s slot.enderchest ${i} air`);
    };

    /** 设置标题
     * @param {minecraft.Player} player 待展示标题的玩家
     * @param {(string | import("@minecraft/server").RawMessage)[]} title 标题
     * @param {(string | import("@minecraft/server").RawMessage)[]} subtitle 副标题，默认值""
     * @param {TitleOptions} options 可选项
     */
    static setTitle(player, title, subtitle = "", options = {}) {
        player.onScreenDisplay.setTitle(title, { ...defaultTitleOptions, ...options, subtitle: subtitle });
    };

};

/** 记分板的记分项操作方法 */
export class ScoreboardObjectiveUtil {

    /** 添加一个新的记分项，并返回该记分项
     * @param {string} id 记分项 ID
     * @param {string} [displayName] 记分项显示名称
     */
    static add(id, displayName) {
        try {
            let objective = minecraft.world.scoreboard.addObjective(id, displayName);
            return objective;
        }
        catch (error) {
            return this.get(id);
        }
    };

    /** 获取记分项
     * @param {string} id 记分项 ID
     */
    static get(id) {
        return minecraft.world.scoreboard.getObjective(id);
    };

    /** 获取所有记分项
     * @param {string} id 记分项 ID
     */
    static getAll() {
        return minecraft.world.scoreboard.getObjectives();
    };

    /** 尝试移除一个记分项，并返回是否成功执行
     * @param { minecraft.ScoreboardObjective | string } id 记分项的 ID 。
     */
    static remove(id) {
        try {
            minecraft.world.scoreboard.removeObjective(id);
            return true;
        }
        catch {
            return false;
        }
    };

    /** 移除所有记分项 */
    static removeAll() {
        this.getAll().forEach(obj => this.remove(obj));
    };

    /** 尝试在特定位置显示记分项，并返回上一个在该位置显示的记分项数据
     * @param {minecraft.DisplaySlotId} displaySlot 显示的位置
     * @param {string} id 显示的记分项 ID 。如果为无效记分项则不处理
     * @param {"ascending"|"descending"} order 排列顺序
     */
    static display(displaySlot, id, order = "descending") {

        const objective = this.get(id);
        /** 上一个记分项 */ let lastObjective = minecraft.world.scoreboard.getObjectiveAtDisplaySlot(displaySlot)?.objective;

        // 当待显示的记分项为无效记分项时，返回上一个记分项的信息
        if (objective === undefined) {
            return lastObjective;
        }
        // 否则，显示新的记分项
        else {
            const orderInt = (order === "ascending" ? 0 : 1);
            try {
                return minecraft.world.scoreboard.setObjectiveAtDisplaySlot(displaySlot, { objective: objective, sortOrder: orderInt });
            }
            catch {
                return lastObjective;
            }
        }
    };

    /** 尝试添加并在特定位置显示记分项，并返回该记分项和上一个在该位置显示的记分项数据
     * @param {string} id 记分项 ID
     * @param {minecraft.DisplaySlotId} displaySlot 显示的位置
     * @param {string} [displayName] 记分项显示名称
     * @param {"ascending"|"descending"} order 排列顺序
     */
    static addThenDisplay(id, displaySlot, displayName, order = "descending") {
        let newObjective = this.add(id, displayName);
        let lastDisplayed = this.display(displaySlot, id, order);
        return { newObjective, lastDisplayed };
    };

    /** 尝试隐藏特定显示位置的记分项，并返回上一个在该位置显示的记分项数据
     * @debug 【当心！】仍需测试是否会在无记分项显示时报错
     * @param {minecraft.DisplaySlotId} displaySlot 
     */
    static hide(displaySlot) {
        return minecraft.world.scoreboard.clearObjectiveAtDisplaySlot(displaySlot);
    };

};

/** 记分板的玩家操作方法 */
export class ScoreboardPlayerUtil {

    /** 为追踪对象添加分数
     * @param {string} objectiveId 
     * @param {minecraft.Entity|minecraft.ScoreboardIdentity|string} participant 
     * @param {number} score 
     */
    static add(objectiveId, participant, score) {
        return ScoreboardObjectiveUtil.get(objectiveId).addScore(participant, score);
    };

    /** 为追踪对象设置分数
     * @param {string} objectiveId 
     * @param {minecraft.Entity|minecraft.ScoreboardIdentity|string} participant 
     * @param {number} score 
     */
    static set(objectiveId, participant, score) {
        ScoreboardObjectiveUtil.get(objectiveId).setScore(participant, score);
        return score;
    };

    /** 为追踪对象设置为布尔值分数，false 输入为 0 分，true 输入为 1 分
     * @param {string} objectiveId 
     * @param {minecraft.Entity|minecraft.ScoreboardIdentity|string} participant 
     * @param {boolean} score 
     */
    static setBoolean(objectiveId, participant, score) {
        let scoreNumber = score ? 1 : 0;
        return this.set(objectiveId, participant, scoreNumber);
    };

    /** 获取追踪对象的分数，若无法获取时则返回 undefined
     * @param {string} objectiveId 
     * @param {minecraft.Entity|minecraft.ScoreboardIdentity|string} participant 
     */
    static get(objectiveId, participant) {
        try {
            return ScoreboardObjectiveUtil.get(objectiveId)?.getScore(participant);
        }
        catch {
            return undefined;
        }
    };

    /** 获取正在追踪追踪对象的记分项
     * @param {string} participantName 追踪对象的名称
     */
    static getObjective(participantName) {
        return ScoreboardObjectiveUtil.getAll().filter(obj => obj.getScores().some(info => info.participant.displayName === participantName));
    };

    /** 获取分数，若获取不到则设置为默认值
     * @param {string} objectiveId 
     * @param {minecraft.Entity|minecraft.ScoreboardIdentity|string} participant 
     * @param {string} defaultScore 
     */
    static getOrSetDefault(objectiveId, participant, defaultScore) {
        let score = this.get(objectiveId, participant);
        if (score === undefined) {
            score = this.set(objectiveId, participant, defaultScore);
        }
        return score;
    };

    /** 移除追踪对象的分数
     * @param {string} objectiveId 
     * @param {minecraft.Entity|minecraft.ScoreboardIdentity|string} participant 
     */
    static remove(objectiveId, participant) {
        return ScoreboardObjectiveUtil.get(objectiveId)?.removeParticipant(participant);
    };

    /** 获取拥有特定分数的玩家
     * @param {string} objectiveId 
     * @param {number} score 
     */
    static getPlayerWithScore(objectiveId, score) {
        ScoreboardObjectiveUtil.get(objectiveId).getParticipants().filter(player => this.get(objectiveId, player) === score);
    };

    /** 获取已离线的玩家
     * @param {string} objectiveId 
     */
    static getOfflinePlayers(objectiveId) {
        return ScoreboardObjectiveUtil.get(objectiveId)?.getParticipants().filter(player => {
            if (player.type !== "Player") { return false; }
            else { try { player.getEntity() } catch { return true; } return false; }
        })
    };

};

// ===== 物品 =====

/**
 * @typedef EnchantmentInfo 附魔信息
 * @property {number} level 附魔等级（允许输入 0，但它什么也不会做）
 * @property {string} id 附魔 ID
 */

/**
 * @typedef ItemOptions 物品信息可选项
 * @property {number} [amount] 物品数量
 * @property {EnchantmentInfo[]} [enchantments] 物品附魔
 * @property {minecraft.ItemLockMode} [itemLock] 物品锁定
 * @property {string[]} [lore] 物品备注
 * @property {string} [name] 物品名称
 * @property {string[]} [canPlaceOn] 物品可放置于何方块上
 * @property {string[]} [canDestroy] 物品可破坏何方块
 * @property {boolean} [keepOnDeath] 物品是否在玩家死亡后保留
 */

/** 物品操作方法 */
export class ItemUtil {

    /** 按照给定条件生成 ItemStacks
     * @param {String} itemId 物品 ID
     * @param {ItemOptions} options 物品信息可选项
     */
    static getItemStacks(itemId, options = {}) {

        // 解构参数
        let { amount, enchantments, itemLock, lore, name, canPlaceOn, canDestroy, keepOnDeath } = options;

        // 如果未指定数量，则设置一个物品数量默认值
        if (!amount) amount = 1;

        /** @type {minecraft.ItemStack[]} */
        let itemStacks = [];

        // 按组进行计算
        while (amount > 0) {

            // 检查要添加的物品的数量最大值，防止数值溢出
            const maxStackSize = new minecraft.ItemStack(itemId).maxAmount;
            const thisStackSize = amount > maxStackSize ? maxStackSize : amount;
            amount = amount - maxStackSize;

            // 基础物品堆叠
            const itemStack = new minecraft.ItemStack(itemId, thisStackSize);

            // 添加附魔
            if (enchantments) enchantments.forEach(enchantment => this.addEnchantment(itemStack, enchantment));

            // 添加物品锁定
            if (itemLock) itemStack.lockMode = itemLock;

            // 添加物品备注
            if (lore) itemStack.setLore(lore);

            // 添加物品名称
            if (name) itemStack.nameTag = name;

            // 添加物品可放置
            if (canPlaceOn) itemStack.setCanPlaceOn(canPlaceOn);

            // 添加物品可破坏
            if (canDestroy) itemStack.setCanDestroy(canDestroy);

            // 添加物品死亡不掉落
            if (keepOnDeath) itemStack.keepOnDeath = keepOnDeath;

            itemStacks.push(itemStack);

        }

        /** 输出 ItemStack */ return itemStacks;
    };

    /** 在特定位置生成物品掉落物
     * @param {import("@minecraft/server").Vector3} location 生成位置
     * @param {string} itemId 物品 ID
     * @param {ItemOptions} options 物品信息可选项
     * @param {boolean} clearVelocity 是否清除物品生成时的向量
     * @param {"overworld"|"nether"|"the_end"} dimensionId 在何维度下生成
     */
    static spawnItem(location, itemId, options = {}, clearVelocity = false, dimensionId = "overworld") {
        this.getItemStacks(itemId, options).forEach(itemStack => {
            if (clearVelocity) minecraft.world.getDimension(dimensionId).spawnItem(itemStack, location).clearVelocity();
            else minecraft.world.getDimension(dimensionId).spawnItem(itemStack, location);
        });
    };

    /** 给予玩家物品，多出的物品将会溢出生成掉落物
     * @param {minecraft.Player} player 待给予物品的玩家
     * @param {string} itemId 物品 ID
     * @param {ItemOptions} options 物品信息可选项
     * @param {boolean} playSound 是否播放“啵”的一声音效 
     */
    static giveItem(player, itemId, options = {}, playSound = true) {
        this.getItemStacks(itemId, options).forEach(itemStack => {
            const container = player.getComponent("minecraft:inventory").container;
            if (container.emptySlotsCount > 0) container.addItem(itemStack);
            else minecraft.world.getDimension(player.dimension.id).spawnItem(itemStack, player.location).clearVelocity();
        });
        if (playSound) player.playSound("random.pop", { location: player.location, pitch: JSUtil.randomRange(0.6, 2.2, 2), volume: 0.25 });
    };

    /** 设置玩家装备栏，超出的装备（比如第 2 件）将会忽略
     * @param {minecraft.Player} player 待给予装备的玩家
     * @param {string} itemId 物品 ID
     * @param {minecraft.EquipmentSlot} slot 装备槽
     * @param {ItemOptions} options 物品信息可选项
     */
    static replaceEquipmentItem(player, itemId, slot, options = {}) {
        player.getComponent("minecraft:equippable").setEquipment(slot, this.getItemStacks(itemId, options)[0]);
    };

    /** 设置实体物品栏特定位置的物品，超出的物品（比如第 2 件）将会忽略
     * @param {minecraft.Entity} entity 待设置物品的实体
     * @param {string} itemId 物品 ID
     * @param {number} slot 槽位位置
     * @param {ItemOptions} options 物品信息可选项
     */
    static replaceInventoryItem(entity, itemId, slot, options = {}) {
        entity.getComponent("minecraft:inventory").container.setItem(slot, this.getItemStacks(itemId, options)[0]);
    };

    /** 清除物品
     * @param {minecraft.Player} player 待清除物品的实体
     * @param {string} itemId 待清除物品的 ID
     * @param {string | number} data
     * @param {string | number} maxCount
     */
    static removeItem(player, itemId = "", data = "", maxCount = "") {
        player.runCommand(`clear @s ${itemId} ${data} ${maxCount}`);
    };

    /** 清除物品实体
     * @param {string} itemId 
     * @param {"overworld"|"nether"|"the_end"} dimension
     */
    static removeItemEntity(itemId, dimension = "overworld") {
        minecraft.world.getDimension(dimension).getEntities({ type: "minecraft:item" }).filter(item => item.getComponent("minecraft:item").itemStack.typeId === itemId).forEach(item => { item.remove() });
    };

    /** 尝试为物品添加附魔，无法添加的附魔将不会添加
     * @param {minecraft.ItemStack} item 
     * @param {EnchantmentInfo} enchantment 
     */
    static addEnchantment(item, enchantment) {
        // 如果附魔等级为小于等于 0 级，终止运行
        if (enchantment.level <= 0) return item;
        const comp = item.getComponent("minecraft:enchantable");
        // 如果无法附魔，终止运行
        if (!comp) return item;
        const enchantmentData = { type: new minecraft.EnchantmentType(enchantment.id), level: enchantment.level};
        // 如果附魔不能添加，终止运行
        if (!comp.canAddEnchantment(enchantmentData)) return item;
        comp.addEnchantment(enchantmentData);
        return item;
    };

};

/** 物品栏操作方法 */
export class InventoryUtil {

    /** 获取实体物品栏
     * @param {minecraft.Entity} entity 待获取实体
     */
    static getInventory(entity) {
        const inventory = entity.getComponent("minecraft:inventory");
        return inventory;
    };

    /** 获取实体物品栏内的第 index 位物品
     * @remark 获取到的 item 可能是 undefined
     * @param {minecraft.Entity} entity 待获取物品栏物品的实体
     * @param {number} index 物品栏的第 index 位物品
     */
    static getItem(entity, index) {
        const inventory = this.getInventory(entity);
        return inventory.container.getItem(index);
    };

    /** 获取实体物品栏内的全部物品及对应槽位
     * @remark 获取到的 item 可能是 undefined
     * @param {minecraft.Entity} entity 待获取物品栏物品的实体
     */
    static getItems(entity) {
        const inventory = this.getInventory(entity);
        let inventoryItems = [];
        for (let i = 0; i < inventory.inventorySize; i++) {
            inventoryItems.push({ item: inventory.container.getItem(i), slot: i });
        }
        return inventoryItems;
    };

    /** 获取实体物品栏内的有效物品及对应槽位
     * @param {minecraft.Entity} entity 待获取物品栏物品的实体
     * @returns {{item: minecraft.ItemStack, slot: number}[]}
     */
    static getValidItems(entity) {
        return this.getItems(entity).filter(itemInfo => itemInfo.item !== undefined);
    };

    /** 获取实体物品栏内的全部槽位
     * @param {minecraft.Entity} entity 待获取物品栏物品的实体
     */
    static getSlots(entity) {
        const inventory = this.getInventory(entity);
        let inventoryItems = [];
        for (let i = 0; i < inventory.inventorySize; i++) {
            inventoryItems.push({ slotContainer: inventory.container.getSlot(i), slot: i });
        }
        return inventoryItems;
    };

    /** 获取实体物品栏的某个特定槽位
     * @param {minecraft.Entity} entity 待获取物品栏物品的实体
     * @param {number} slot 物品栏槽位编号
     */
    static getSlot(entity, slot) {
        const inventory = this.getInventory(entity);
        return inventory.container.getSlot(slot);
    };

    /** 获取实体物品栏的某个槽位是否为特定物品
     * @param {minecraft.Entity} entity 待获取物品栏物品的实体
     * @param {number} slot 物品栏槽位编号
     * @param {string} itemId 待检查的物品 ID
     * @param {number} [amount] 待检查的物品数目
     */
    static slotIsItem(entity, slot, itemId, amount) {
        const slotItem = this.getItem(entity, slot);
        const isItem = slotItem?.typeId === itemId;
        const isAmount = slotItem?.amount === amount;
        if (!amount) return isItem;
        else return isItem && isAmount;
    };

    /** 获取实体物品栏内的有效物品及对应槽位
     * @param {minecraft.Entity} entity 待获取物品栏物品的实体
     */
    static getValidSlots(entity) {
        return this.getSlots(entity).filter(slotInfo => slotInfo.slotContainer.hasItem());
    };

    /** 将物品栏内的所有物品都设置锁定状态
     * @param {minecraft.Entity} entity 待锁定物品栏物品的实体
     * @param {minecraft.ItemLockMode} mode 锁定模式
     */
    static lockAllItems(entity, mode) {
        this.getValidSlots(entity).forEach(itemData => {
            itemData.slotContainer.lockMode = mode;
        });
    };

    /** 获取实体是否拥有物品
     * @param {minecraft.Entity} entity 待检测实体
     * @param {string} itemId 物品 ID
     * @param {number|string} [quantity] 待检测物品的数量，可写为范围式
     * @param {string} [location] 待检测物品的槽位
     * @param {number|string} [slot] 待检测物品的槽位位置，可写为范围式
     * @param {number} [data] 待检测物品的数据值
     */
    static hasItem(entity, itemId, quantity, location, slot, data) {
        let quantityStr = quantity ? `,quantity=${quantity}` : ``;
        let locationStr = location ? `,location=${location}` : ``;
        let slotStr = slot ? `,slot=${slot}` : ``;
        let dataStr = data ? `,data=${data}` : ``;
        // 检测物品
        return entity.runCommand(`execute if entity @s[hasitem={item=${itemId}${quantityStr}${locationStr}${slotStr}${dataStr} }]`).successCount !== 0;
    };

    /** 获取物品数目 
     * @param {minecraft.Entity} entity 待获取物品数目的实体
     * @param {string} itemId 待获取物品数目的物品
     */
    static hasItemAmount(entity, itemId) {
        let itemAmount = 0;
        this.getValidItems(entity).filter(itemInfo => itemInfo.item.typeId === itemId).forEach(itemInfo => itemAmount += itemInfo.item.amount);
        return itemAmount;
    };

};

// ===== UI =====

/**
 * @typedef actionButtons ActionFormUI 的按钮信息
 * @property {string} text 按钮文本描述
 * @property {string} [iconPath] 按钮图标路径（路径应当从资源包的textures/文件夹开始且不带后缀）
 * @property {function(): void} [function] 选择该按钮后执行的函数
 */

/**
 * @typedef messageButtons MessageFormUI 的按钮信息
 * @property {string} text 按钮文本描述
 * @property {function(): void} [function] 选择该按钮后执行的函数
 */

/**
 * @typedef dropdownButton ModalFormUI 的下拉按钮信息
 * @property {"dropdown"} type 按钮类型
 * @property {import("@minecraft/server").RawMessage|string} label 按钮功能描述
 * @property {(import("@minecraft/server").RawMessage|string)[]} options 下拉选项
 * @property {number} [defaultValue] 默认索引
 */

/**
 * @typedef sliderButton ModalFormUI 的滑块按钮信息
 * @property {"slider"} type 按钮类型
 * @property {import("@minecraft/server").RawMessage|string} label 按钮功能描述
 * @property {number} min 最小值
 * @property {number} max 最大值
 * @property {number} step 步长
 * @property {number} [defaultValue] 默认值
 */

/**
 * @typedef textFieldButton ModalFormUI 的文本输入按钮信息
 * @property {"textField"} type 按钮类型
 * @property {import("@minecraft/server").RawMessage|string} label 按钮功能描述
 * @property {import("@minecraft/server").RawMessage|string} placeholder 文本框内描述
 * @property {string} [defaultValue] 默认值
 */

/**
 * @typedef toggleButton ModalFormUI 的开关按钮信息
 * @property {"toggle"} type 按钮类型
 * @property {import("@minecraft/server").RawMessage|string} label 按钮功能描述
 * @property {boolean} [defaultValue] 默认值
 */

export class UIUtil {

    /** 添加一个 ActionFormUI
     * @param {actionButtons[]} buttons 按钮信息
     * @param {string|import("@minecraft/server").RawMessage} body UI 内容
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     */
    addAction(buttons, body = "", title = "") {
        let actionUi = new ui.ActionFormData().body(body).title(title);
        buttons.forEach(button => { actionUi.button(button.text, button.iconPath); })
        return actionUi;
    };

    /** 展示一个 ActionFormUI，返回是否成功显示了 UI
     * @param {ui.ActionFormData} actionUi 待显示的 UI
     * @param {minecraft.Player} player 向哪个玩家显示 UI
     * @param {function(ui.FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {function(number): void} selectedFn 若 UI 操作被选择执行的函数（参数 1：按钮索引）
     */
    showAction(actionUi, player, canceledFn, selectedFn) {
        let executed = true;
        actionUi
            .show(player)
            .then(response => {
                if (response.canceled) { canceledFn(response.cancelationReason); }
                else { selectedFn(response.selection); }
            })
            .catch(() => { executed = false; });
        return executed;
    };

    /** 添加并立即展示一个 ActionFormUI，返回是否成功显示了 UI
     * @param {actionButtons[]} buttons 按钮信息
     * @param {minecraft.Player} player 向哪个玩家显示 UI
     * @param {function(ui.FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {string|import("@minecraft/server").RawMessage} body UI 内容
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     */
    addThenShowAction(buttons, player, canceledFn, body = "", title = "") {
        let actionUi = this.addAction(buttons, body, title);
        return this.showAction(actionUi, player, canceledFn, selectedIndex => { buttons[selectedIndex]?.function; });
    };

    /** 添加一个 MessageFormUI
     * @param {messageButtons[]} buttons 按钮信息（注：buttons 内应有两个按钮信息）
     * @param {string|import("@minecraft/server").RawMessage} body UI 内容
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     */
    addMessage(buttons, body = "", title = "") {
        let messageUi = new ui.MessageFormData().body(body).title(title);
        messageUi.button1(buttons[0].text).button2(buttons[1].text);
        return messageUi;
    };

    /** 展示一个 MessageFormUI，返回是否成功显示了 UI
     * @param {ui.MessageFormData} messageUi 待显示的 UI
     * @param {minecraft.Player} player 向哪个玩家显示 UI
     * @param {function(ui.FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {function(number): void} selectedFn 若 UI 操作被选择执行的函数（参数 1：按钮索引）
     */
    showMessage(messageUi, player, canceledFn, selectedFn) {
        this.showAction(messageUi, player, canceledFn, selectedFn);
    };

    /** 添加并立即展示一个 MessageFormUI，返回是否成功显示了 UI
     * @param {messageButtons[]} buttons 按钮信息（注：buttons 内应有两个按钮信息）
     * @param {minecraft.Player} player 向哪个玩家显示 UI
     * @param {function(ui.FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {string|import("@minecraft/server").RawMessage} body UI 内容
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     */
    addThenShowMessage(buttons, player, canceledFn, body = "", title = "") {
        let messageUi = this.addMessage(buttons, body, title);
        return this.showMessage(messageUi, player, canceledFn, selectedIndex => { buttons[selectedIndex]?.function; });
    };

    /** 添加一个 ModalFormUI
     * @param {(dropdownButton|sliderButton|textFieldButton|toggleButton)[]} buttons 
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     * @param {string|import("@minecraft/server").RawMessage} submit 提交按钮内容
     */
    addModal(buttons, title = "", submit = "提交") {
        let modalUi = new ui.ModalFormData().title(title).submitButton(submit);
        buttons.forEach(button => {
            if (button.type === "dropdown") { modalUi.dropdown(button.label, button.options, button.defaultValue); }
            else if (button.type === "slider") { modalUi.slider(button.label, button.min, button.max, button.step, button.defaultValue); }
            else if (button.type === "textField") { modalUi.textField(button.label, button.placeholder, button.defaultValue); }
            else if (button.type === "toggle") { modalUi.toggle(button.label, button.defaultValue); }
        });
        return modalUi;
    };

    /** 展示一个 ModalFormUI，返回是否成功显示了 UI
     * @param {ui.ModalFormData} modalUi 待显示的 UI
     * @param {minecraft.Player} player 向哪个玩家显示 UI
     * @param {function(ui.FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {function((string|number|boolean)[]): void} submittedFn 若 UI 操作被选择执行的函数（参数 1：按钮返回值）
     */
    showModal(modalUi, player, canceledFn, submittedFn) {
        let executed = true;
        modalUi
            .show(player)
            .then(response => {
                if (response.canceled) { canceledFn(response.cancelationReason); }
                else { submittedFn(response.formValues); }
            })
            .catch(() => { executed = false; });
        return executed;
    };

    /** 添加并立即展示一个 ModalFormUI，返回是否成功显示了 UI
     * @param {(dropdownButton|sliderButton|textFieldButton|toggleButton)[]} buttons 
     * @param {minecraft.Player} player 向哪个玩家显示 UI
     * @param {function(ui.FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {function((string|number|boolean)[]): void} submittedFn 若 UI 操作被选择执行的函数（参数 1：按钮返回值）
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     * @param {string|import("@minecraft/server").RawMessage} submit 提交按钮内容
     */
    addThenShowModal(buttons, player, canceledFn, submittedFn, title = "", submit = "提交") {
        let modalUi = this.addModal(buttons, title, submit);
        return this.showModal(modalUi, player, canceledFn, submittedData => { submittedFn(submittedData) })
    };

    /** 关闭所有 UI（目前暂无法使用）
     * @param {minecraft.Player} player 
     */
    close(player) {

    };

};

// ===== js 基本方法 =====

export class JSUtil {

    /** 在[a, b]取随机整数
     * @param {number} min 最小值
     * @param {number} max 最大值
     */
    static randomInt(min, max) {
        // 确保 min <= max
        if (min > max) { [min, max] = [max, min]; }
        return Math.floor(Math.random() * (max - min + 1)) + min;    // 生成 [min, max] 之间的随机整数
    };

    /** 在[a, b]取随机数（可以是浮点数）
     * @param {number} min 下限
     * @param {number} max 上限
     * @param {number} [precision] 保留小数位数（可选，不指定则原样返回）
     * @returns {number} [a, b] 内的随机数
     * @throws {Error} 若 a > b
     */
    static randomRange(min, max, precision) {
        const raw = Math.random() * (max - min) + min;
        return precision ? raw : Number(raw.toFixed(precision));
    };

    /** 将数值限制到[a, b]内
     * @param {number} value 
     * @param {number} min 
     * @param {number} max 
     */
    static clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    };

    /** 将数字转换为罗马数字的字符串
     * @param {Number} num 待转换数字
     */
    static intToRoman(num) {
        if (num <= 0) { return ""; }
        const romanNumerals = [
            // { value: 1000, symbol: 'M' },
            // { value: 900, symbol: 'CM' },
            // { value: 500, symbol: 'D' },
            // { value: 400, symbol: 'CD' },
            // { value: 100, symbol: 'C' },
            // { value: 90, symbol: 'XC' },
            // { value: 50, symbol: 'L' },
            // { value: 40, symbol: 'XL' },
            { value: 10, symbol: 'X' },
            { value: 9, symbol: 'IX' },
            { value: 5, symbol: 'V' },
            { value: 4, symbol: 'IV' },
            { value: 1, symbol: 'I' }
        ];
        let result = '';
        for (const { value, symbol } of romanNumerals) {
            while (num >= value) { result += symbol; num -= value; }
        }
        return result;
    };

    /** 在输入的对象中，输出值所对应的键
     * @remark 如果对象所有的值中有重复的，那么会返回第一个对应的键
     * @param {object} obj 输入的对象
     * @param {*} value 待寻找的对应值
     */
    static getKeyByValue(obj, value) {
        for (const [key, val] of Object.entries(obj)) {
            if (val === value) {
                return key;
            }
        }
        return void 0;
    };

    /** 打乱一个数组
     * @param {Array} array
     */
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            /** 生成一个随机索引 j */ const j = Math.floor(Math.random() * (i + 1));
            /** 交换元素 array[i] 和 array[j] */[array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    /** 判断传入的对象是否为空对象
     * @param {object} obj
     */
    static isEmptyObject(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    /** 删除数组的特定元素
     * @param {Array} array 待删除元素的数组
     * @param {*} element 待删除的元素
     */
    static removeElementOfArray(array, element) {
        // 使用循环和splice方法删除所有匹配的元素
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i] === element) {
                array.splice(i, 1);
            }
        }
    };

    /** 判断一个数组有多少组x个相同的数字
     * @description 例：countSameNumbers([1,1,1,2,3],3) => 1；countSameNumbers([1,1,2,2,3],2) => 2
     * @param {any[]} array 
     * @param {number} x 
     */
    static countSameNumbers(array, x) {
        let map = new Map();
        array.forEach(num => { map.set(num, (map.get(num) || 0) + 1); }); // 统计每个数字出现的次数
        let count = 0;
        map.forEach((value, key) => { if (value === x) { count++; } }); // 遍历 map，找出有多少组 x 个相同的数字
        return count;
    };

    /**
     * @typedef TimeInfo 时间信息
     * @property {number} [minute] 待输出的分钟数
     * @property {number} second 待输出的秒钟数
     * @property {number} [tick] 待输出的游戏刻数
     */
    /** 按照给定的时间值输出合适格式的时间字符串（例如 15:34.75）
     * @param {TimeInfo} time 输入的时间信息
     * @param {"ShowSecondsAndMilliseconds"|"ShowMinutesAndSeconds"|"ShowAll"} mode 输出模式，默认为 ShowMinutesAndSeconds
     */
    static timeToString(time, mode = "ShowMinutesAndSeconds") {

        /** 时间值 */
        const { minute, second, tick } = time;

        /** 秒数字符串，如果为 < 10 的数则显示为 0x（例如 15:03 而非 15:3） */
        const secondString = second < 10 ? `0${second}` : `${second}`;

        if (mode === "ShowAll") return `${minute}:${secondString}.${tick * 5}`;
        else if (mode === "ShowSecondsAndMilliseconds") return `${secondString}.${tick * 5}`;
        else return `${minute}:${secondString}`;
    };

    /** 将单位为游戏刻的时间转换为以秒为单位的时间
     * @param {number} tickTime 游戏刻时间
     * @param {"int"|"float"} returnType 返回类型
     */
    static tickToSecond(tickTime, returnType = "int") {
        if (returnType === "int") return Math.floor(tick / 20);
        else return parseFloat((tickTime / 20).toFixed(2));
    };

    /** 将单位为秒的时间转换为以分钟和秒钟为单位的时间
     * @param {Number} secondTime 秒数时间
     */
    static secondToMinute(secondTime) {
        /** @type {TimeInfo} */
        let timeInfo = {
            minute: Math.floor(secondTime / 60),
            second: secondTime % 60,
        }
        return timeInfo;
    };

}

// ===== 调试方法 =====

export class Debug {

    /** 发送一个调试性消息
     * @param {any} message 待返回的消息
     */
    static sendMessage(message) {
        minecraft.world.sendMessage(`${message}`)
    };

    /** 打印数组
     * @param {Array} array 待打印数组
     * @param {string} arrayName 待打印数组的名称
     */
    static printArray(array, arrayName) {
        minecraft.world.sendMessage(`§a${arrayName} = §r§f[§b${array.join(", ")}§r§f]`)
    };

    /** 打印对象
     * @param {object} object 待打印的对象
     * @param {"chat"|"actionbar"} mode 打印的位置，chat=聊天栏，actionbar=快捷栏标题
     * @param {boolean} hasFunction 是否打印对象内部方法
     */
    static printObject(object, mode = "chat", hasFunction = true) {

        /** 待打印的字符串数组 @type {string[]} */ let printString = [];
        // 设置打印的字符串
        if (object == undefined) {
            printString = [`<§6undefined§f>`];
        }
        else {
            printString.push(`<§6Object ${object.constructor.name}`);
            // 遍历对象中的每个对象
            for (let key in object) {
                let value = object[key]
                let valueName = `§b${value}`; // 如果是普通类型，蓝色，原样显示
                if (value instanceof Function) { // 如果是函数类型，黄色，显示为() => {}
                    if (!hasFunction) continue;
                    valueName = `§e() => {}`;
                }
                else if (value instanceof Object) { // 如果是对象类型，显示为构建器类型
                    valueName = `§6<Object ${value.constructor.name}>`;
                }
                printString.push(`    §a${key} : ${valueName}`);
            }
            printString.push(`§r>`)
        }
        // 打印模式
        if (mode === "chat") {
            minecraft.world.sendMessage(printString.join("\n"));
        }
        else {
            minecraft.world.getAllPlayers().forEach(player => {
                player.onScreenDisplay.setActionBar(printString.join("\n"));
            });
        }

    };

};
