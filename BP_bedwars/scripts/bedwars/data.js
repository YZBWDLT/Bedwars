// *-*-*-*-*-*-* 起床战争数据 *-*-*-*-*-*-*
// 此处仅记录纯数据，不带有任何功能

// ===== 模块导入 =====

import * as lib from "./lib";
import * as minecraft from "@minecraft/server";

// ===== type 定义 =====

// BedwarsMapInfo 定义一张地图的基本信息

/**
 * @typedef BedwarsMapInfo
 * @property {string} id ID，它将控制地图的运行方式
 * @property {string} name 名称，它将按照给定名称在游戏开始前显示出来
 * @property {"classic"|"capture"} mode 模式，该地图将按照什么模式执行
 * @property {BedwarsTeamInfo[]} teams 队伍信息
 * @property {TraderInfo[]} traders 商人信息，包括位置、朝向、类型
 * @property {TeamIslandInfo[]} teamIslands 队伍岛屿信息
 * @property {IslandInfo[]} islands 其他岛屿信息
 * @property {minecraft.Vector3[]} diamondSpawnerLocation 钻石生成点位置
 * @property {minecraft.Vector3[]} emeraldSpawnerLocation 绿宝石生成点位置
 * @property {number} [sizeX] 地图的 x 方向半边长大小
 * @property {number} [sizeZ] 地图的 z 方向半边长大小
 * @property {boolean} [clearVelocity] 生成资源时是否分散，如果是则在每次生成时 3*3 地分散式生成资源
 * @property {boolean} [distributeResource] 生成资源时是否分散，如果是则在每次生成时 3*3 地分散式生成资源
 * @property {number} [ironSpawnTimes] 一次最多生成铁的数量
 * @property {number} [heightLimitMax] 最高高度限制，在高于此高度的位置放置方块会阻止
 * @property {number} [heightLimitMin] 最低高度限制，在低于此高度的位置放置方块会阻止
 * @property {number} [healPoolRadius] 治愈池半径
 * @property {boolean} [disableTeamIslandFlag] 是否在本地图禁用旗帜
 * @property {boolean} [isSolo] 是否为单挑模式（通常意义上是 8 队模式），单挑模式会影响资源的生成速度和物资售价
 */

// TraderInfo 定义商人的位置、朝向、类型和其他基本信息

/** 
 * @typedef TraderInfo
 * @property {minecraft.Vector3} location 商人位置
 * @property {number} rotation 商人旋转角度，为 0°~360°
 * @property {"item" | "upgrade"} type 商人信息
 * @property {number} [skin] 皮肤 ID
 */

// TeamIslandInfo 定义队伍岛屿的归属、加载时间等信息

/** 
 * @typedef TeamIslandInfo
 * @property {ValidTeams} teamId 队伍 ID，决定生成何种颜色的羊毛
 * @property {minecraft.Vector3} location 岛屿结构加载位置
 * @property {number} loadTime 加载结构所需时间，单位：秒
 * @property {minecraft.Vector3} [flagLocationFrom] 旗帜位置起始点
 * @property {minecraft.Vector3} [flagLocationTo] 旗帜位置终止点
 * @property {boolean} [disableFlag] 是否禁止本地图的旗帜
 * @property {minecraft.StructureMirrorAxis} [mirror] 岛屿是否镜像加载
 * @property {minecraft.StructureRotation} [rotation] 岛屿是否镜像加载
 */

// IslandInfo 定义钻石岛、中岛等信息

/** 
 * @typedef IslandInfo
 * @property {string|"diamond_island"|"center_island"|"side_island"} structureName 结构名称，预设的有：diamond_island、center_island、side_island，也可能有其他搭配，见详细结构配置
 * @property {minecraft.Vector3} location 岛屿结构加载位置
 * @property {number} loadTime 加载结构所需时间，单位：秒
 * @property {StructureMirrorAxis} [mirror] 岛屿是否镜像加载
 * @property {minecraft.StructureRotation} [rotation] 岛屿是否镜像加载
 */

// StartIntro 开始游戏时的介绍

/**
 * @typedef StartIntro
 * @property {minecraft.RawMessage} title 开始游戏时的标题，例如“起床战争（经典模式）”
 * @property {minecraft.RawMessage} intro 开始游戏时的玩法内容，例如“保护你的床并摧毁敌人的床……”
 */

// SpawnerInfo 资源生成点信息

/**
 * @typedef SpawnerInfo
 * @property {minecraft.Vector3} location 资源点位置
 * @property {number} spawnedTimes 生成次数
 */

// BedwarsTeamInfo 定义队伍的 ID、床的位置、资源点位置等信息

/** 
 * @typedef BedwarsTeamInfo
 * @property {ValidTeams} id ID，代表一个独一无二的队伍
 * @property {minecraft.Vector3} bedLocation 床的位置
 * @property {minecraft.StructureRotation} [bedRotation] 床的旋转
 * @property {minecraft.Vector3} resourceLocation 资源点的位置，若为分散式生成资源应选取中心点
 * @property {minecraft.Vector3} spawnpointLocation 重生点的位置，若玩家能够重生则重生到此位置上
 * @property {minecraft.Vector3} chestLocation 箱子的位置
 */

// BedwarsPlayerInfo 定义起床战争的玩家信息，包括其队伍和玩家本体信息

/**
 * @typedef BedwarsPlayerInfo
 * @property {BedwarsTeam | undefined} team 该玩家所属的队伍，若为 undefined 则为旁观模式
 * @property {minecraft.Player} player 该玩家信息所对应的玩家
 * @property {KillStyle} [KillStyle] 该玩家所采用的击杀信息
 */

// BedwarsItemShopitemInfo 定义物品类商店物品信息，包含诸多附属 type 定义

/** BedwarsItemShopitemInfo
 * @typedef BedwarsItemShopitemInfo
 * @property {BedwarsItemShopitemDescription} description 物品类类商店物品描述
 * @property {BedwarsItemShopitemComponent} [component] 物品类商店物品组件（单物品形式可用）
 * @property {BedwarsItemShopitemComponent[]} [components] 物品类商店物品组件（多物品形式可用）
 */

/** BedwarsItemShopitemDescription
 * @typedef BedwarsItemShopitemDescription
 * @property {"item"|"itemGroup"} format 商店物品形式
 * @property {ShopitemCategory} category 商店物品类别
 * @property {string[]} [description] 物品简介，按照 lore 的形式显示到商店物品上，一个字符串代表一行
 * @property {boolean} [isQuickBuy] 是否为快速购买物品，若是则在商店首页显示
 * @property {boolean} [classicModeEnabled] 该物品是否在经典模式启用
 * @property {boolean} [captureModeEnabled] 该物品是否在经典模式启用
 * @property {boolean} [isArmor] 该物品是否为盔甲，它是永久性装备，不会直接给予
 * @property {boolean} [isShears] 该物品是否为剪刀，它是永久性装备，不会直接给予
 * @property {boolean} [isPickaxe] 该物品是否为镐子，它是永久性装备，不会直接给予
 * @property {boolean} [isAxe] 该物品是否为斧头，它是永久性装备，不会直接给予
 */

/** BedwarsItemShopitemComponent
 * @typedef BedwarsItemShopitemComponent
 * @property {string} id 物品 ID，决定显示在商店内的商店物品和给予玩家的物品
 * @property {number} amount 物品数量，决定显示在商店内的物品数量和给予玩家的物品数量
 * @property {BedwarsResourceComponent} resource 指定该物品的资源需求
 * @property {BedwarsItemTierComponent} [tier] 指定该物品的等级，多物品情况下应指定该组件，以指定显示物品的条件
 * @property {BedwarsItemRealItemIdComponent} [realItemId] 指定该物品是否要覆写默认值，不指定该组件时将默认将给予物品的 ID 设置为 bedwars:(id)
 * @property {BedwarsItemEnchantmentComponent} [enchantment] 物品的附魔信息
 * @property {string[]} [lore] 给予物品后的 lore 信息
 * @property {string[]} [removeItem] 购买此物品后将移除哪些物品，应指定为物品 ID 的数组
 */

/** BedwarsItemRealItemIdComponent
 * @typedef BedwarsItemRealItemIdComponent
 * @property {boolean} [isVanilla] 该物品是否为原版物品，指定该参数将设置 ID 为 minecraft:(id)，指定 id 参数时会直接覆盖该参数的解析
 * @property {boolean} [isColored] 该物品是否为彩色物品，指定该参数将设置 ID 为 bedwars:(队伍颜色)_(id)，指定 id 参数时会直接覆盖该参数的解析
 * @property {string} [id] 指定要直接覆写为的 ID 
 */

/** BedwarsResourceComponent
 * @typedef BedwarsResourceComponent
 * @property {ResourceType} type 该物品需要什么类型的资源
 * @property {number} amount 该物品需要多少资源
 * @property {number} [amountInSolo] 该物品在 8 队模式下需要多少资源
 */

/** BedwarsItemEnchantmentComponent
 * @typedef BedwarsItemEnchantmentComponent
 * @property {lib.EnchantmentInfo[]} [list] 物品固有的附魔
 * @property {boolean} [applySharpness] （仅限非永久性物品可用）是否在玩家所在团队拥有锋利附魔升级时添加锋利附魔
 * @property {boolean} [applyFeatherFalling] （仅限非永久性物品可用）是否在玩家所在团队拥有缓冲靴子升级时添加摔落缓冲附魔
 */

/** BedwarsItemTierComponent
 * @typedef BedwarsItemTierComponent
 * @property {number} tier 商店物品等级，对于堆叠式物品（format: itemGroup），当该玩家的对应物品升级的等级 = tier - 1 时允许购买；对于单个物品，该玩家的对应物品升级的等级 < tier 时允许购买
 * @property {boolean} [showCurrentTier] 显示当前等级和物品可升级提示
 * @property {boolean} [loseTierUponDeath] 物品是否会降级，同时显示降级提示
 */

// BedwarsUpgradeShopitemInfo 定义团队升级商店物品信息，包含诸多附属 type 定义

/** BedwarsUpgradeShopitemInfo
 * @typedef BedwarsUpgradeShopitemInfo
 * @property {BedwarsUpgradeShopitemDescription} description 团队升级类商店物品描述
 * @property {BedwarsUpgradeShopitemComponent} [component] 团队升级类商店物品组件（单物品形式可用）
 * @property {BedwarsUpgradeShopitemComponent[]} [components] 团队升级类商店物品组件（多物品形式可用）
 */

/** BedwarsUpgradeShopitemDescription
 * @typedef BedwarsUpgradeShopitemDescription
 * @property {"item"|"itemGroup"} format 商店物品形式
 * @property {"upgrade"|"trap"} category 商店物品分类
 * @property {string[]} [description] 商店物品简介，显示该团队升级的最根本用途
 * @property {boolean} [classicModeEnabled] 在经典模式是否启用
 * @property {boolean} [captureModeEnabled] 在夺点模式是否启用
 */

/** BedwarsUpgradeShopitemComponent
 * @typedef BedwarsUpgradeShopitemComponent
 * @property {string} shopitemId 商店物品 ID
 * @property {number} amount 在商店中显示为多少物品
 * @property {BedwarsResourceComponent} resource 指定该物品的资源需求
 * @property {BedwarsUpgradeTierComponent} [tier] 指定该物品的等级
 */

/** BedwarsUpgradeTierComponent
 * @typedef BedwarsUpgradeTierComponent
 * @property {number} tier 团队升级等级，只有当该队伍的对应升级的等级 = tier - 1 时允许购买
 * @property {string} checkUpgradeTier 在购买此物品时，检查何种团队升级的等级
 * @property {string[]} [thisTierDescription] （仅限多物品模式可用）显示该等级的用途，最后将显示为：“tier级： thisTierDecription， resourceAmount 钻石”
 */

// ===== enum 定义 =====

/** 所有可用的队伍
 * @readonly
 * @enum {string}
 */
export const ValidTeams = {
    red: "red",
    blue: "blue",
    yellow: "yellow",
    green: "green",
    pink: "pink",
    cyan: "cyan",
    white: "white",
    gray: "gray",
    purple: "purple",
    brown: "brown",
    orange: "orange",
};

/** 商店物品类型
 * @enum {string}
 */
export const ShopitemCategory = {
    quickBuy: "quickBuy",
    blocks: "blocks",
    melee: "melee",
    armor: "armor",
    tools: "tools",
    ranged: "ranged",
    potions: "potions",
    utility: "utility",
    rotatingItems: "rotatingItems",
};

/** 资源类型 @enum {string} */
export const ResourceType = {
    iron: "iron",
    gold: "gold",
    diamond: "diamond",
    emerald: "emerald",
};

/** 所有可用的击杀样式
 * @enum {string}
 */
export const KillStyle = {
    default: "default",
    flame: "flame",
    west: "west",
    glory: "glory",
    pirate: "pirate",
    love: "love",
    christmas: "christmas",
    meme: "meme",
    pack: "pack",
    newThreeKingdom: "newThreeKingdom"
};

// ===== 地图数据 =====

/** 所有地图数据 */
export const mapData = {

    /** 经典模式地图数据 */
    classic: {

        /** 2 队地图 */
        TwoTeams: {

            /** 地图：神秘 @type {BedwarsMapInfo} */
            cryptic: {
                id: "cryptic",
                name: "神秘",
                mode: "classic",
                teams: [
                    {
                        id: ValidTeams.red,
                        bedLocation: { x: 2, y: 77, z: 73 },
                        bedRotation: minecraft.StructureRotation.Rotate90,
                        resourceLocation: { x: 2, y: 78, z: 90 },
                        spawnpointLocation: { x: 2, y: 78, z: 85 },
                        chestLocation: { x: -1, y: 78, z: 81 },
                    },
                    {
                        id: ValidTeams.blue,
                        bedLocation: { x: 2, y: 77, z: -73 },
                        bedRotation: minecraft.StructureRotation.Rotate270,
                        resourceLocation: { x: 2, y: 78, z: -90 },
                        spawnpointLocation: { x: 2, y: 78, z: -85 },
                        chestLocation: { x: -1, y: 78, z: -81 },
                    }
                ],
                teamIslands: [
                    {
                        teamId: ValidTeams.red,
                        location: { x: -12, y: 61, z: 63 },
                        loadTime: 2,
                        flagLocationFrom: { x: 8, y: 84, z: 78 },
                        flagLocationTo: { x: -4, y: 87, z: 92 },
                    },
                    {
                        teamId: ValidTeams.blue,
                        location: { x: -12, y: 61, z: -95 },
                        loadTime: 2,
                        mirror: minecraft.StructureMirrorAxis.X,
                        flagLocationFrom: { x: -4, y: 84, z: 78 },
                        flagLocationTo: { x: 8, y: 87, z: -92 },
                    }

                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: 53, y: 49, z: -15 },
                        loadTime: 2,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: -75, y: 54, z: -15 },
                        loadTime: 2,
                        mirror: minecraft.StructureMirrorAxis.Z,
                    },
                    {
                        structureName: "center_island_1",
                        location: { x: -33, y: 41, z: -29 },
                        loadTime: 17,
                    },
                    {
                        structureName: "center_island_2",
                        location: { x: 31, y: 41, z: -29 },
                        loadTime: 1,
                    },

                ],
                traders: [
                    {
                        location: { x: -2, y: 78, z: 86 },
                        rotation: 270,
                        type: "item"
                    },
                    {
                        location: { x: 6, y: 78, z: 86 },
                        rotation: 90,
                        type: "upgrade"
                    },

                    {
                        location: { x: 6, y: 78, z: -86 },
                        rotation: 90,
                        type: "item"
                    },
                    {
                        location: { x: -3, y: 78, z: -86 },
                        rotation: 270,
                        type: "upgrade"
                    },
                ],
                diamondSpawnerLocation: [
                    { x: -70, y: 78, z: 0 },
                    { x: 70, y: 73, z: 0 }
                ],
                emeraldSpawnerLocation: [
                    { x: 21, y: 68, z: 0 },
                    { x: -25, y: 81, z: 0 }
                ],
                heightLimitMax: 102,
                heightLimitMin: 67,
                healPoolRadius: 25,
                distributeResource: false,
            },

            /** 地图：极寒 @type {BedwarsMapInfo} */
            frost: {
                id: "frost",
                name: "极寒",
                mode: "classic",
                teams: [
                    {
                        id: ValidTeams.red,
                        bedLocation: { x: 0, y: 72, z: 59 },
                        bedRotation: minecraft.StructureRotation.Rotate90,
                        resourceLocation: { x: 0, y: 72, z: 75 },
                        spawnpointLocation: { x: 0, y: 72, z: 70 },
                        chestLocation: { x: 4, y: 72, z: 68 },
                    },
                    {
                        id: ValidTeams.blue,
                        bedLocation: { x: 0, y: 72, z: -59 },
                        bedRotation: minecraft.StructureRotation.Rotate270,
                        resourceLocation: { x: 0, y: 72, z: -75 },
                        spawnpointLocation: { x: 0, y: 72, z: -70 },
                        chestLocation: { x: 4, y: 72, z: -68 },
                    }
                ],
                teamIslands: [
                    {
                        teamId: ValidTeams.red,
                        location: { x: -13, y: 55, z: 55 },
                        loadTime: 2,
                    },
                    {
                        teamId: ValidTeams.blue,
                        location: { x: -13, y: 55, z: -81 },
                        loadTime: 2,
                        mirror: minecraft.StructureMirrorAxis.X,
                    }

                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: 29, y: 60, z: -20 },
                        loadTime: 1,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: -46, y: 60, z: -2 },
                        rotation: minecraft.StructureRotation.Rotate180,
                        loadTime: 1,
                    },
                    {
                        structureName: "center_island",
                        location: { x: -13, y: 56, z: -22 },
                        loadTime: 4,
                    },

                ],
                traders: [
                    {
                        location: { x: -6, y: 72, z: 71 },
                        rotation: 270,
                        type: "item"
                    },
                    {
                        location: { x: 6, y: 72, z: 71 },
                        rotation: 90,
                        type: "upgrade"
                    },

                    {
                        location: { x: 6, y: 72, z: -71 },
                        rotation: 90,
                        type: "item"
                    },
                    {
                        location: { x: -6, y: 72, z: -71 },
                        rotation: 270,
                        type: "upgrade"
                    },
                ],
                diamondSpawnerLocation: [
                    { x: 38, y: 75, z: -10 },
                    { x: -38, y: 73, z: 10 }
                ],
                emeraldSpawnerLocation: [
                    { x: 0, y: 76, z: -12 },
                    { x: 0, y: 76, z: 12 }
                ],
                heightLimitMax: 97,
                heightLimitMin: 69,
                healPoolRadius: 15,
                distributeResource: false,
                disableTeamIslandFlag: true
            },

            /** 地图：花园 @type {BedwarsMapInfo} */
            garden: {
                id: "garden",
                name: "花园",
                mode: "classic",
                teams: [
                    {
                        id: ValidTeams.red,
                        bedLocation: { x: 79, y: 77, z: 0 },
                        resourceLocation: { x: 98, y: 79, z: 0 },
                        spawnpointLocation: { x: 94, y: 79, z: 0 },
                        chestLocation: { x: 91, y: 79, z: 4 },
                    },
                    {
                        id: ValidTeams.blue,
                        bedLocation: { x: -79, y: 77, z: 0 },
                        bedRotation: minecraft.StructureRotation.Rotate180,
                        resourceLocation: { x: -98, y: 79, z: 0 },
                        spawnpointLocation: { x: -94, y: 79, z: 0 },
                        chestLocation: { x: -91, y: 79, z: 4 },
                    }
                ],
                teamIslands: [
                    {
                        teamId: ValidTeams.red,
                        location: { x: 73, y: 69, z: -15 },
                        loadTime: 2,
                        flagLocationFrom: { x: 91, y: 79, z: -8 },
                        flagLocationTo: { x: 91, y: 84, z: 8 },
                    },
                    {
                        teamId: ValidTeams.blue,
                        location: { x: -104, y: 69, z: -15 },
                        loadTime: 2,
                        mirror: minecraft.StructureMirrorAxis.Z,
                        flagLocationFrom: { x: -91, y: 79, z: 8 },
                        flagLocationTo: { x: -91, y: 84, z: -8 },
                    }

                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: -20, y: 64, z: -65 },
                        loadTime: 2,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: -20, y: 64, z: 40 },
                        loadTime: 2,
                        mirror: minecraft.StructureMirrorAxis.X,
                    },
                    {
                        structureName: "center_island",
                        location: { x: -30, y: 54, z: -30 },
                        loadTime: 12,
                    },

                ],
                traders: [
                    {
                        location: { x: 94, y: 79, z: 8 },
                        rotation: 180,
                        type: "item"
                    },
                    {
                        location: { x: 94, y: 79, z: -8 },
                        rotation: 0,
                        type: "upgrade"
                    },

                    {
                        location: { x: -94, y: 79, z: -8 },
                        rotation: 0,
                        type: "item"
                    },
                    {
                        location: { x: -94, y: 79, z: 8 },
                        rotation: 180,
                        type: "upgrade"
                    },
                ],
                diamondSpawnerLocation: [
                    { x: 0, y: 77, z: -52 },
                    { x: 0, y: 77, z: 52 }
                ],
                emeraldSpawnerLocation: [
                    { x: -21, y: 76, z: -21 },
                    { x: 21, y: 76, z: 21 }
                ],
                heightLimitMax: 97,
                heightLimitMin: 67,
                healPoolRadius: 21,
            },

            /** 地图：狮庙 @type {BedwarsMapInfo} */
            lionTemple: {
                id: "lion_temple",
                name: "狮庙",
                mode: "classic",
                teams: [
                    {
                        id: ValidTeams.red,
                        bedLocation: { x: -2, y: 73, z: 58 },
                        bedRotation: minecraft.StructureRotation.Rotate90,
                        resourceLocation: { x: -2, y: 75, z: 78 },
                        spawnpointLocation: { x: -2, y: 75, z: 73 },
                        chestLocation: { x: 2, y: 75, z: 68 },
                    },
                    {
                        id: ValidTeams.blue,
                        bedLocation: { x: -2, y: 73, z: -58 },
                        bedRotation: minecraft.StructureRotation.Rotate270,
                        resourceLocation: { x: -2, y: 75, z: -78 },
                        spawnpointLocation: { x: -2, y: 75, z: -73 },
                        chestLocation: { x: 2, y: 75, z: -68 },
                    }
                ],
                teamIslands: [
                    {
                        teamId: ValidTeams.red,
                        location: { x: -13, y: 61, z: 53 },
                        loadTime: 2,
                        flagLocationFrom: { x: 6, y: 74, z: 65 },
                        flagLocationTo: { x: -10, y: 86, z: 81 },
                    },
                    {
                        teamId: ValidTeams.blue,
                        location: { x: -13, y: 61, z: -84 },
                        mirror: minecraft.StructureMirrorAxis.X,
                        loadTime: 2,
                        flagLocationFrom: { x: -10, y: 74, z: -65 },
                        flagLocationTo: { x: 6, y: 86, z: -81 },
                    }
                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: -69, y: 66, z: -13 },
                        loadTime: 2,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: 43, y: 66, z: -13 },
                        loadTime: 2,
                        rotation: minecraft.StructureRotation.Rotate180,
                    },
                    {
                        structureName: "center_island",
                        location: { x: -34, y: 55, z: -25 },
                        loadTime: 11,
                    }
                ],
                traders: [
                    {
                        location: { x: -7, y: 75, z: 72 },
                        rotation: 270,
                        type: "item",
                    },
                    {
                        location: { x: 3, y: 75, z: 72 },
                        rotation: 90,
                        type: "upgrade",
                    },

                    {
                        location: { x: 3, y: 75, z: -72 },
                        rotation: 90,
                        type: "item"
                    },
                    {
                        location: { x: -7, y: 75, z: -72 },
                        rotation: 270,
                        type: "upgrade",
                    }
                ],
                diamondSpawnerLocation: [
                    { x: 53, y: 83, z: 0 },
                    { x: -58, y: 83, z: 0 }
                ],
                emeraldSpawnerLocation: [
                    { x: -20, y: 77, z: 0 },
                    { x: 17, y: 82, z: 0 }
                ],
                heightLimitMax: 100,
                heightLimitMin: 69,
                healPoolRadius: 18,
                distributeResource: false,
                ironSpawnTimes: 1,
            },

            /** 地图：野餐 @type {BedwarsMapInfo} */
            picnic: {
                id: "picnic",
                name: "野餐",
                mode: "classic",
                teams: [
                    {
                        id: ValidTeams.red,
                        bedLocation: { x: 0, y: 65, z: -62 },
                        bedRotation: minecraft.StructureRotation.Rotate270,
                        resourceLocation: { x: 0, y: 64, z: -78 },
                        spawnpointLocation: { x: 0, y: 64, z: -74 },
                        chestLocation: { x: 3, y: 64, z: -73 },
                    },
                    {
                        id: ValidTeams.blue,
                        bedLocation: { x: 0, y: 65, z: 61 },
                        bedRotation: minecraft.StructureRotation.Rotate90,
                        resourceLocation: { x: 0, y: 64, z: 77 },
                        spawnpointLocation: { x: 0, y: 64, z: 73 },
                        chestLocation: { x: -3, y: 64, z: 72 },
                    }
                ],
                teamIslands: [
                    {
                        teamId: ValidTeams.red,
                        location: { x: -12, y: 55, z: -82 },
                        loadTime: 2,
                        flagLocationFrom: { x: -5, y: 75, z: -72 },
                        flagLocationTo: { x: 13, y: 81, z: -69 }
                    },
                    {
                        teamId: ValidTeams.blue,
                        location: { x: -14, y: 55, z: 55 },
                        loadTime: 2,
                        rotation: minecraft.StructureRotation.Rotate180,
                        flagLocationFrom: { x: 5, y: 75, z: 71 },
                        flagLocationTo: { x: -13, y: 81, z: 68 }
                    }
                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: -63, y: 58, z: -24 },
                        loadTime: 1,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: 38, y: 58, z: -5 },
                        loadTime: 1,
                        rotation: minecraft.StructureRotation.Rotate180,

                    },
                    {
                        structureName: "center_island",
                        location: { x: -21, y: 49, z: -22 },
                        loadTime: 10,
                    }
                ],
                traders: [
                    {
                        location: { x: 6, y: 64, z: -75.5 },
                        rotation: 90,
                        type: "item"
                    },
                    {
                        location: { x: -6, y: 64, z: -75.5 },
                        rotation: 270,
                        type: "upgrade"
                    },

                    {
                        location: { x: -6, y: 64, z: 74.5 },
                        rotation: 270,
                        type: "item"
                    },
                    {
                        location: { x: 6, y: 64, z: 74.5 },
                        rotation: 90,
                        type: "upgrade"
                    },
                ],
                diamondSpawnerLocation: [
                    { x: 48, y: 63, z: 10 },
                    { x: -48, y: 63, z: -10 }
                ],
                emeraldSpawnerLocation: [
                    { x: -7, y: 68, z: -11 },
                    { x: 8, y: 68, z: 12 }
                ],
                heightLimitMax: 90,
                heightLimitMin: 60,
                healPoolRadius: 19,
                distributeResource: false,
            },

            /** 地图：废墟 @type {BedwarsMapInfo} */
            ruins: {
                id: "ruins",
                name: "废墟",
                mode: "classic",
                teams: [
                    {
                        id: ValidTeams.red,
                        bedLocation: { x: -4, y: 71, z: -64 },
                        bedRotation: minecraft.StructureRotation.Rotate270,
                        resourceLocation: { x: 0, y: 72, z: -82 },
                        spawnpointLocation: { x: 0, y: 72, z: -78 },
                        chestLocation: { x: 5, y: 72, z: -76 },
                    },
                    {
                        id: ValidTeams.blue,
                        bedLocation: { x: 4, y: 71, z: 64 },
                        bedRotation: minecraft.StructureRotation.Rotate90,
                        resourceLocation: { x: 0, y: 72, z: 82 },
                        spawnpointLocation: { x: 0, y: 72, z: 78 },
                        chestLocation: { x: -5, y: 72, z: 76 },
                    },
                ],
                teamIslands: [
                    {
                        teamId: ValidTeams.red,
                        location: { x: -15, y: 61, z: -88 },
                        loadTime: 2,
                        flagLocationFrom: { x: -6, y: 76, z: -72 },
                        flagLocationTo: { x: 6, y: 79, z: -76 },
                    },
                    {
                        teamId: ValidTeams.blue,
                        location: { x: -15, y: 61, z: 59 },
                        loadTime: 2,
                        rotation: minecraft.StructureRotation.Rotate180,
                        flagLocationFrom: { x: 6, y: 76, z: 72 },
                        flagLocationTo: { x: -6, y: 79, z: 76 },
                    }
                ],
                islands: [
                    {
                        structureName: "diamond_island",
                        location: { x: -60, y: 62, z: -22 },
                        loadTime: 2,
                    },
                    {
                        structureName: "diamond_island",
                        location: { x: 35, y: 62, z: -7 },
                        rotation: minecraft.StructureRotation.Rotate180,
                        loadTime: 2,
                    },
                    {
                        structureName: "center_island",
                        location: { x: -24, y: 61, z: -25 },
                        loadTime: 5,
                    }
                ],
                traders: [
                    {
                        location: { x: 6, y: 72, z: -79.5 },
                        rotation: 90,
                        type: "item"
                    },
                    {
                        location: { x: -6, y: 72, z: -79.5 },
                        rotation: 270,
                        type: "upgrade"
                    },

                    {
                        location: { x: -6, y: 72, z: 79.5 },
                        rotation: 270,
                        type: "item"
                    },
                    {
                        location: { x: 6, y: 72, z: 79.5 },
                        rotation: 90,
                        type: "upgrade"
                    },
                ],
                diamondSpawnerLocation: [
                    { x: -47, y: 69, z: -10 },
                    { x: 47, y: 69, z: 10 }
                ],
                emeraldSpawnerLocation: [
                    { x: 17, y: 69, z: -6 },
                    { x: -17, y: 69, z: 6 }
                ],
                heightLimitMax: 96,
                heightLimitMin: 65,
                healPoolRadius: 20
            }

        },

        /** 4 队地图 */
        FourTeams: {

            // aquarium: {},
            // archway: {},
            // boletum: {},
            // carapace: {},
            // chained: {},
            // eastwood: {},
            // orchid: {},

        },

        /** 8 队地图 */
        EightTeams: {

            // amazon: {},
            // deadwood: {},
            // glacier: {},
            // lighthouse: {},
            // playground: {},
            // rooftop: {},
            // waterfall: {}

        },

    },

    capture: {
        TwoTeams: {

            // picnic: {}

        }
    },

};

// ===== 商人数据 =====

/** 物品类商店物品基本信息 */
export const itemShopitemData = {

    // ===== 方块 =====

    /** 羊毛，4 铁锭 -> 16 羊毛 @type {BedwarsItemShopitemInfo} */
    wool: {
        description: {
            format: "item",
            category: ShopitemCategory.blocks,
            description: ["可用于搭桥穿越岛屿。搭出的桥的颜色会对应你的队伍颜色。"],
            isQuickBuy: true,
        },
        component: {
            id: "wool",
            amount: 16,
            resource: { type: ResourceType.iron, amount: 4 },
            realItemId: { isColored: true },
        },
    },
    /** 硬化粘土（陶瓦），12 铁锭 -> 16 硬化粘土 @type {BedwarsItemShopitemInfo} */
    stainedHardenedClay: {
        description: {
            format: "item",
            category: ShopitemCategory.blocks,
            description: ["用于保卫床的基础方块。"],
        },
        component: {
            id: "stained_hardened_clay",
            amount: 16,
            resource: { type: ResourceType.iron, amount: 12 },
            realItemId: { isColored: true }
        },
    },
    /** 防爆玻璃，12 铁锭 -> 4 防爆玻璃 @type {BedwarsItemShopitemInfo} */
    blastProofGlass: {
        description: {
            format: "item",
            category: ShopitemCategory.blocks,
            description: ["免疫爆炸。"],
        },
        component: {
            id: "blast_proof_glass",
            amount: 4,
            resource: { type: ResourceType.iron, amount: 12 },
            realItemId: { isColored: true }
        },
    },
    /** 末地石，24 铁锭 -> 12 末地石 @type {BedwarsItemShopitemInfo} */
    endStone: {
        description: {
            format: "item",
            category: ShopitemCategory.blocks,
            description: ["用于保卫床的坚固方块。"],
            isQuickBuy: true,
        },
        component: {
            id: "end_stone",
            amount: 12,
            resource: { type: ResourceType.iron, amount: 24 },
        },
    },
    /** 梯子，4 铁锭 -> 8 梯子 @type {BedwarsItemShopitemInfo} */
    ladder: {
        description: {
            format: "item",
            category: ShopitemCategory.blocks,
            description: ["可用于救助在树上卡住的猫。"],
        },
        component: {
            id: "ladder",
            amount: 8,
            resource: { type: ResourceType.iron, amount: 4 },
            realItemId: { isVanilla: true }
        },
    },
    /** 木板，4 金锭 -> 16 木板 @type {BedwarsItemShopitemInfo} */
    planks: {
        description: {
            format: "item",
            category: ShopitemCategory.blocks,
            description: ["用于保卫床的优质方块。能有效", "抵御镐子的破坏。"],
            isQuickBuy: true,
        },
        component: {
            id: "oak_planks",
            amount: 16,
            resource: { type: ResourceType.gold, amount: 4 },
        },
    },
    /** 黑曜石，4 绿宝石 -> 4 黑曜石 @type {BedwarsItemShopitemInfo} */
    obsidian: {
        description: {
            format: "item",
            category: ShopitemCategory.blocks,
            description: [
                "百分百保护你的床。"
            ],
        },
        component: {
            id: "obsidian",
            amount: 4,
            resource: { type: ResourceType.emerald, amount: 4 },
        },
    },

    // ===== 近战 =====

    /** 石剑，10 铁锭 -> 1 石剑 @type {BedwarsItemShopitemInfo} */
    stoneSword: {
        description: {
            format: "item",
            category: ShopitemCategory.melee,
        },
        component: {
            id: "stone_sword",
            amount: 1,
            resource: { type: ResourceType.iron, amount: 10 },
            enchantment: { applySharpness: true },
            removeItem: ["bedwars:wooden_sword"],
        },
    },
    /** 铁剑，7 金锭 -> 1 铁剑 @type {BedwarsItemShopitemInfo} */
    ironSword: {
        description: {
            format: "item",
            category: ShopitemCategory.melee,
            isQuickBuy: true,
        },
        component: {
            id: "iron_sword",
            amount: 1,
            resource: { type: ResourceType.gold, amount: 7 },
            enchantment: { applySharpness: true },
            removeItem: ["bedwars:wooden_sword"],
        },
    },
    /** 钻石剑，3 绿宝石（非 8 队）或 4 绿宝石（8 队） -> 1 钻石剑 @type {BedwarsItemShopitemInfo} */
    diamondSword: {
        description: {
            format: "item",
            category: ShopitemCategory.melee,
        },
        component: {
            id: "diamond_sword",
            amount: 1,
            resource: { type: ResourceType.emerald, amount: 3, amountInSolo: 4 },
            enchantment: { applySharpness: true },
            removeItem: ["bedwars:wooden_sword"],
        },
    },
    /** 击退棒，5 金锭 -> 1 击退棒 @type {BedwarsItemShopitemInfo} */
    knockbackStick: {
        description: {
            format: "item",
            category: ShopitemCategory.melee,
        },
        component: {
            id: "knockback_stick",
            amount: 1,
            resource: { type: ResourceType.gold, amount: 5 },
            enchantment: { list: [{ id: "knockback", level: 1 }] },
        },
    },

    // ===== 盔甲 =====

    /** 永久的锁链盔甲，24 铁锭 -> 1 永久的锁链盔甲 @type {BedwarsItemShopitemInfo} */
    chainArmor: {
        description: {
            format: "item",
            category: ShopitemCategory.armor,
            description: ["每次重生时，会获得锁链护腿和锁链靴子。"],
            isArmor: true,
        },
        component: {
            id: "chain_armor",
            amount: 1,
            resource: { type: ResourceType.iron, amount: 24 },
            // enchantment: { applyFeatherFalling: true }, （该物品是永久性物品，指定此参数无效）,
            tier: { tier: 2 }
        },
    },
    /** 永久的铁盔甲，12 金锭 -> 1 永久的铁盔甲 @type {BedwarsItemShopitemInfo} */
    ironArmor: {
        description: {
            format: "item",
            category: ShopitemCategory.armor,
            description: ["每次重生时，会获得铁护腿和铁靴子。"],
            isQuickBuy: true,
            isArmor: true,
        },
        component: {
            id: "iron_armor",
            amount: 1,
            resource: { type: ResourceType.gold, amount: 12 },
            // enchantment: { applyFeatherFalling: true }, （该物品是永久性物品，指定此参数无效）
            tier: { tier: 3 }
        },
    },
    /** 永久的钻石盔甲，6 绿宝石 -> 1 永久的钻石盔甲 @type {BedwarsItemShopitemInfo} */
    diamondArmor: {
        description: {
            format: "item",
            category: ShopitemCategory.armor,
            description: ["每次重生时，会获得钻石护腿和钻石靴子。"],
            isArmor: true,
        },
        component: {
            id: "diamond_armor",
            amount: 1,
            resource: { type: ResourceType.emerald, amount: 6 },
            // enchantment: { applyFeatherFalling: true }, （该物品是永久性物品，指定此参数无效）
            tier: { tier: 4 },
        },
    },

    // ===== 工具 =====

    /** 永久的剪刀，20 铁锭 -> 1 永久的剪刀 @type {BedwarsItemShopitemInfo} */
    shears: {
        description: {
            format: "item",
            category: ShopitemCategory.tools,
            description: ["适用于破坏羊毛，每次重生时会获得剪刀。"],
            isShears: true,
        },
        component: {
            id: "shears",
            amount: 1,
            resource: { type: ResourceType.iron, amount: 20 },
        },
    },
    /** 镐 @type {BedwarsItemShopitemInfo} */
    pickaxe: {
        description: {
            format: "itemGroup",
            category: ShopitemCategory.tools,
            isQuickBuy: true,
            isPickaxe: true,
        },
        components: [
            {
                id: "wooden_pickaxe",
                amount: 1,
                resource: { type: ResourceType.iron, amount: 10 },
                tier: { tier: 1, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "iron_pickaxe",
                amount: 1,
                resource: { type: ResourceType.iron, amount: 10 },
                removeItem: ["bedwars:wooden_pickaxe"],
                tier: { tier: 2, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "golden_pickaxe",
                amount: 1,
                resource: { type: ResourceType.gold, amount: 3 },
                removeItem: ["bedwars:wooden_pickaxe", "bedwars:iron_pickaxe"],
                tier: { tier: 3, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "diamond_pickaxe",
                amount: 1,
                resource: { type: ResourceType.gold, amount: 6 },
                removeItem: ["bedwars:wooden_pickaxe", "bedwars:iron_pickaxe", "bedwars:golden_pickaxe"],
                tier: { tier: 4, showCurrentTier: true, loseTierUponDeath: true },
            }
        ],
    },
    /** 斧 @type {BedwarsItemShopitemInfo} */
    axe: {
        description: {
            format: "itemGroup",
            category: ShopitemCategory.tools,
            isQuickBuy: true,
            isAxe: true,
        },
        components: [
            {
                id: "wooden_axe",
                amount: 1,
                resource: { type: ResourceType.iron, amount: 10 },
                // enchantment: { applySharpness: true }, （该物品是永久性物品，指定此参数无效）
                tier: { tier: 1, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "stone_axe",
                amount: 1,
                resource: { type: ResourceType.iron, amount: 10 },
                // enchantment: { applySharpness: true }, （该物品是永久性物品，指定此参数无效）
                removeItem: ["bedwars:wooden_axe"],
                tier: { tier: 2, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "iron_axe",
                amount: 1,
                resource: { type: ResourceType.gold, amount: 3 },
                // enchantment: { applySharpness: true }, （该物品是永久性物品，指定此参数无效）
                removeItem: ["bedwars:wooden_axe", "bedwars:stone_axe"],
                tier: { tier: 3, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "diamond_axe",
                amount: 1,
                resource: { type: ResourceType.gold, amount: 6 },
                // enchantment: { applySharpness: true }, （该物品是永久性物品，指定此参数无效）
                removeItem: ["bedwars:wooden_axe", "bedwars:stone_axe", "bedwars:iron_axe"],
                tier: { tier: 4, showCurrentTier: true, loseTierUponDeath: true },
            }
        ],
    },

    // ===== 远程 =====

    /** 箭，2 金锭 -> 6 箭 @type {BedwarsItemShopitemInfo} */
    arrow: {
        description: {
            format: "item",
            category: ShopitemCategory.ranged,
            isQuickBuy: true,
        },
        component: {
            id: "arrow",
            amount: 6,
            resource: { type: ResourceType.gold, amount: 2 },
            realItemId: { isVanilla: true },
        },
    },
    /** 弓，12 金锭 -> 1 弓 @type {BedwarsItemShopitemInfo} */
    bow: {
        description: {
            format: "item",
            category: ShopitemCategory.ranged,
            isQuickBuy: true,
        },
        component: {
            id: "bow",
            amount: 1,
            resource: { type: ResourceType.gold, amount: 12 },
            realItemId: { isVanilla: true },
        },
    },
    /** 弓（力量 I），20 金锭 -> 1 弓（力量 I） @type {BedwarsItemShopitemInfo} */
    bowPower: {
        description: {
            format: "item",
            category: ShopitemCategory.ranged,
        },
        component: {
            id: "bow_power",
            amount: 1,
            resource: { type: ResourceType.gold, amount: 20 },
            realItemId: { id: "minecraft:bow" },
            enchantment: { list: [{ id: "power", level: 1 }] },
        },
    },
    /** 弓（力量 I，冲击 I），6 绿宝石 -> 1 弓（力量 I，冲击 I） @type {BedwarsItemShopitemInfo} */
    bowPowerPunch: {
        description: {
            format: "item",
            category: ShopitemCategory.ranged,
        },
        component: {
            id: "bow_power_punch",
            amount: 1,
            resource: { type: ResourceType.emerald, amount: 6 },
            realItemId: { id: "minecraft:bow" },
            enchantment: { list: [{ id: "power", level: 1 }, { id: "punch", level: 1 }] },
        },
    },

    // ===== 药水 =====

    /** 速度药水，1 绿宝石 -> 1 速度药水 @type {BedwarsItemShopitemInfo} */
    speedPotion: {
        description: {
            format: "item",
            category: ShopitemCategory.potions,
            description: ["§9速度 II（0:30）。"],
        },
        component: {
            id: "potion_speed",
            amount: 1,
            resource: { type: ResourceType.emerald, amount: 1 },
            lore: ["§r§9迅捷 II (0:30)"],
        },
    },
    /** 跳跃药水，1 绿宝石 -> 1 跳跃药水 @type {BedwarsItemShopitemInfo} */
    jumpBoostPotion: {
        description: {
            format: "item",
            category: ShopitemCategory.potions,
            description: ["§9跳跃提升 V（0:45）。"],
        },
        component: {
            id: "potion_jump_boost",
            amount: 1,
            resource: { type: ResourceType.emerald, amount: 1 },
            lore: ["§r§9跳跃提升 V (0:45)"],
        },
    },
    /** 隐身药水，2 绿宝石 -> 1 隐身药水 @type {BedwarsItemShopitemInfo} */
    invisibilityPotion: {
        description: {
            format: "item",
            category: ShopitemCategory.potions,
            description: ["§9完全隐身（0:30）。"],
            isQuickBuy: true,
        },
        component: {
            id: "potion_invisibility",
            amount: 1,
            resource: { type: ResourceType.emerald, amount: 2 },
            lore: ["§r§9隐身 (0:30)"],
        },
    },

    // ===== 实用道具 =====

    /** 金苹果，3 金锭 -> 1 金苹果 @type {BedwarsItemShopitemInfo} */
    goldenApple: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["全面治愈。"],
            isQuickBuy: true,
        },
        component: {
            id: "golden_apple",
            amount: 1,
            resource: { type: ResourceType.gold, amount: 3 },
            realItemId: { isVanilla: true }
        },
    },
    /** 床虱，24 铁锭 -> 1 床虱 @type {BedwarsItemShopitemInfo} */
    bedBug: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["在雪球着陆的地方生成蠹虫，", "用于分散敌人注意力，持续15秒。"],
        },
        component: {
            id: "bed_bug",
            amount: 1,
            resource: { type: ResourceType.iron, amount: 24 },
        },
    },
    /** 梦境守护者，120 铁锭 -> 1 梦境守护者 @type {BedwarsItemShopitemInfo} */
    dreamDefender: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["铁傀儡帮你守卫基地，", "持续4分钟。"],
        },
        component: {
            id: "dream_defender",
            amount: 1,
            resource: { type: ResourceType.iron, amount: 120 },
        },
    },
    /** 火球，40 铁锭 -> 1 火球 @type {BedwarsItemShopitemInfo} */
    fireball: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["右键发射！击飞在桥上行走的敌人！"],
            isQuickBuy: true,
        },
        component: {
            id: "fireball",
            amount: 1,
            resource: { type: ResourceType.iron, amount: 40 },
        },
    },
    /** TNT，8 金锭（非 8 队）或 4 金锭（8 队） -> 1 TNT @type {BedwarsItemShopitemInfo} */
    tnt: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["瞬间点燃，适用于摧毁沿途防御工事！"],
            isQuickBuy: true,
        },
        component: {
            id: "tnt",
            amount: 1,
            resource: { type: ResourceType.gold, amount: 8, amountInSolo: 4 },
        },
    },
    /** 末影珍珠，4 绿宝石 -> 1 末影珍珠 @type {BedwarsItemShopitemInfo} */
    enderPearl: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["入侵敌人基地的最快方法。"],
        },
        component: {
            id: "ender_pearl",
            amount: 1,
            resource: { type: ResourceType.emerald, amount: 4 },
            realItemId: { isVanilla: true },
        },
    },
    /** 水桶，3 金锭（非 8 队）或 2 金锭（8 队） -> 1 水桶 @type {BedwarsItemShopitemInfo} */
    waterBucket: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["能很好地降低来犯敌人的速度。", "也可以抵御来自TNT的伤害。"],
        },
        component: {
            id: "water_bucket",
            amount: 1,
            resource: { type: ResourceType.gold, amount: 3, amountInSolo: 2 },
            realItemId: { isVanilla: true },
        },
    },
    /** 搭桥蛋，1 绿宝石 -> 1 搭桥蛋 @type {BedwarsItemShopitemInfo} */
    bridgeEgg: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["扔出蛋后，会在其飞行轨迹上生成一座桥。"],
        },
        component: {
            id: "bridge_egg",
            amount: 1,
            resource: { type: ResourceType.emerald, amount: 1 },
        },
    },
    /** 魔法牛奶，4 金锭 -> 1 魔法牛奶 @type {BedwarsItemShopitemInfo} */
    magicMilk: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["使用后，30秒内避免触发陷阱。"],
            isQuickBuy: true,
        },
        component: {
            id: "magic_milk",
            amount: 1,
            resource: { type: ResourceType.gold, amount: 4 },
        },
    },
    /** 海绵，3 金锭（非 8 队）或 2 金锭（8 队） -> 4 海绵 @type {BedwarsItemShopitemInfo} */
    sponge: {
        description: {
            format: "item",
            category: ShopitemCategory.utility,
            description: ["用于吸收水分。"],
        },
        component: {
            id: "sponge",
            amount: 4,
            resource: { type: ResourceType.gold, amount: 3, amountInSolo: 2 },
            realItemId: { isVanilla: true }
        },
    },
    // /** 紧凑式速建塔，24 铁锭 -> 1 紧凑式速建塔 @type {BedwarsItemShopitemInfo} */
    // conpactPopUpTower: {
    //     description: {
    //         format: "item",
    //         category: ShopitemCategory.utility,
    //         description: ["建造一座速建塔！"],
    //     },
    //     component: {
    //         id: "conpactPopUpTower",
    //         amount: 1,
    //         resource: { type: ResourceType.iron, amount: 24 },
    //     },
    // },

    // ===== 轮换道具 =====

    /** 床，2 钻石 -> 1 床 @type {BedwarsItemShopitemInfo} */
    bed: {
        description: {
            format: "item",
            category: ShopitemCategory.rotatingItems,
            description: ["在基岩上放置床以夺取点位，", "使敌方更快地减少分数！"],
            classicModeEnabled: false,
        },
        component: {
            id: "bed",
            amount: 1,
            resource: { type: ResourceType.diamond, amount: 2 },
            realItemId: { isColored: true }
        }
    },

};

/** 团队升级类商店物品基本信息 */
export const upgradeShopitemData = {

    // --- 团队升级 ---

    /** 锋利附魔 @type {BedwarsUpgradeShopitemInfo} */
    sharpenedSwords: {
        description: {
            format: "item",
            category: "upgrade",
            description: ["你方所有成员的剑和斧将永久获得锋利I附魔！"],
        },
        component: {
            shopitemId: "bedwars:upgrade_sharpened_swords",
            amount: 1,
            resource: { type: ResourceType.diamond, amount: 8, amountInSolo: 4 },
            tier: { tier: 1, checkUpgradeTier: "sharpenedSwords", },
        }
    },
    /** 盔甲强化 @type {BedwarsUpgradeShopitemInfo} */
    reinforcedArmor: {
        description: {
            format: "itemGroup",
            category: "upgrade",
            description: ["己方所有成员的盔甲将永久获得保护附魔！"],
        },
        components: [
            {
                shopitemId: "bedwars:upgrade_reinforced_armor_tier_1",
                amount: 1,
                resource: { type: ResourceType.diamond, amount: 5, amountInSolo: 2 },
                tier: { tier: 1, checkUpgradeTier: "reinforcedArmor", thisTierDescription: ["保护 I"] },
            },
            {
                shopitemId: "bedwars:upgrade_reinforced_armor_tier_2",
                amount: 2,
                resource: { type: ResourceType.diamond, amount: 10, amountInSolo: 4 },
                tier: { tier: 2, checkUpgradeTier: "reinforcedArmor", thisTierDescription: ["保护 II"] },
            },
            {
                shopitemId: "bedwars:upgrade_reinforced_armor_tier_3",
                amount: 3,
                resource: { type: ResourceType.diamond, amount: 20, amountInSolo: 8 },
                tier: { tier: 3, checkUpgradeTier: "reinforcedArmor", thisTierDescription: ["保护 III"] },
            },
            {
                shopitemId: "bedwars:upgrade_reinforced_armor_tier_4",
                amount: 4,
                resource: { type: ResourceType.diamond, amount: 30, amountInSolo: 16 },
                tier: { tier: 4, checkUpgradeTier: "reinforcedArmor", thisTierDescription: ["保护 IV"] },
            }
        ]
    },
    /** 疯狂矿工 @type {BedwarsUpgradeShopitemInfo} */
    maniacMiner: {
        description: {
            format: "itemGroup",
            category: "upgrade",
            description: ["己方所有成员获得永久急迫效果！"],
        },
        components: [
            {
                shopitemId: "bedwars:upgrade_maniac_miner_tier_1",
                amount: 1,
                resource: { type: ResourceType.diamond, amount: 4, amountInSolo: 2 },
                tier: { tier: 1, checkUpgradeTier: "maniacMiner", thisTierDescription: ["急迫 I"] },
            },
            {
                shopitemId: "bedwars:upgrade_maniac_miner_tier_2",
                amount: 2,
                resource: { type: ResourceType.diamond, amount: 6, amountInSolo: 4 },
                tier: { tier: 2, checkUpgradeTier: "maniacMiner", thisTierDescription: ["急迫 II"] },
            }
        ]
    },
    /** 锻炉 @type {BedwarsUpgradeShopitemInfo} */
    forge: {
        description: {
            format: "itemGroup",
            category: "upgrade",
            description: ["升级你岛屿资源池的生成速度和最大容量。"],
        },
        components: [
            {
                shopitemId: "bedwars:upgrade_forge_tier_1",
                amount: 1,
                resource: { type: ResourceType.diamond, amount: 4, amountInSolo: 2 },
                tier: { tier: 1, checkUpgradeTier: "forge", thisTierDescription: ["+50%资源"] },
            },
            {
                shopitemId: "bedwars:upgrade_forge_tier_2",
                amount: 2,
                resource: { type: ResourceType.diamond, amount: 8, amountInSolo: 4 },
                tier: { tier: 2, checkUpgradeTier: "forge", thisTierDescription: ["+100%资源"] },
            },
            {
                shopitemId: "bedwars:upgrade_forge_tier_3",
                amount: 3,
                resource: { type: ResourceType.diamond, amount: 12, amountInSolo: 6 },
                tier: { tier: 3, checkUpgradeTier: "forge", thisTierDescription: ["生成绿宝石"] },
            },
            {
                shopitemId: "bedwars:upgrade_forge_tier_4",
                amount: 4,
                resource: { type: ResourceType.diamond, amount: 16, amountInSolo: 8 },
                tier: { tier: 4, checkUpgradeTier: "forge", thisTierDescription: ["+200%资源"] },
            }
        ]
    },
    /** 治愈池 @type {BedwarsUpgradeShopitemInfo} */
    healPool: {
        description: {
            format: "item",
            category: "upgrade",
            description: ["基地附近的队伍成员将获得生命恢复效果！"],
        },
        component: {
            shopitemId: "bedwars:upgrade_heal_pool",
            amount: 1,
            resource: { type: ResourceType.diamond, amount: 3, amountInSolo: 1 },
            tier: { tier: 1, checkUpgradeTier: "healPool" }
        }
    },
    /** 缓冲靴子 @type {BedwarsUpgradeShopitemInfo} */
    cushionedBoots: {
        description: {
            format: "itemGroup",
            category: "upgrade",
            description: ["你队伍的靴子获得了永久摔落缓冲！"],
        },
        components: [
            {
                shopitemId: "bedwars:upgrade_cushioned_boots_tier_1",
                amount: 1,
                resource: { type: ResourceType.diamond, amount: 2, amountInSolo: 1 },
                tier: { tier: 1, checkUpgradeTier: "cushionedBoots", thisTierDescription: ["摔落缓冲 I"] },
            },
            {
                shopitemId: "bedwars:upgrade_cushioned_boots_tier_2",
                amount: 2,
                resource: { type: ResourceType.diamond, amount: 4, amountInSolo: 2 },
                tier: { tier: 2, checkUpgradeTier: "cushionedBoots", thisTierDescription: ["摔落缓冲 II"] },
            }
        ]
    },
    /** 末影龙增益 @type {BedwarsUpgradeShopitemInfo} */
    dragonBuff: {
        description: {
            format: "item",
            category: "upgrade",
            description: ["你的队伍在绝杀模式中将会有两条末影龙，而不是一条！"],
            classicModeEnabled: false,
            captureModeEnabled: false,
        },
        component: {
            shopitemId: "bedwars:upgrade_dragon_buff",
            amount: 1,
            resource: { type: ResourceType.diamond, amount: 5 },
            tier: { tier: 1, checkUpgradeTier: "dragonBuff" },
        }
    },

    // --- 陷阱 ---

    /** 失明陷阱 @type {BedwarsUpgradeShopitemInfo} */
    blindnessTrap: {
        description: {
            format: "item",
            category: "trap",
            description: ["造成失明与缓慢效果，持续8秒。"],
        },
        component: {
            shopitemId: "bedwars:upgrade_blindness_trap",
            amount: 1,
            resource: { type: ResourceType.diamond, amount: 1 },
        }
    },
    /** 反击陷阱 @type {BedwarsUpgradeShopitemInfo} */
    counterOffensiveTrap: {
        description: {
            format: "item",
            category: "trap",
            description: ["赋予基地附近的队友速度 II 与跳跃提升 II", "效果，持续15秒。"],
        },
        component: {
            shopitemId: "bedwars:upgrade_counter_offensive_trap",
            amount: 1,
            resource: { type: ResourceType.diamond, amount: 1 },
        },
    },
    /** 显影陷阱 @type {BedwarsUpgradeShopitemInfo} */
    revealTrap: {
        description: {
            format: "item",
            category: "trap",
            description: ["显示隐身的玩家，", "及其名称与队伍名。"],
        },
        component: {
            shopitemId: "bedwars:upgrade_reveal_trap",
            amount: 1,
            resource: { type: ResourceType.diamond, amount: 1 },
        },
    },
    /** 挖掘疲劳陷阱 @type {BedwarsUpgradeShopitemInfo} */
    minerFatigueTrap: {
        description: {
            format: "item",
            category: "trap",
            description: [ "造成挖掘疲劳效果，持续8秒。" ],
        },
        component: {
            shopitemId: "bedwars:upgrade_miner_fatigue_trap",
            amount: 1,
            resource: { type: ResourceType.diamond, amount: 1 },
        },
    },

};
