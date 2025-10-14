/**
 * 库函数
 */

// ===== 导入部分 =====

import { world, Entity, Player, ItemStack, EnchantmentType, EquipmentSlot, EntityInventoryComponent, ScoreboardObjective, ScoreboardIdentity, DisplaySlotId, BlockVolume, Structure, system } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData, FormCancelationReason } from "@minecraft/server-ui";

// ===== 世界 =====

/** 结构操作方法 */
export const structure = {

    /** 放置结构（支持异步）
     * @param {string} structure 结构名
     * @param {"overworld" | "nether" | "the_end"} dimensionId 维度 ID
     * @param {import("@minecraft/server").Vector3} location 位置
     * @param {import("@minecraft/server").StructurePlaceOptions} options 加载选项
     */
    placeAsync(structure, dimensionId, location, options) {
        world.structureManager.place(structure, world.getDimension(dimensionId), location, options);
        let animationSeconds = options?.animationSeconds ? options.animationSeconds : 0;
        return system.waitTicks(animationSeconds * 20);
    },

    /** 获取结构
     * @param {string} structureId 结构 ID，包含命名空间
     */
    get(structureId) {
        return world.structureManager.get(structureId);
    },

    /** 获取所有结构名 */
    getAll() {
        return world.structureManager.getWorldStructureIds();
    },

    /** 移除结构
     * @param {string} structureId 结构 ID，包含命名空间
     */
    remove(structureId) {
        let executed = true;
        try { world.structureManager.delete(structureId); } catch { executed = false; }
        return executed;
    },

    /** 移除所有结构 */
    removeAll() {
        this.getAll().forEach(id => this.remove(id));
    },

}

// ===== 维度 =====

/** 维度操作方法 */
export const dimension = {

   /** 令两个坐标间填充方块
    * @param {"overworld" | "nether" | "the_end"} dimensionId 维度 ID
    * @param {import("@minecraft/server").Vector3} from 起始坐标
    * @param {import("@minecraft/server").Vector3} to 终止坐标
    * @param {string} blockId 方块 ID
    */
    fillBlock(dimensionId, from, to, blockId) {
        const volume = new BlockVolume(from, to);
        world.getDimension(dimensionId).fillBlocks(volume, blockId)
    },

    /** 令两个坐标间填充方块
     * @param {"overworld" | "nether" | "the_end"} dimensionId 维度 ID
     * @param {import("@minecraft/server").Vector3} from 起始坐标
     * @param {import("@minecraft/server").Vector3} to 终止坐标
     * @param {string[]} replaceBlockIds 待替换的方块 ID
     * @param {string} toBlockId 待替换的方块 ID
     */
    replaceBlock(dimensionId, from, to, replaceBlockIds, toBlockId) {
        const volume = new BlockVolume(from, to);
        world.getDimension(dimensionId).fillBlocks(volume, toBlockId, {blockFilter: {includeTypes: replaceBlockIds}})
    },

}

// ===== 坐标 =====

/** Vector3 的操作方法 */
export const position3 = {

    /** 返回复制后的坐标
     * @param {import("@minecraft/server").Vector3} vector 
     * @returns {import("@minecraft/server").Vector3}
     */
    copy(vector) {
        return { x: vector.x, y: vector.y, z: vector.z };
    },

    /** 将某个轴的坐标添加某个特定的值
     * @param {import("@minecraft/server").Vector3} vector 输入的方向向量
     * @returns {import("@minecraft/server").Vector3}
     */
    add(vector, xAdder = 0, yAdder = 0, zAdder = 0) {
        return { x: vector.x + xAdder, y: vector.y + yAdder, z: vector.z + zAdder };
    },

    /** 返回将输入坐标中心化（x + 0.5，z + 0.5）的坐标
     * @param {import("@minecraft/server").Vector3} vector 待中心化的坐标
     */
    center(vector) {
        return this.add(vector, 0.5, 0, 0.5);
    },

    /** 返回两个坐标是否相同
     * @param {import("@minecraft/server").Vector3} pos1 坐标1
     * @param {import("@minecraft/server").Vector3} pos2 坐标2
     */
    isEqual(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y && pos1.z === pos2.z;
    },

    /** 检查在多个坐标下是否存在特定的坐标
     * @param {import("@minecraft/server").Vector3[]} positions 
     * @param {import("@minecraft/server").Vector3} testPos 
     */
    hasPosition(positions, testPos) {
        return positions.some(position => this.isEqual(testPos, position));
    },

    /** 返回两个坐标之间的距离
     * @param {import("@minecraft/server").Vector3} pos1 坐标1
     * @param {import("@minecraft/server").Vector3} pos2 坐标2
     */
    distance(pos1, pos2) {
        const { x: x1, y: y1, z: z1 } = pos1;
        const { x: x2, y: y2, z: z2 } = pos2;
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
    },

}

// ===== 玩家 & 实体 =====

/** titleOptions 类型定义
 * @typedef titleOptions 标题可选项
 * @property {Number} fadeInDuration 淡入时间，默认 10 刻
 * @property {Number} stayDuration 持续时间，默认 70 刻
 * @property {Number} fadeOutDuration 淡出时间，默认 20 刻
 */

/** 默认设置 @type {titleOptions} */
const defaultTitleOptions = {
    fadeInDuration: 10,
    stayDuration: 70,
    fadeOutDuration: 20
}

/** 实体操作方法 */
export const entity = {

    /** 检查实体是否在特定位置周围
     * @param {Entity} entity 待检查的实体
     * @param {import("@minecraft/server").Vector3} pos 待检查的坐标
     * @param {number} r 待检查的范围
     * @param {"overworld"|"nether"|"the_end"|"entity_dimension"} dimensionId 待检查的维度，指定为entity_dimension时将在实体自身维度检测
     */
    isNearby(entity, pos, r, dimensionId = "entity_dimension") {
        if (dimensionId === "entity_dimension") return entity.dimension.getEntities({location: pos, maxDistance: r}).some(nearbyEntity => nearbyEntity.id === entity.id);
        else return world.getDimension(dimensionId).getEntities({location: pos, maxDistance: r}).some(nearbyEntity => nearbyEntity.id === entity.id);
    },

    /**
     * 检查实体是否在特定长方体区域内
     * @param {Entity} entity 待检查的实体
     * @param {BlockVolume} volume 方块区域
     * @param {"overworld"|"nether"|"the_end"|"entity_dimension"} dimensionId 待检查的维度，指定为entity_dimension时将在实体自身维度检测
     */
    isInVolume(entity, volume, dimensionId = "entity_dimension") {
        let from = volume.from;
        let to = volume.to;
        let delta = position3.add({x: 0, y: 0, z: 0}, to.x - from.x, to.y - from.y, to.z - from.z);
        if (dimensionId == "entity_dimension") return entity.dimension.getEntities({location: from, volume: delta}).some(nearbyEntity => nearbyEntity.id === entity.id);
        else return world.getDimension(dimensionId).getEntities({location: from, volume: delta}).some(nearbyEntity => nearbyEntity.id === entity.id);
    },

    /** 移除其他除玩家之外的实体
     * @param {"overworld"|"nether"|"the_end"} dimensionId 维度 ID
     */
    removeAll(dimensionId = "overworld") {
        world.getDimension(dimensionId).getEntities().filter(entity => entity.typeId != "minecraft:player").forEach(entity => entity.remove());
    },

};

/** 玩家操作方法 */
export const player = {

    /** 获取全部玩家 */
    getAll() {
        return world.getAllPlayers();
    },

    /** 获取玩家数目 */
    getAmount() {
        return world.getAllPlayers().length;
    },

    /** 获取离特定位置较接近的玩家
     * @param {import("@minecraft/server").Vector3} pos 
     * @param {number} r 
     * @param {"overworld"|"nether"|"the_end"} [dimension] 
     */
    getNearby(pos, r, dimension = "overworld") {
        return world.getDimension(dimension).getPlayers({ location: pos, maxDistance: r });
    },

    /** 设置标题
     * @param {Player} player 待展示标题的玩家
     * @param {(string | import("@minecraft/server").RawMessage)[]} title 标题
     * @param {(string | import("@minecraft/server").RawMessage)[]} subtitle 副标题，默认值""
     * @param {titleOptions} options 可选项
     */
    setTitle(player, title, subtitle = "", options = {}) {
        player.onScreenDisplay.setTitle(title, { ...defaultTitleOptions, ...options, subtitle: subtitle });
    },

};

/** 记分板操作方法 */
export const scoreboard = {
    
    /** 记分项操作方法 */
    objective: {

        /** 添加一个新的记分项，并返回该记分项
         * @param {string} id 记分项 ID
         * @param {string} [displayName] 记分项显示名称
         */
        add(id, displayName) {
            try {
                let objective = world.scoreboard.addObjective(id, displayName);
                return objective;
            }
            catch (error) {
                return this.get(id);
            }
        },

        /** 获取记分项
         * @param {string} id 记分项 ID
         */
        get(id) {
            return world.scoreboard.getObjective(id);
        },

        /** 获取所有记分项
         * @param {string} id 记分项 ID
         */
        getAll() {
            return world.scoreboard.getObjectives();
        },

        /** 尝试移除一个记分项，并返回是否成功执行
         * @param { ScoreboardObjective | string } id 记分项的 ID 。
         */
        remove(id) {
            try {
                world.scoreboard.removeObjective(id);
                return true;
            }
            catch {
                return false;
            }
        },

        /** 移除所有记分项 */
        removeAll() {
            this.getAll().forEach(obj => this.remove(obj));
        },

        /** 尝试在特定位置显示记分项，并返回上一个在该位置显示的记分项数据
         * @param {DisplaySlotId} displaySlot 显示的位置
         * @param {string} id 显示的记分项 ID 。如果为无效记分项则不处理
         * @param {"ascending"|"descending"} order 排列顺序
         */
        display(displaySlot, id, order = "descending") {

            const objective = this.get(id);
            /** 上一个记分项 */ let lastObjective = world.scoreboard.getObjectiveAtDisplaySlot(displaySlot)?.objective;

            // 当待显示的记分项为无效记分项时，返回上一个记分项的信息
            if (objective === undefined) {
                return lastObjective;
            }
            // 否则，显示新的记分项
            else {
                const orderInt = (order === "ascending" ? 0 : 1);
                try {
                    return world.scoreboard.setObjectiveAtDisplaySlot(displaySlot, { objective: objective, sortOrder: orderInt });
                }
                catch {
                    return lastObjective;
                }
            }
        },

        /** 尝试添加并在特定位置显示记分项，并返回该记分项和上一个在该位置显示的记分项数据
         * @param {string} id 记分项 ID
         * @param {DisplaySlotId} displaySlot 显示的位置
         * @param {string} [displayName] 记分项显示名称
         * @param {"ascending"|"descending"} order 排列顺序
         */
        addThenDisplay(id, displaySlot, displayName, order = "descending") {
            let newObjective = this.add(id, displayName);
            let lastDisplayed = this.display(displaySlot, id, order);
            return { newObjective, lastDisplayed };
        },

        /** 尝试隐藏特定显示位置的记分项，并返回上一个在该位置显示的记分项数据
         * @danger 【当心！】仍需测试是否会在无记分项显示时报错
         * @param {DisplaySlotId} displaySlot 
         */
        hide(displaySlot) {
            return world.scoreboard.clearObjectiveAtDisplaySlot(displaySlot);
        },

    },
    /** 玩家操作方法 */
    player: {

        /** 为追踪对象添加分数
         * @param {string} objectiveId 
         * @param {Entity|ScoreboardIdentity|string} participant 
         * @param {number} score 
         */
        add(objectiveId, participant, score) {
            return scoreboard.objective.get(objectiveId).addScore(participant, score);
        },

        /** 为追踪对象设置分数
         * @param {string} objectiveId 
         * @param {Entity|ScoreboardIdentity|string} participant 
         * @param {number} score 
         */
        set(objectiveId, participant, score) {
            scoreboard.objective.get(objectiveId).setScore(participant, score);
            return score;
        },

        /** 为追踪对象设置为布尔值分数，false 输入为 0 分，true 输入为 1 分
         * @param {string} objectiveId 
         * @param {Entity|ScoreboardIdentity|string} participant 
         * @param {boolean} score 
         */
        setBoolean(objectiveId, participant, score) {
            let scoreNumber = score ? 1 : 0;
            return this.set(objectiveId, participant, scoreNumber);
        },

        /** 获取追踪对象的分数，若无法获取时则返回 undefined
         * @param {string} objectiveId 
         * @param {Entity|ScoreboardIdentity|string} participant 
         */
        get(objectiveId, participant) {
            try {
                return scoreboard.objective.get(objectiveId)?.getScore(participant);
            }
            catch {
                return undefined;
            }
        },

        /** 获取正在追踪追踪对象的记分项
         * @param {string} participantName 追踪对象的名称
         */
        getObjective(participantName) {
            return scoreboard.objective.getAll().filter( obj => obj.getScores().some( info => info.participant.displayName === participantName ) );
        },

        /** 获取分数，若获取不到则设置为默认值
         * @param {string} objectiveId 
         * @param {Entity|ScoreboardIdentity|string} participant 
         * @param {string} defaultScore 
         */
        getOrSetDefault(objectiveId, participant, defaultScore) {
            let score = this.get(objectiveId, participant);
            if (score === undefined) {
                score = this.set(objectiveId, participant, defaultScore);
            }
            return score;
        },

        /** 移除追踪对象的分数
         * @param {string} objectiveId 
         * @param {Entity|ScoreboardIdentity|string} participant 
         */
        remove(objectiveId, participant) {
            return scoreboard.objective.get(objectiveId)?.removeParticipant(participant);
        },

        /** 获取拥有特定分数的玩家
         * @param {string} objectiveId 
         * @param {number} score 
         */
        getPlayerWithScore(objectiveId, score) {
            scoreboard.objective.get(objectiveId).getParticipants().filter(player => this.get(objectiveId, player) === score);
        },

        /** 获取已离线的玩家
         * @param {string} objectiveId 
         */
        getOfflinePlayers(objectiveId) {
            return scoreboard.objective.get(objectiveId)?.getParticipants().filter(player => {
                if (player.type !== "Player") { return false; }
                else { try { player.getEntity() } catch { return true; } return false; }
            })
        }

    }, 

}

// ===== 物品 =====

/**
 * @typedef enchantment 附魔信息
 * @property {Number} level 附魔等级（允许输入 0，但它什么也不会做）
 * @property {String} id 附魔 ID
 */

/**
 * @typedef itemOptions 物品信息可选项
 * @property {number} amount 物品数量
 * @property {enchantment[]} enchantments 物品附魔
 * @property {"none"|"inventory"|"slot"} itemLock 物品锁定
 * @property {string[]} lore 物品备注
 * @property {string} name 物品名称
 * @property {string[]} canPlaceOn 物品可放置于何方块上
 * @property {string[]} canDestroy 物品可破坏何方块
 * @property {boolean} keepOnDeath 物品是否在玩家死亡后保留
 * @property {boolean} clearVelocity （仅在生成物品实体时使用）是否清除物品生成时的向量
 * @property {"overworld"|"nether"|"the_end"} dimension （仅在生成物品实体时使用）在何维度下生成
 */

/** 默认物品信息可选项设置 @type {itemOptions} */
const defaultItemOptions = {
    amount: 1,
    enchantments: [],
    itemLock: "none",
    lore: [],
    name: "",
    canPlaceOn: [],
    canDestroy: [],
    keepOnDeath: false,
    clearVelocity: false,
    dimension: "overworld"
};

/** 物品操作方法 */
export const item = {

    /** 按照给定条件生成一个 ItemStack
     * @param {String} itemId 物品 ID
     * @param {itemOptions} options 物品信息可选项
     */
    getItemStack(itemId, options = {}) {
        /** 可选项设置 */ const allOptions = { ...defaultItemOptions, ...options };
        /** 新建物品 */ let item = new ItemStack(itemId, allOptions.amount);
        /** 附魔设定 */
        if (allOptions.enchantments.length !== 0) {
            allOptions.enchantments.filter(enchantment => enchantment.level > 0).forEach(enchantment => {
                item.getComponent("minecraft:enchantable").addEnchantment({ type: new EnchantmentType(enchantment.id), level: enchantment.level })
            })
        }
        /** 物品锁定设定 */ item.lockMode = allOptions.itemLock;
        /** 物品备注设定 */ item.setLore(allOptions.lore);
        /** 物品名称设定 */
        if (allOptions.name !== "") {
            item.nameTag = allOptions.name;
        }
        /** 物品可放置设定 */ item.setCanPlaceOn(allOptions.canPlaceOn);
        /** 物品可破坏设定 */ item.setCanDestroy(allOptions.canDestroy);
        /** 物品可死亡不掉落设定 */ item.keepOnDeath = allOptions.keepOnDeath;
        /** 输出 ItemStack */ return item;
    },

    /** 在特定位置生成物品
     * @param {Vector} pos 生成位置
     * @param {String} itemId 物品 ID
     * @param {itemOptions} options 物品信息可选项
     */
    spawnItem(pos, itemId, options = {}) {
        /** 可选项设置 */ const allOptions = { ...defaultItemOptions, ...options };
        /** 获取 ItemStack */ let item = this.getItemStack(itemId, allOptions);
        // 物品生成
        if (allOptions.clearVelocity) {
            world.getDimension(allOptions.dimension).spawnItem(item, pos).clearVelocity();
        } else {
            world.getDimension(allOptions.dimension).spawnItem(item, pos);
        }
    },

    /** 给予玩家物品
     * @param {Player} player 待给予物品的玩家
     * @param {String} itemId 物品 ID
     * @param {itemOptions} options 物品信息可选项
     */
    giveItem(player, itemId, options = {}) {
        const allOptions = { ...defaultItemOptions, ...options };
        player.getComponent("minecraft:inventory").container.addItem(this.getItemStack(itemId, allOptions));
    },

    /** 设置玩家装备栏
     * @param {Player} player 待给予装备的玩家
     * @param {String} itemId 物品 ID
     * @param {EquipmentSlot} slot 装备槽
     * @param {itemOptions} options 物品信息可选项
     */
    replaceEquipmentItem(player, itemId, slot, options = {}) {
        const allOptions = { ...defaultItemOptions, ...options };
        player.getComponent("minecraft:equippable").setEquipment(slot, this.getItemStack(itemId, allOptions));
    },

    /** 设置实体物品栏特定位置的物品
     * @param {Entity} entity 待设置物品的实体
     * @param {String} itemId 物品 ID
     * @param {Number} slot 槽位位置
     * @param {itemOptions} options 物品信息可选项
     */
    replaceInventoryItem(entity, itemId, slot, options = {}) {
        const allOptions = { ...defaultItemOptions, ...options };
        entity.getComponent("minecraft:inventory").container.setItem(slot, this.getItemStack(itemId, allOptions));
    },

    /** 清除物品
     * @param {Entity} entity 待清除物品的实体
     * @param {String} itemId 待清除物品的 ID
     */
    removeItem(entity, itemId, count = 1, data = -1) {
        entity.runCommand(`clear @s ${itemId} ${data} ${count}`)
    },

    /** 清除物品实体
     * @param {string} itemId 
     * @param {"overworld"|"nether"|"the_end"} dimension
     */
    removeItemEntity(itemId, dimension = "overworld") {
        world.getDimension(dimension).getEntities({ type: "minecraft:item" }).filter(item => item.getComponent("minecraft:item").itemStack.typeId === itemId).forEach(item => { item.remove() });
    },

};

/** 物品栏操作方法 */
export const inventory = {

    /** 获取实体物品栏
     * @param {Entity} entity 待获取实体
     */
    getInventory(entity) {
        /** @type {EntityInventoryComponent} */ const inventory = entity.getComponent("minecraft:inventory");
        return inventory;
    },

    /** 获取实体物品栏内的第 index 位物品
     * @remark 获取到的 item 可能是 undefined
     * @param {Entity} entity 待获取物品栏物品的实体
     * @param {number} index 物品栏的第 index 位物品
     */
    getItem(entity, index) {
        const inventory = this.getInventory(entity);
        return inventory.container.getItem(index);
    },

    /** 获取实体物品栏内的全部物品及对应槽位
     * @remark 获取到的 item 可能是 undefined
     * @param {Entity} entity 待获取物品栏物品的实体
     */
    getItems(entity) {
        const inventory = this.getInventory(entity);
        let inventoryItems = [];
        for (let i = 0; i < inventory.inventorySize; i++) {
            inventoryItems.push({ item: inventory.container.getItem(i), slot: i });
        }
        return inventoryItems;
    },

    /** 获取实体物品栏内的有效物品及对应槽位
     * @param {Entity} entity 待获取物品栏物品的实体
     * @returns {{item: ItemStack, slot: number}[]}
     */
    getValidItems(entity) {
        return this.getItems(entity).filter(itemInfo => itemInfo.item !== undefined);
    },

    /** 获取实体物品栏内的全部槽位
     * @param {Entity} entity 待获取物品栏物品的实体
     */
    getSlots(entity) {
        const inventory = this.getInventory(entity);
        let inventoryItems = [];
        for (let i = 0; i < inventory.inventorySize; i++) {
            inventoryItems.push({ slotContainer: inventory.container.getSlot(i), slot: i });
        }
        return inventoryItems;
    },

    /** 获取实体物品栏内的有效物品及对应槽位
     * @param {Entity} entity 待获取物品栏物品的实体
     */
    getValidSlots(entity) {
        return this.getSlots(entity).filter(slotInfo => slotInfo.slotContainer.hasItem());
    },

    /** 获取实体是否拥有物品
     * @param {Entity} entity 待检测实体
     * @param {string} itemId 物品 ID
     * @param {number|string} [quantity] 待检测物品的数量，可写为范围式
     * @param {string} [location] 待检测物品的槽位
     * @param {number|string} [slot] 待检测物品的槽位位置，可写为范围式
     * @param {number} [data] 待检测物品的数据值
     */
    hasItem(entity, itemId, quantity, location, slot, data) {
        let quantityStr = quantity ? `,quantity=${quantity}` : ``;
        let locationStr = location ? `,location=${location}` : ``;
        let slotStr = slot ? `,slot=${slot}` : ``;
        let dataStr = data ? `,data=${data}` : ``;
        // 检测物品
        return entity.runCommand(`execute if entity @s[hasitem={item=${itemId}${quantityStr}${locationStr}${slotStr}${dataStr} }]`).successCount !== 0;
    },

    /** 获取物品数目 
     * @param {Entity} entity 待获取物品数目的实体
     * @param {Entity} itemId 待获取物品数目的物品
     */
    hasItemAmount(entity, itemId) {
        let itemAmount = 0;
        this.getValidItems(entity).filter(itemInfo => itemInfo.item.typeId === itemId).forEach(itemInfo => itemAmount += itemInfo.item.amount);
        return itemAmount;
    },

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

export const ui = {

    /** 添加一个 ActionFormUI
     * @param {actionButtons[]} buttons 按钮信息
     * @param {string|import("@minecraft/server").RawMessage} body UI 内容
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     */
    addAction(buttons, body = "", title = "") {
        let actionUi = new ActionFormData().body(body).title(title);
        buttons.forEach(button => { actionUi.button(button.text, button.iconPath); })
        return actionUi;
    },

    /** 展示一个 ActionFormUI，返回是否成功显示了 UI
     * @param {ActionFormData} actionUi 待显示的 UI
     * @param {Player} player 向哪个玩家显示 UI
     * @param {function(FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
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
    },

    /** 添加并立即展示一个 ActionFormUI，返回是否成功显示了 UI
     * @param {actionButtons[]} buttons 按钮信息
     * @param {Player} player 向哪个玩家显示 UI
     * @param {function(FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {string|import("@minecraft/server").RawMessage} body UI 内容
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     */
    addThenShowAction(buttons, player, canceledFn, body = "", title = "") {
        let actionUi = this.addAction(buttons, body, title);
        return this.showAction(actionUi, player, canceledFn, selectedIndex => { buttons[selectedIndex]?.function; });
    },

    /** 添加一个 MessageFormUI
     * @param {messageButtons[]} buttons 按钮信息（注：buttons 内应有两个按钮信息）
     * @param {string|import("@minecraft/server").RawMessage} body UI 内容
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     */
    addMessage(buttons, body = "", title = "") {
        let messageUi = new MessageFormData().body(body).title(title);
        messageUi.button1(buttons[0].text).button2(buttons[1].text);
        return messageUi;
    },

    /** 展示一个 MessageFormUI，返回是否成功显示了 UI
     * @param {MessageFormData} messageUi 待显示的 UI
     * @param {Player} player 向哪个玩家显示 UI
     * @param {function(FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {function(number): void} selectedFn 若 UI 操作被选择执行的函数（参数 1：按钮索引）
     */
    showMessage(messageUi, player, canceledFn, selectedFn) {
        this.showAction(messageUi, player, canceledFn, selectedFn);
    },

    /** 添加并立即展示一个 MessageFormUI，返回是否成功显示了 UI
     * @param {messageButtons[]} buttons 按钮信息（注：buttons 内应有两个按钮信息）
     * @param {Player} player 向哪个玩家显示 UI
     * @param {function(FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {string|import("@minecraft/server").RawMessage} body UI 内容
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     */
    addThenShowMessage(buttons, player, canceledFn, body = "", title = "") {
        let messageUi = this.addMessage(buttons, body, title);
        return this.showMessage(messageUi, player, canceledFn, selectedIndex => { buttons[selectedIndex]?.function; });
    },

    /** 添加一个 ModalFormUI
     * @param {(dropdownButton|sliderButton|textFieldButton|toggleButton)[]} buttons 
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     * @param {string|import("@minecraft/server").RawMessage} submit 提交按钮内容
     */
    addModal(buttons, title = "", submit = "提交") {
        let modalUi = new ModalFormData().title(title).submitButton(submit);
        buttons.forEach(button => {
            if (button.type === "dropdown") { modalUi.dropdown(button.label, button.options, button.defaultValue); }
            else if (button.type === "slider") { modalUi.slider(button.label, button.min, button.max, button.step, button.defaultValue); }
            else if (button.type === "textField") { modalUi.textField(button.label, button.placeholder, button.defaultValue); }
            else if (button.type === "toggle") { modalUi.toggle(button.label, button.defaultValue); }
        });
        return modalUi;
    },

    /** 展示一个 ModalFormUI，返回是否成功显示了 UI
     * @param {ModalFormData} modalUi 待显示的 UI
     * @param {Player} player 向哪个玩家显示 UI
     * @param {function(FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
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
    },

    /** 添加并立即展示一个 ModalFormUI，返回是否成功显示了 UI
     * @param {(dropdownButton|sliderButton|textFieldButton|toggleButton)[]} buttons 
     * @param {Player} player 向哪个玩家显示 UI
     * @param {function(FormCancelationReason): void} canceledFn 若 UI 操作被取消执行的函数（参数 1：取消原因）
     * @param {function((string|number|boolean)[]): void} submittedFn 若 UI 操作被选择执行的函数（参数 1：按钮返回值）
     * @param {string|import("@minecraft/server").RawMessage} title UI 标题
     * @param {string|import("@minecraft/server").RawMessage} submit 提交按钮内容
     */
    addThenShowModal(buttons, player, canceledFn, submittedFn, title = "", submit = "提交") {
        let modalUi = this.addModal(buttons, title, submit);
        return this.showModal(modalUi, player, canceledFn, submittedData => { submittedFn(submittedData) })
    },

    /** 关闭所有 UI（目前暂无法使用）
     * @param {Player} player 
     */
    close(player) {
        
    }

}

// ===== js 基本方法 =====

export const js = {

    /** 在[a,b]取随机整数
     * @param {number} min 最小值
     * @param {number} max 最大值
     */
    randomInt(min, max) {
        // 确保 min <= max
        if (min > max) { [min, max] = [max, min]; }
        return Math.floor(Math.random() * (max - min + 1)) + min;    // 生成 [min, max] 之间的随机整数
    },

    /** 将数字转换为罗马数字的字符串
     * @param {Number} num 待转换数字
     */
    intToRoman( num ) {
        if ( num <= 0 ) { return ""; }
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
    },

    /** 在输入的对象中，输出值所对应的键
     * @remark 如果对象所有的值中有重复的，那么会返回第一个对应的键
     * @param {object} obj 输入的对象
     * @param {*} value 待寻找的对应值
     */
    getKeyByValue( obj, value ) {
        for (const [key, val] of Object.entries(obj)) {
            if (val === value) {
                return key;
            }
        }
        return void 0;
    },

    /** 打乱一个数组
     * @param {Array} array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            /** 生成一个随机索引 j */ const j = Math.floor(Math.random() * (i + 1));
            /** 交换元素 array[i] 和 array[j] */ [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    /** 判断传入的对象是否为空对象
     * @param {object} obj
     */
    isEmptyObject(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    },

    /** 删除数组的特定元素
     * @param {Array} array 待删除元素的数组
     * @param {*} element 待删除的元素
     */
    removeElementOfArray( array, element ) {
        // 使用循环和splice方法删除所有匹配的元素
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i] === element) {
                array.splice(i, 1);
            }
        }
    },

    /** 判断一个数组有多少组x个相同的数字
     * @description 例：countSameNumbers([1,1,1,2,3],3) => 1；countSameNumbers([1,1,2,2,3],2) => 2
     * @param {any[]} array 
     * @param {number} x 
     */
    countSameNumbers(array, x) {
        let map = new Map();
        array.forEach(num => { map.set(num, (map.get(num) || 0) + 1); }); // 统计每个数字出现的次数
        let count = 0;
        map.forEach((value, key) => { if (value === x) { count++; } }); // 遍历 map，找出有多少组 x 个相同的数字
        return count;
    },

}

// ===== 调试方法 =====

export const debug = {

    /** 发送一个调试性消息
     * @param {any} message 待返回的消息
     */
    sendMessage(message) {
        world.sendMessage(`${message}`)
    },

    /** 打印数组
     * @param {Array} array 待打印数组
     * @param {string} arrayName 待打印数组的名称
     */
    printArray(array, arrayName) {
        world.sendMessage(`§a${arrayName} = §r§f[§b${array.join(", ")}§r§f]`)
    },

    /** 打印对象
     * @param {object} object 待打印的对象
     * @param {"chat"|"actionbar"} mode 打印的位置，chat=聊天栏，actionbar=快捷栏标题
     * @param {boolean} hasFunction 是否打印对象内部方法
     */
    printObject(object, mode = "chat", hasFunction = true) {

        /** 待打印的字符串数组 @type {string[]} */ let printString = [];
        // 设置打印的字符串
        if (object == undefined) {
            printString = [`<§6undefined>`];
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
            world.sendMessage(printString.join("\n"));
        }
        else {
            world.getAllPlayers().forEach(player => {
                player.onScreenDisplay.setActionBar(printString.join("\n"));
            });
        }

    },

};
