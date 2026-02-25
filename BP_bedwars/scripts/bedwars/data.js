// *-*-*-*-*-*-* 起床战争数据 *-*-*-*-*-*-*
// 此处仅记录纯数据，不带有任何功能

// ===== 模块导入 =====

import * as lib from "./lib";
import * as minecraft from "@minecraft/server";

// ===== enum 定义 =====

/** 所有起床战争模式
 * @enum {string}
 */
export const BedwarsModeType = {
    /** 经典模式 */ Classic: "classic",
    /** 夺点模式 */ Capture: "capture",
    /** 经验模式 */ Experience: "experience",
    /** 疾速模式 */ Rush: "rush",
}

/** 所有可用的队伍
 * @readonly
 * @enum {string}
 */
export const BedwarsTeamType = {
    Red: "red",
    Blue: "blue",
    Yellow: "yellow",
    Green: "green",
    Pink: "pink",
    Cyan: "cyan",
    White: "white",
    Gray: "gray",
    Purple: "purple",
    Brown: "brown",
    Orange: "orange",
};

/** 商店物品类型
 * @enum {string}
 */
export const BedwarsItemShopitemCategory = {
    QuickBuy: "quickBuy",
    Blocks: "blocks",
    Melee: "melee",
    Armor: "armor",
    Tools: "tools",
    Ranged: "ranged",
    Potions: "potions",
    Utility: "utility",
    RotatingItems: "rotatingItems",
};

/** 资源类型
 * @enum {string}
 */
export const BedwarsResourceType = {
    Iron: "iron",
    Gold: "gold",
    Diamond: "diamond",
    Emerald: "emerald",
    Level: "level",
};

/** 获取资源数据
 * @param {BedwarsResourceType} resourceType 
 */
export function resourceData(resourceType) {
    switch (resourceType) {
        case BedwarsResourceType.Iron: return { type: BedwarsResourceType.Iron, typeId: "bedwars:iron_ingot", name: "铁锭", color: "§f" };
        case BedwarsResourceType.Gold: return { type: BedwarsResourceType.Gold, typeId: "bedwars:gold_ingot", name: "金锭", color: "§6" };
        case BedwarsResourceType.Diamond: return { type: BedwarsResourceType.Diamond, typeId: "bedwars:diamond", name: "钻石", color: "§b" };
        case BedwarsResourceType.Emerald: return { type: BedwarsResourceType.Emerald, typeId: "bedwars:emerald", name: "绿宝石", color: "§2" };
        case BedwarsResourceType.Level: return { type: BedwarsResourceType.Level, typeId: "", name: "经验", color: "§a" };
        default: return { type: "", typeId: "", name: "", color: "§r" };
    };
}

/** 所有团队升级
 * @enum {string}
 */
export const BedwarsTeamUpgradeType = {
    SharpenedSwords: "sharpenedSwords",
    ReinforcedArmor: "reinforcedArmor",
    ManiacMiner: "maniacMiner",
    Forge: "forge",
    HealPool: "healPool",
    CushionedBoots: "cushionedBoots",
    DragonBuff: "dragonBuff",
};

/** 所有陷阱
 * @enum {string}
 */
export const BedwarsTrapType = {
    BlindnessTrap: "blindnessTrap",
    CounterOffensiveTrap: "counterOffensiveTrap",
    RevealTrap: "revealTrap",
    MinerFatigueTrap: "minerFatigueTrap",
};

// ===== 地图数据 =====

// 地图基本信息
/**
 * @typedef BedwarsMapData 定义一张地图的基本信息
 * @property {BedwarsMapDescription} description 地图描述
 * @property {BedwarsMapComponent} components 地图使用的组件
 * 
 * @typedef BedwarsMapDescription 地图描述
 * @property {string} id ID，它将控制地图的运行方式
 * @property {string} name 名称，它将按照给定名称在游戏开始前显示出来
 * @property {BedwarsModeType} mode 模式，该地图将按照什么模式执行
 * @property {boolean} [isSolo] 是否为单挑模式（通常意义上是 8 队模式），单挑模式会影响资源的生成速度和物资售价 | 默认值：false
 *
 * @typedef BedwarsMapComponent 地图组件
 * @property {BedwarsMapResourceComponent} resource 规定地图的资源点运行
 * @property {BedwarsMapTeamComponent} team 规定地图的队伍信息
 * @property {BedwarsMapIslandComponent[]} island 规定地图的非队伍岛屿
 * @property {BedwarsMapSizeComponent} [size] 规定地图大小，包括长、宽、高的规定
 * @property {BedwarsMapCaptureModeComponent} [capture] （游戏使用夺点模式后必须使用，仅夺点模式可用）规定夺点模式的有效床点位等
 * @property {string[]} [removeItemEntity] 地图将移除物品掉落物的类型
 */

// 地图组件及其附属信息
/**
 * @typedef BedwarsMapResourceComponent 地图资源组件
 * @property {minecraft.Vector3[]} diamondSpawnerLocation 钻石生成点位置（请选定生成点下方钻石块所在的位置）
 * @property {minecraft.Vector3[]} emeraldSpawnerLocation 绿宝石生成点位置（请选定生成点下方绿宝石块所在的位置）
 * @property {boolean} [distributeResource] 生成资源时是否分散，如果是则在每次生成时 3*3 地分散式生成资源 | 默认值：true
 * @property {boolean} [clearVelocity] 生成资源时是否分散，如果是则在每次生成时 3*3 地分散式生成资源 | 默认值：true
 * @property {number} [ironSpawnTimes] 一次最多生成铁的数量 | 默认值：5
 * 
 * @typedef BedwarsMapSizeComponent 地图尺寸组件
 * @property {number} [sizeX] 地图的 x 方向半边长大小 | 默认值：105
 * @property {number} [sizeZ] 地图的 z 方向半边长大小 | 默认值：105
 * @property {number} [heightLimitMax] 最高高度限制，在高于此高度的位置放置方块时会阻止之，并且同时规定该地图中旁观模式的玩家重生在何高度（高于该高度 7 格） | 默认值：110
 * @property {number} [heightLimitMin] 最低高度限制，在低于此高度的位置放置方块时会阻止之 | 默认值：50
 * 
 * @typedef BedwarsMapTeamComponent 地图队伍组件
 * @property {TeamData[]} teamData 定义各队伍的信息
 * @property {number} islandLoadTime 定义岛屿加载时间，单位：秒，必须定义结构"(地图 ID):team_island"，推荐以结构文件大小为基准，每 100 kB 加 1 秒
 * @property {number} [healPoolRadius] 治愈池半径 | 默认值：20
 * @property {boolean} [playerCouldIntoShop] 玩家是否能够进入商店，若设置为 false 则在玩家接近商人后将玩家传送出去 | 默认值：true
 * 
 * @typedef BedwarsMapIslandComponent 地图岛屿组件（非队伍岛屿）
 * @property {string} id 结构名称，在加载时会自动查找"(地图 ID):(此 id)"结构并加载之
 * @property {number} loadTime 定义岛屿加载时间，单位：秒，必须定义结构"(地图 ID):(此 id)"，推荐以结构文件大小为基准，每 100 kB 加 1 秒
 * @property {StructureLoadData[]} islandData 定义该队伍的岛屿加载信息
 * 
 * @typedef BedwarsMapCaptureModeComponent 地图夺点模式组件
 * @property {ValidBedData[]} validBeds 所有床的有效点位
 * @property {number} score 开始游戏时，每队的分数
 * 
 * @typedef TeamData 队伍数据
 * @property {BedwarsTeamType} id 定义该队伍的 ID
 * @property {BedData} bed 定义该队伍的床的信息
 * @property {minecraft.Vector3} resourceLocation 定义该队伍的资源点的位置，若为分散式生成资源应选取中心点
 * @property {minecraft.Vector3} spawnpointLocation 定义该队伍的重生点的位置，若玩家能够重生则重生到此位置上
 * @property {minecraft.Vector3} chestLocation 定义该队伍的箱子的位置，在该队伍未淘汰时禁止其他队伍的玩家打开
 * @property {StructureLoadData} island 定义该队伍的岛屿加载信息
 * @property {FlagLocationData} [flagLocation] 定义该队伍的旗帜位置起始点与终止点，若不指定则不更换旗帜的颜色 | 默认值：——
 * @property {TraderData[]} trader 定义该队伍的商人信息
 * 
 * @typedef BedData 床信息
 * @property {minecraft.Vector3} location 定义床脚的位置
 * @property {minecraft.StructureRotation} [rotation] 定义床的旋转
 * 
 * @typedef FlagLocationData 旗帜位置信息
 * @property {minecraft.Vector3} from 定义该队伍的旗帜位置起始点
 * @property {minecraft.Vector3} to 定义该队伍的旗帜位置终止点
 * 
 * @typedef TraderData 商人信息
 * @property {minecraft.Vector3} location 商人位置
 * @property {number} rotation 商人旋转角度，为 0°~360°
 * @property {"item"|"upgrade"} type 商人信息
 * @property {number} [skin] 皮肤 ID，若未指定则随机指定皮肤 | 默认值：0~30 间的随机值
 * @property {minecraft.Vector3} [teleportNearbyPlayerLocation] 当玩家过于接近商人后，将玩家传送到何处，若未指定则不做任何操作 | 默认值：——
 * 
 * @typedef StructureLoadData 结构加载数据
 * @property {minecraft.Vector3} location 定义该岛屿结构加载位置
 * @property {minecraft.StructureMirrorAxis} [mirror] 定义该岛屿的结构镜像加载
 * @property {minecraft.StructureRotation} [rotation] 定义该岛屿的结构旋转加载
 * 
 * @typedef ValidBedData 有效床数据（夺点模式）
 * @property {minecraft.Vector3} location 床的位置
 * @property {BedwarsTeamType} [teamId] 该床归何队伍所有
 */

/** 所有地图数据 */
export const mapData = {

    /** 经典模式地图数据 */
    classic: {

        /** 2 队地图 */
        twoTeams: {

            /** 地图：神秘 @type {BedwarsMapData} */
            cryptic: {
                description: {
                    id: "cryptic",
                    name: "神秘",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: -70, y: 78, z: 0 }, { x: 70, y: 73, z: 0 }],
                        emeraldSpawnerLocation: [{ x: 21, y: 68, z: 0 }, { x: -25, y: 81, z: 0 }],
                        distributeResource: false,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 2, y: 77, z: 73 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 2, y: 78, z: 90 },
                                spawnpointLocation: { x: 2, y: 78, z: 85 },
                                chestLocation: { x: -1, y: 78, z: 81 },
                                island: { location: { x: -12, y: 61, z: 63 }, },
                                flagLocation: { from: { x: 8, y: 84, z: 78 }, to: { x: -4, y: 87, z: 92 }, },
                                trader: [
                                    { location: { x: -2, y: 78, z: 86 }, rotation: 270, type: "item" },
                                    { location: { x: 6, y: 78, z: 86 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 2, y: 77, z: -73 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 2, y: 78, z: -90 },
                                spawnpointLocation: { x: 2, y: 78, z: -85 },
                                chestLocation: { x: -1, y: 78, z: -81 },
                                island: { location: { x: -12, y: 61, z: -95 }, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: -4, y: 84, z: 78 }, to: { x: 8, y: 87, z: -92 }, },
                                trader: [
                                    { location: { x: 6, y: 78, z: -86 }, rotation: 90, type: "item" },
                                    { location: { x: -3, y: 78, z: -86 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                        ],
                        islandLoadTime: 2,
                        healPoolRadius: 25,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: 53, y: 49, z: -15 }, },
                                { location: { x: -75, y: 54, z: -15 }, mirror: minecraft.StructureMirrorAxis.Z, }
                            ],
                        },
                        {
                            id: "center_island_1",
                            loadTime: 17,
                            islandData: [
                                { location: { x: -33, y: 41, z: -29 }, }
                            ],
                        },
                        {
                            id: "center_island_2",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 31, y: 41, z: -29 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 102,
                        heightLimitMin: 67,
                    }
                },
            },

            /** 地图：极寒 @type {BedwarsMapData} */
            frost: {
                description: {
                    id: "frost",
                    name: "极寒",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 38, y: 75, z: -10 }, { x: -38, y: 75, z: 10 }],
                        emeraldSpawnerLocation: [{ x: 0, y: 76, z: -12 }, { x: 0, y: 76, z: 12 }],
                        distributeResource: false,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 72, z: 59 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 72, z: 75 },
                                spawnpointLocation: { x: 0, y: 72, z: 70 },
                                chestLocation: { x: 4, y: 72, z: 68 },
                                island: { location: { x: -13, y: 55, z: 55 }, },
                                trader: [
                                    { location: { x: -6, y: 72, z: 71 }, rotation: 270, type: "item" },
                                    { location: { x: 6, y: 72, z: 71 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 0, y: 72, z: -59 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 72, z: -75 },
                                spawnpointLocation: { x: 0, y: 72, z: -70 },
                                chestLocation: { x: 4, y: 72, z: -68 },
                                island: { location: { x: -13, y: 55, z: -81 }, mirror: minecraft.StructureMirrorAxis.X, },
                                trader: [
                                    { location: { x: 6, y: 72, z: -71 }, rotation: 90, type: "item" },
                                    { location: { x: -6, y: 72, z: -71 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                        ],
                        islandLoadTime: 2,
                        healPoolRadius: 15,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 29, y: 60, z: -20 }, },
                                { location: { x: -46, y: 60, z: -2 }, rotation: minecraft.StructureRotation.Rotate180, }
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 4,
                            islandData: [
                                { location: { x: -13, y: 56, z: -22 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 97,
                        heightLimitMin: 69,
                    }
                },
            },

            /** 地图：花园 @type {BedwarsMapData} */
            garden: {
                description: {
                    id: "garden",
                    name: "花园",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 0, y: 77, z: -52 }, { x: 0, y: 77, z: 52 }],
                        emeraldSpawnerLocation: [{ x: -21, y: 76, z: -21 }, { x: 21, y: 76, z: 21 }],
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 79, y: 77, z: 0 }, },
                                resourceLocation: { x: 98, y: 79, z: 0 },
                                spawnpointLocation: { x: 94, y: 79, z: 0 },
                                chestLocation: { x: 91, y: 79, z: 4 },
                                island: { location: { x: 73, y: 69, z: -15 }, },
                                flagLocation: { from: { x: 91, y: 79, z: -8 }, to: { x: 91, y: 84, z: 8 }, },
                                trader: [
                                    { location: { x: 94, y: 79, z: 8 }, rotation: 180, type: "item" },
                                    { location: { x: 94, y: 79, z: -8 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: -79, y: 77, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -98, y: 79, z: 0 },
                                spawnpointLocation: { x: -94, y: 79, z: 0 },
                                chestLocation: { x: -91, y: 79, z: 4 },
                                island: { location: { x: -104, y: 69, z: -15 }, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: -91, y: 79, z: 8 }, to: { x: -91, y: 84, z: -8 }, },
                                trader: [
                                    { location: { x: -94, y: 79, z: -8 }, rotation: 0, type: "item" },
                                    { location: { x: -94, y: 79, z: 8 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                        ],
                        islandLoadTime: 2,
                        healPoolRadius: 21,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: -20, y: 64, z: -65 }, },
                                { location: { x: -20, y: 64, z: 40 }, mirror: minecraft.StructureMirrorAxis.X, }
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 12,
                            islandData: [
                                { location: { x: -30, y: 54, z: -30 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 97,
                        heightLimitMin: 67,
                    }
                },
            },

            /** 地图：狮庙 @type {BedwarsMapData} */
            lionTemple: {
                description: {
                    id: "lion_temple",
                    name: "狮庙",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 53, y: 83, z: 0 }, { x: -58, y: 83, z: 0 }],
                        emeraldSpawnerLocation: [{ x: -20, y: 77, z: 0 }, { x: 17, y: 82, z: 0 }],
                        distributeResource: false,
                        ironSpawnTimes: 1,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -2, y: 73, z: 58 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: -2, y: 75, z: 78 },
                                spawnpointLocation: { x: -2, y: 75, z: 73 },
                                chestLocation: { x: 2, y: 75, z: 68 },
                                island: { location: { x: -13, y: 61, z: 53 }, },
                                flagLocation: { from: { x: 6, y: 74, z: 65 }, to: { x: -10, y: 86, z: 81 }, },
                                trader: [
                                    { location: { x: -7, y: 75, z: 72 }, rotation: 270, type: "item", },
                                    { location: { x: 3, y: 75, z: 72 }, rotation: 90, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: -2, y: 73, z: -58 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -2, y: 75, z: -78 },
                                spawnpointLocation: { x: -2, y: 75, z: -73 },
                                chestLocation: { x: 2, y: 75, z: -68 },
                                island: { location: { x: -13, y: 61, z: -84 }, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: -10, y: 74, z: -65 }, to: { x: 6, y: 86, z: -81 }, },
                                trader: [
                                    { location: { x: 3, y: 75, z: -72 }, rotation: 90, type: "item" },
                                    { location: { x: -7, y: 75, z: -72 }, rotation: 270, type: "upgrade", }
                                ],
                            },
                        ],
                        islandLoadTime: 2,
                        healPoolRadius: 18,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: -69, y: 66, z: -13 }, },
                                { location: { x: 43, y: 66, z: -13 }, rotation: minecraft.StructureRotation.Rotate180, }
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 11,
                            islandData: [
                                { location: { x: -34, y: 55, z: -25 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 100,
                        heightLimitMin: 69,
                    }
                },
            },

            /** 地图：野餐 @type {BedwarsMapData} */
            picnic: {
                description: {
                    id: "picnic",
                    name: "野餐",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 48, y: 63, z: 10 }, { x: -48, y: 63, z: -10 }],
                        emeraldSpawnerLocation: [{ x: -7, y: 68, z: -11 }, { x: 8, y: 68, z: 12 }],
                        distributeResource: false,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 65, z: -62 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 64, z: -78 },
                                spawnpointLocation: { x: 0, y: 64, z: -74 },
                                chestLocation: { x: 3, y: 64, z: -73 },
                                island: { location: { x: -12, y: 55, z: -82 }, },
                                flagLocation: { from: { x: -5, y: 75, z: -72 }, to: { x: 13, y: 81, z: -69 }, },
                                trader: [
                                    { location: { x: 6, y: 64, z: -75.5 }, rotation: 90, type: "item" },
                                    { location: { x: -6, y: 64, z: -75.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 0, y: 65, z: 61 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 64, z: 77 },
                                spawnpointLocation: { x: 0, y: 64, z: 73 },
                                chestLocation: { x: -3, y: 64, z: 72 },
                                island: { location: { x: -14, y: 55, z: 55 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: 5, y: 75, z: 71 }, to: { x: -13, y: 81, z: 68 }, },
                                trader: [
                                    { location: { x: -6, y: 64, z: 74.5 }, rotation: 270, type: "item" },
                                    { location: { x: 6, y: 64, z: 74.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                        ],
                        islandLoadTime: 2,
                        healPoolRadius: 19,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: -63, y: 58, z: -24 }, },
                                { location: { x: 38, y: 58, z: -5 }, rotation: minecraft.StructureRotation.Rotate180, }
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 10,
                            islandData: [
                                { location: { x: -21, y: 49, z: -22 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 90,
                        heightLimitMin: 60,
                    }
                }
            },

            /** 地图：废墟 @type {BedwarsMapData} */
            ruins: {
                description: {
                    id: "ruins",
                    name: "废墟",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: -47, y: 69, z: -10 }, { x: 47, y: 69, z: 10 }],
                        emeraldSpawnerLocation: [{ x: 17, y: 69, z: -6 }, { x: -17, y: 69, z: 6 }],
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -4, y: 71, z: -64 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 72, z: -82 },
                                spawnpointLocation: { x: 0, y: 72, z: -78 },
                                chestLocation: { x: 5, y: 72, z: -76 },
                                island: { location: { x: -15, y: 61, z: -88 }, },
                                flagLocation: { from: { x: -6, y: 76, z: -72 }, to: { x: 6, y: 79, z: -76 }, },
                                trader: [
                                    { location: { x: 6, y: 72, z: -79.5 }, rotation: 90, type: "item" },
                                    { location: { x: -6, y: 72, z: -79.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 4, y: 71, z: 64 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 72, z: 82 },
                                spawnpointLocation: { x: 0, y: 72, z: 78 },
                                chestLocation: { x: -5, y: 72, z: 76 },
                                island: { location: { x: -15, y: 61, z: 59 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: 6, y: 76, z: 72 }, to: { x: -6, y: 79, z: 76 }, },
                                trader: [
                                    { location: { x: -6, y: 72, z: 79.5 }, rotation: 270, type: "item" },
                                    { location: { x: 6, y: 72, z: 79.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                        ],
                        islandLoadTime: 2,
                        healPoolRadius: 20,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: -60, y: 62, z: -22 }, },
                                { location: { x: 35, y: 62, z: -7 }, rotation: minecraft.StructureRotation.Rotate180, }
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 5,
                            islandData: [
                                { location: { x: -24, y: 61, z: -25 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 96,
                        heightLimitMin: 65,
                    }
                }
            }

        },

        /** 4 队地图 */
        fourTeams: {

            /** 水族馆 @type {BedwarsMapData} */
            aquarium: {
                description: {
                    id: "aquarium",
                    name: "水族馆",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: -41, y: 81, z: -39 }, { x: 39, y: 81, z: -41 }, { x: 41, y: 81, z: 39 }, { x: -39, y: 81, z: 41 },],
                        emeraldSpawnerLocation: [{ x: -10, y: 94, z: -11 }, { x: 8, y: 94, z: 11 },],
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 87, z: -48 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 87, z: -64 },
                                spawnpointLocation: { x: 0, y: 87, z: -58 },
                                chestLocation: { x: 3, y: 87, z: -55 },
                                island: { location: { x: -17, y: 81, z: -93 }, },
                                flagLocation: { from: { x: -13, y: 82, z: -89 }, to: { x: 22, y: 104, z: -53 }, },
                                trader: [
                                    { location: { x: 5, y: 87, z: -59.5 }, rotation: 90, type: "item", },
                                    { location: { x: 5, y: 87, z: -57.5 }, rotation: 90, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 48, y: 87, z: 0 }, },
                                resourceLocation: { x: 64, y: 87, z: 0 },
                                spawnpointLocation: { x: 58, y: 87, z: 0 },
                                chestLocation: { x: 55, y: 87, z: 3 },
                                island: { location: { x: 45, y: 81, z: -17 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: 89, y: 82, z: -13 }, to: { x: 53, y: 104, z: 22 }, },
                                trader: [
                                    { location: { x: 59.5, y: 87, z: 5 }, rotation: 180, type: "item", },
                                    { location: { x: 57.5, y: 87, z: 5 }, rotation: 180, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 0, y: 87, z: 48 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 87, z: 64 },
                                spawnpointLocation: { x: 0, y: 87, z: 58 },
                                chestLocation: { x: -3, y: 87, z: 55 },
                                island: { location: { x: -25, y: 81, z: 45 }, rotation: minecraft.StructureRotation.Rotate180 },
                                flagLocation: { from: { x: 13, y: 82, z: 89 }, to: { x: -22, y: 104, z: 53 }, },
                                trader: [
                                    { location: { x: -5, y: 87, z: 59.5 }, rotation: 270, type: "item", },
                                    { location: { x: -5, y: 87, z: 57.5 }, rotation: 270, type: "upgrade", },
                                ]
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -48, y: 87, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -64, y: 87, z: 0 },
                                spawnpointLocation: { x: -58, y: 87, z: 0 },
                                chestLocation: { x: -55, y: 87, z: -3 },
                                island: { location: { x: -93, y: 81, z: -25 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: -89, y: 82, z: 13 }, to: { x: -53, y: 104, z: -22 }, },
                                trader: [
                                    { location: { x: -59.5, y: 87, z: -5 }, rotation: 0, type: "item", },
                                    { location: { x: -57.5, y: 87, z: -5 }, rotation: 0, type: "upgrade", },
                                ]
                            },
                        ],
                        islandLoadTime: 4,
                        healPoolRadius: 20,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: -54, y: 70, z: -55 }, },
                                { location: { x: 31, y: 70, z: -54 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: 31, y: 70, z: 31 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: -55, y: 70, z: 31 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 5,
                            islandData: [
                                { location: { x: -19, y: 66, z: -20 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 112,
                        heightLimitMin: 78,
                    }
                }
            },

            /** 拱形廊道 @type {BedwarsMapData} */
            archway: {
                description: {
                    id: "archway",
                    name: "拱形廊道",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 34, y: 65, z: -49 }, { x: 49, y: 65, z: 34 }, { x: -34, y: 65, z: 49 }, { x: -49, y: 65, z: -34 },],
                        emeraldSpawnerLocation: [{ x: 0, y: 64, z: 0 }, { x: 0, y: 74, z: 0 },],
                        distributeResource: false,
                        ironSpawnTimes: 1,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -15, y: 66, z: -66 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -14, y: 65, z: -79 },
                                spawnpointLocation: { x: -14, y: 65, z: -75 },
                                chestLocation: { x: -11, y: 65, z: -73 },
                                island: { location: { x: -22, y: 62, z: -83 }, },
                                flagLocation: { from: { x: -19, y: 70, z: -70 }, to: { x: -9, y: 83, z: -78 }, },
                                trader: [
                                    { type: "item", location: { x: -9, y: 65, z: -75.5 }, rotation: 90, },
                                    { type: "upgrade", location: { x: -19, y: 65, z: -75.5 }, rotation: 270, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 66, y: 66, z: -15 }, },
                                resourceLocation: { x: 79, y: 65, z: -14 },
                                spawnpointLocation: { x: 75, y: 65, z: -14 },
                                chestLocation: { x: 73, y: 65, z: -11 },
                                island: { location: { x: 62, y: 62, z: -22 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: 70, y: 70, z: -19 }, to: { x: 78, y: 83, z: -9 }, },
                                trader: [
                                    { type: "item", location: { x: 75.5, y: 65, z: -9 }, rotation: 180, },
                                    { type: "upgrade", location: { x: 75.5, y: 65, z: -19 }, rotation: 90, },
                                ]
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 15, y: 66, z: 66 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 14, y: 65, z: 79 },
                                spawnpointLocation: { x: 14, y: 65, z: 75 },
                                chestLocation: { x: 11, y: 65, z: 73 },
                                island: { location: { x: 4, y: 62, z: 62 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: 19, y: 70, z: 70 }, to: { x: 9, y: 83, z: 78 } },
                                trader: [
                                    { type: "item", location: { x: 9, y: 65, z: 75.5 }, rotation: 270, },
                                    { type: "upgrade", location: { x: 19, y: 65, z: 75.5 }, rotation: 90, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -66, y: 66, z: 15 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -79, y: 65, z: 14 },
                                spawnpointLocation: { x: -75, y: 65, z: 14 },
                                chestLocation: { x: -73, y: 65, z: 11 },
                                island: { location: { x: -83, y: 62, z: 4 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: -70, y: 70, z: 19 }, to: { x: -78, y: 83, z: 9 }, },
                                trader: [
                                    { type: "item", location: { x: -75.5, y: 65, z: 9 }, rotation: 90, },
                                    { type: "upgrade", location: { x: -75.5, y: 65, z: 19 }, rotation: 180, },
                                ],
                            },
                        ],
                        islandLoadTime: 1,
                        healPoolRadius: 12,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 29, y: 61, z: -59 }, },
                                { location: { x: 44, y: 61, z: 29 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -44, y: 61, z: 44 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: -59, y: 61, z: -44 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 6,
                            islandData: [
                                { location: { x: -26, y: 58, z: -27 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 91,
                        heightLimitMin: 63,
                    }
                }

            },

            /** 海岸 @type {BedwarsMapData} */
            ashore: {
                description: {
                    id: "ashore",
                    name: "海岸",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 44, y: 63, z: -46 }, { x: 47, y: 63, z: 45 }, { x: -44, y: 63, z: 48 }, { x: -47, y: 63, z: -43 },],
                        emeraldSpawnerLocation: [{ x: 0, y: 64, z: 1 }, { x: 0, y: 83, z: 1 },],
                        distributeResource: false,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 64, z: -65 }, rotation: minecraft.StructureRotation.Rotate270 },
                                chestLocation: { x: 3, y: 63, z: -76 },
                                flagLocation: { from: { x: -10, y: 66, z: -66 }, to: { x: 8, y: 78, z: -76 } },
                                island: { location: { x: -10, y: 53, z: -85 }, rotation: minecraft.StructureRotation.None },
                                resourceLocation: { x: 0, y: 63, z: -81 },
                                spawnpointLocation: { x: 0, y: 63, z: -78 },
                                trader: [
                                    { type: "item", location: { x: 6, y: 63, z: -78.5 }, rotation: 90 },
                                    { type: "upgrade", location: { x: -6, y: 63, z: -78.5 }, rotation: 270 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 66, y: 64, z: 1 }, rotation: minecraft.StructureRotation.None },
                                chestLocation: { x: 77, y: 63, z: 4 },
                                flagLocation: { from: { x: 67, y: 66, z: -9 }, to: { x: 77, y: 78, z: 9 } },
                                island: { location: { x: 60, y: 53, z: -9 }, rotation: minecraft.StructureRotation.Rotate90 },
                                resourceLocation: { x: 82, y: 63, z: 1 },
                                spawnpointLocation: { x: 79, y: 63, z: 1 },
                                trader: [
                                    { type: "item", location: { x: 79.5, y: 63, z: 7 }, rotation: 180 },
                                    { type: "upgrade", location: { x: 79.5, y: 63, z: -5 }, rotation: 0 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 0, y: 64, z: 67 }, rotation: minecraft.StructureRotation.Rotate90 },
                                chestLocation: { x: -3, y: 63, z: 78 },
                                flagLocation: { from: { x: 10, y: 66, z: 68 }, to: { x: -8, y: 78, z: 78 } },
                                island: { location: { x: -12, y: 53, z: 61 }, rotation: minecraft.StructureRotation.Rotate180 },
                                resourceLocation: { x: 0, y: 63, z: 83 },
                                spawnpointLocation: { x: 0, y: 63, z: 80 },
                                trader: [
                                    { type: "item", location: { x: -6, y: 63, z: 80.5 }, rotation: 270 },
                                    { type: "upgrade", location: { x: 6, y: 63, z: 80.5 }, rotation: 90 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -66, y: 64, z: 1 }, rotation: minecraft.StructureRotation.Rotate180 },
                                chestLocation: { x: -77, y: 63, z: -2 },
                                flagLocation: { from: { x: -67, y: 66, z: 11 }, to: { x: -77, y: 78, z: -7 } },
                                island: { location: { x: -86, y: 53, z: -11 }, rotation: minecraft.StructureRotation.Rotate270 },
                                resourceLocation: { x: -82, y: 63, z: 1 },
                                spawnpointLocation: { x: -79, y: 63, z: 1 },
                                trader: [
                                    { type: "item", location: { x: -79.5, y: 63, z: -5 }, rotation: 0 },
                                    { type: "upgrade", location: { x: -79.5, y: 63, z: 7 }, rotation: 180 },
                                ],
                            },
                        ],
                        islandLoadTime: 1,
                        healPoolRadius: 18
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 38, y: 57, z: -58 }, rotation: minecraft.StructureRotation.None, },
                                { location: { x: 41, y: 57, z: 39 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -58, y: 57, z: 42 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: -59, y: 57, z: -57 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 7,
                            islandData: [
                                { location: { x: -20, y: 45, z: -19 }, rotation: minecraft.StructureRotation.None, },
                            ],
                        }
                    ],
                    size: {
                        heightLimitMax: 101,
                        heightLimitMin: 57,
                    }
                }
            },

            /** 蘑菇岛 @type {BedwarsMapData} */
            boletum: {
                description: {
                    id: "boletum",
                    name: "蘑菇岛",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 43, y: 68, z: -43 }, { x: 43, y: 68, z: 43 }, { x: -43, y: 68, z: 43 }, { x: -43, y: 68, z: -43 },],
                        emeraldSpawnerLocation: [{ x: -11, y: 72, z: -12 }, { x: 9, y: 72, z: 12 },],
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 69, z: 66 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 68, z: 82 },
                                spawnpointLocation: { x: 0, y: 68, z: 78 },
                                chestLocation: { x: -3, y: 68, z: 77 },
                                island: { location: { x: -11, y: 61, z: 60 }, },
                                flagLocation: { from: { x: 9, y: 82, z: 69 }, to: { x: -9, y: 85, z: 74 }, },
                                trader: [
                                    { type: "item", location: { x: -5, y: 68, z: 79.5 }, rotation: 180, },
                                    { type: "upgrade", location: { x: 6, y: 68, z: 79.5 }, rotation: 0, },
                                ]
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: -68, y: 69, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -84, y: 68, z: 0 },
                                spawnpointLocation: { x: -80, y: 68, z: 0 },
                                chestLocation: { x: -79, y: 68, z: -3 },
                                island: { location: { x: -87, y: 61, z: -11 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -71, y: 82, z: 9 }, to: { x: -76, y: 85, z: -9 }, },
                                trader: [
                                    { type: "item", location: { x: -81.5, y: 68, z: -5 }, rotation: 270, },
                                    { type: "upgrade", location: { x: -81.5, y: 68, z: 6 }, rotation: 90, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: -2, y: 69, z: -68 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -2, y: 68, z: -84 },
                                spawnpointLocation: { x: -2, y: 68, z: -80 },
                                chestLocation: { x: 1, y: 68, z: -79 },
                                island: { location: { x: -13, y: 61, z: -87 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: -11, y: 82, z: -71 }, to: { x: 8, y: 85, z: -76 }, },
                                trader: [
                                    { type: "item", location: { x: 3, y: 68, z: -81.5 }, rotation: 0, },
                                    { type: "upgrade", location: { x: -8, y: 68, z: -81.5 }, rotation: 180, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 66, y: 69, z: -2 }, },
                                resourceLocation: { x: 82, y: 68, z: -2 },
                                spawnpointLocation: { x: 78, y: 68, z: -2 },
                                chestLocation: { x: 77, y: 68, z: 1 },
                                island: { location: { x: 60, y: 61, z: -13 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: 69, y: 82, z: -11 }, to: { x: 74, y: 85, z: 7 }, },
                                trader: [
                                    { type: "item", location: { x: 79.5, y: 68, z: 3 }, rotation: 90, },
                                    { type: "upgrade", location: { x: 79.5, y: 68, z: -8 }, rotation: 270, },
                                ],
                            },
                        ],
                        islandLoadTime: 1,
                        healPoolRadius: 17,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: -55, y: 64, z: 36 }, },
                                { location: { x: -55, y: 64, z: -55 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: 36, y: 64, z: -55 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: 36, y: 64, z: 36 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 7,
                            islandData: [
                                { location: { x: -27, y: 56, z: -27 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 94,
                        heightLimitMin: 65,
                    }
                },
            },

            /** 甲壳 @type {BedwarsMapData} */
            carapace: {
                description: {
                    id: "carapace",
                    name: "甲壳",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 31, y: 65, z: -30 }, { x: 30, y: 65, z: 31 }, { x: -31, y: 65, z: 30 }, { x: -30, y: 65, z: -31 },],
                        emeraldSpawnerLocation: [{ x: 0, y: 65, z: 0 }, { x: 0, y: 73, z: 0 },],
                        distributeResource: false,
                        clearVelocity: false,
                        ironSpawnTimes: 1,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 66, z: -48 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 66, z: -64 },
                                spawnpointLocation: { x: 0, y: 66, z: -58 },
                                chestLocation: { x: 3, y: 66, z: -55 },
                                island: { location: { x: -11, y: 55, z: -67 }, },
                                flagLocation: { from: { x: -6, y: 73, z: -45 }, to: { x: 7, y: 59, z: -67 }, },
                                trader: [
                                    { type: "item", location: { x: 5, y: 66, z: -58 }, rotation: 180, },
                                    { type: "upgrade", location: { x: -5, y: 66, z: -58 }, rotation: 0, },
                                ]
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 48, y: 66, z: 0 }, },
                                resourceLocation: { x: 64, y: 66, z: 0 },
                                spawnpointLocation: { x: 58, y: 66, z: 0 },
                                chestLocation: { x: 55, y: 66, z: 3 },
                                island: { location: { x: 43, y: 55, z: -11 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: 45, y: 73, z: -6 }, to: { x: 67, y: 59, z: 7 }, },
                                trader: [
                                    { type: "item", location: { x: 58, y: 66, z: 5 }, rotation: 270, },
                                    { type: "upgrade", location: { x: 58, y: 66, z: -5 }, rotation: 90, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 0, y: 66, z: 48 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 66, z: 64 },
                                spawnpointLocation: { x: 0, y: 66, z: 58 },
                                chestLocation: { x: -3, y: 66, z: 55 },
                                island: { location: { x: -11, y: 55, z: 43 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: 6, y: 73, z: 45 }, to: { x: -7, y: 59, z: 67 }, },
                                trader: [
                                    { type: "item", location: { x: -5, y: 66, z: 58 }, rotation: 0, },
                                    { type: "upgrade", location: { x: 5, y: 66, z: 58 }, rotation: 180, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -48, y: 66, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -64, y: 66, z: 0 },
                                spawnpointLocation: { x: -58, y: 66, z: 0 },
                                chestLocation: { x: -55, y: 66, z: -3 },
                                island: { location: { x: -67, y: 55, z: -11 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: -45, y: 73, z: 6 }, to: { x: -67, y: 59, z: -7 }, },
                                trader: [
                                    { type: "item", location: { x: -58, y: 66, z: -5 }, rotation: 90, },
                                    { type: "upgrade", location: { x: -58, y: 66, z: 5 }, rotation: 270, },
                                ],
                            },
                        ],
                        islandLoadTime: 1,
                        healPoolRadius: 15,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 23, y: 55, z: -36 }, },
                                { location: { x: 22, y: 55, z: 23 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -38, y: 55, z: 22 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: -36, y: 55, z: -38 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 4,
                            islandData: [
                                { location: { x: -17, y: 54, z: -17 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 91,
                        heightLimitMin: 63,
                    },
                }
            },

            /** 铁索连环 @type {BedwarsMapData} */
            chained: {
                description: {
                    id: "chained",
                    name: "铁索连环",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 36, y: 65, z: 34 }, { x: -34, y: 65, z: 36 }, { x: -36, y: 65, z: -34 }, { x: 34, y: 65, z: -36 },],
                        emeraldSpawnerLocation: [{ x: -11, y: 65, z: 0 }, { x: 11, y: 65, z: 0 },],
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 69, y: 65, z: 0 }, },
                                resourceLocation: { x: 86, y: 64, z: 0 },
                                spawnpointLocation: { x: 81, y: 64, z: 0 },
                                chestLocation: { x: 80, y: 64, z: 5 },
                                island: { location: { x: 63, y: 55, z: -12 }, },
                                flagLocation: { from: { x: 76, y: 70, z: -7 }, to: { x: 88, y: 79, z: 7 }, },
                                trader: [
                                    { type: "item", location: { x: 83, y: 64, z: 8 }, rotation: 180, },
                                    { type: "upgrade", location: { x: 83, y: 64, z: -8 }, rotation: 0, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 0, y: 65, z: 69 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 64, z: 86 },
                                spawnpointLocation: { x: 0, y: 64, z: 81 },
                                chestLocation: { x: -5, y: 64, z: 80 },
                                island: { location: { x: -11, y: 55, z: 63 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: 7, y: 70, z: 76 }, to: { x: -7, y: 79, z: 88 }, },
                                trader: [
                                    { type: "item", location: { x: -8, y: 64, z: 83 }, rotation: 270, },
                                    { type: "upgrade", location: { x: 8, y: 64, z: 83 }, rotation: 90, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: -69, y: 65, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -86, y: 64, z: 0 },
                                spawnpointLocation: { x: -81, y: 64, z: 0 },
                                chestLocation: { x: -80, y: 64, z: -5 },
                                island: { location: { x: -89, y: 55, z: -11 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: -76, y: 70, z: 7 }, to: { x: -88, y: 79, z: -7 }, },
                                trader: [
                                    { type: "item", location: { x: -83, y: 64, z: -8 }, rotation: 0, },
                                    { type: "upgrade", location: { x: -83, y: 64, z: 8 }, rotation: 180, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 0, y: 65, z: -69 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 64, z: -86 },
                                spawnpointLocation: { x: 0, y: 64, z: -81 },
                                chestLocation: { x: 5, y: 64, z: -80 },
                                island: { location: { x: -12, y: 55, z: -89 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: -7, y: 70, z: -76 }, to: { x: 7, y: 79, z: -88 }, },
                                trader: [
                                    { type: "item", location: { x: 8, y: 64, z: -83 }, rotation: 90, },
                                    { type: "upgrade", location: { x: -8, y: 64, z: -83 }, rotation: 270, },
                                ],
                            },
                        ],
                        islandLoadTime: 1,
                        healPoolRadius: 20,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: 16, y: 53, z: -50 }, },
                                { location: { x: 28, y: 53, z: 16 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -46, y: 53, z: 28 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: -50, y: 53, z: -46 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 9,
                            islandData: [
                                { location: { x: -27, y: 46, z: -27 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 90,
                        heightLimitMin: 59,
                    },
                },
            },

            /** 伊斯特伍德 @type {BedwarsMapData} */
            eastwood: {
                description: {
                    id: "eastwood",
                    name: "伊斯特伍德",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 40, y: 64, z: 40 }, { x: -40, y: 64, z: 40 }, { x: -40, y: 64, z: -40 }, { x: 40, y: 64, z: -40 },],
                        emeraldSpawnerLocation: [{ x: -10, y: 64, z: -10 }, { x: 10, y: 64, z: 10 },],
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 55, y: 66, z: 0 }, },
                                resourceLocation: { x: 70, y: 66, z: 0 },
                                spawnpointLocation: { x: 66, y: 66, z: 0 },
                                chestLocation: { x: 70, y: 66, z: 3 },
                                island: { location: { x: 49, y: 52, z: -11 }, },
                                flagLocation: { from: { x: 63, y: 77, z: -3 }, to: { x: 69, y: 78, z: 3 }, },
                                trader: [
                                    { type: "item", location: { x: 70, y: 66, z: 6 }, rotation: 90, },
                                    { type: "upgrade", location: { x: 70, y: 66, z: -4 }, rotation: 90, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 0, y: 66, z: 55 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 66, z: 70 },
                                spawnpointLocation: { x: 0, y: 66, z: 66 },
                                chestLocation: { x: -3, y: 66, z: 70 },
                                island: { location: { x: -11, y: 52, z: 49 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: 3, y: 77, z: 63 }, to: { x: -3, y: 78, z: 69 }, },
                                trader: [
                                    { type: "item", location: { x: -6, y: 66, z: 70 }, rotation: 180, },
                                    { type: "upgrade", location: { x: 4, y: 66, z: 70 }, rotation: 180, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: -55, y: 66, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -70, y: 66, z: 0 },
                                spawnpointLocation: { x: -66, y: 66, z: 0 },
                                chestLocation: { x: -70, y: 66, z: -3 },
                                island: { location: { x: -74, y: 52, z: -11 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: -63, y: 77, z: 3 }, to: { x: -69, y: 78, z: -3 }, },
                                trader: [
                                    { type: "item", location: { x: -70, y: 66, z: -6 }, rotation: 270, },
                                    { type: "upgrade", location: { x: -70, y: 66, z: 4 }, rotation: 270, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 0, y: 66, z: -55 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 66, z: -70 },
                                spawnpointLocation: { x: 0, y: 66, z: -66 },
                                chestLocation: { x: 3, y: 66, z: -70 },
                                island: { location: { x: -11, y: 52, z: -74 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: -3, y: 77, z: -63 }, to: { x: 3, y: 78, z: -69 }, },
                                trader: [
                                    { type: "item", location: { x: 6, y: 66, z: -70 }, rotation: 0, },
                                    { type: "upgrade", location: { x: -4, y: 66, z: -70 }, rotation: 0, },
                                ],
                            },

                        ],
                        healPoolRadius: 17,
                        islandLoadTime: 1
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 3,
                            islandData: [
                                { location: { x: 18, y: 48, z: 18 }, },
                                { location: { x: -53, y: 48, z: 18 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -50, y: 48, z: -53 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: 18, y: 48, z: -50 }, rotation: minecraft.StructureRotation.Rotate270, }
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 8,
                            islandData: [
                                { location: { x: -22, y: 51, z: -22 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 91,
                        heightLimitMin: 55,
                    },
                },
            },

            /** 入侵 @type {BedwarsMapData} */
            invasion: {
                description: {
                    id: "invasion",
                    name: "入侵",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 48, y: 86, z: 0 }, { x: 0, y: 86, z: 48 }, { x: -48, y: 86, z: 0 }, { x: 0, y: 86, z: -48 },],
                        emeraldSpawnerLocation: [{ x: 13, y: 99, z: 0 }, { x: -13, y: 99, z: 0 },],
                        distributeResource: false,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 39, y: 94, z: -39 }, rotation: minecraft.StructureRotation.Rotate270, },
                                chestLocation: { x: 46, y: 94, z: -42 },
                                flagLocation: { from: { x: 28, y: 77, z: -68 }, to: { x: 68, y: 110, z: -28 }, },
                                island: { location: { x: 28, y: 77, z: -68 }, rotation: minecraft.StructureRotation.None, },
                                resourceLocation: { x: 51, y: 93, z: -51 },
                                spawnpointLocation: { x: 48, y: 93, z: -48 },
                                trader: [
                                    { type: "item", location: { x: 52, y: 93, z: -44 }, rotation: 135 },
                                    { type: "upgrade", location: { x: 44, y: 93, z: -52 }, rotation: 315 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 39, y: 94, z: 39 }, rotation: minecraft.StructureRotation.None, },
                                chestLocation: { x: 42, y: 94, z: 46 },
                                flagLocation: { from: { x: 68, y: 77, z: 28 }, to: { x: 28, y: 110, z: 68 }, },
                                island: { location: { x: 28, y: 77, z: 28 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 51, y: 93, z: 51 },
                                spawnpointLocation: { x: 48, y: 93, z: 48 },
                                trader: [
                                    { type: "item", location: { x: 44, y: 93, z: 52 }, rotation: 225 },
                                    { type: "upgrade", location: { x: 52, y: 93, z: 44 }, rotation: 45 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: -39, y: 94, z: 39 }, rotation: minecraft.StructureRotation.Rotate90, },
                                chestLocation: { x: -46, y: 94, z: 42 },
                                flagLocation: { from: { x: -28, y: 77, z: 68 }, to: { x: -68, y: 110, z: 28 }, },
                                island: { location: { x: -68, y: 77, z: 28 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -51, y: 93, z: 51 },
                                spawnpointLocation: { x: -48, y: 93, z: 48 },
                                trader: [
                                    { type: "item", location: { x: -52, y: 93, z: 44 }, rotation: 315 },
                                    { type: "upgrade", location: { x: -44, y: 93, z: 52 }, rotation: 135 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -39, y: 94, z: -39 }, rotation: minecraft.StructureRotation.Rotate180, },
                                chestLocation: { x: -42, y: 94, z: -46 },
                                flagLocation: { from: { x: -68, y: 77, z: -28 }, to: { x: -28, y: 110, z: -68 }, },
                                island: { location: { x: -68, y: 77, z: -68 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -51, y: 93, z: -51 },
                                spawnpointLocation: { x: -48, y: 93, z: -48 },
                                trader: [
                                    { type: "item", location: { x: -44, y: 93, z: -52 }, rotation: 45 },
                                    { type: "upgrade", location: { x: -52, y: 93, z: -44 }, rotation: 225 },
                                ],
                            },
                        ],
                        islandLoadTime: 4,
                        healPoolRadius: 19
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 36, y: 74, z: -10 } },
                                { location: { x: -9, y: 74, z: 36 }, rotation: minecraft.StructureRotation.Rotate90 },
                                { location: { x: -60, y: 74, z: -9 }, rotation: minecraft.StructureRotation.Rotate180 },
                                { location: { x: -10, y: 74, z: -60 }, rotation: minecraft.StructureRotation.Rotate270 },
                            ]
                        },
                        {
                            id: "center_island",
                            loadTime: 8,
                            islandData: [
                                { location: { x: -24, y: 70, z: -32 } },
                            ]
                        },
                    ],
                    size: {
                        heightLimitMin: 72,
                        heightLimitMax: 110,
                    }
                },
            },

            /** 竞技场 @type {BedwarsMapData} */
            lectus: {
                description: {
                    id: "lectus",
                    name: "竞技场",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 0, y: 64, z: -54 }, { x: 54, y: 64, z: 0 }, { x: 0, y: 64, z: 54 }, { x: -54, y: 64, z: 0 },],
                        emeraldSpawnerLocation: [{ x: -14, y: 64, z: 0 }, { x: 14, y: 64, z: 0 },],
                        distributeResource: false,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -40, y: 66, z: -42 }, rotation: minecraft.StructureRotation.Rotate180, },
                                chestLocation: { x: -49, y: 66, z: -52 },
                                flagLocation: { from: { x: -43, y: 66, z: -44 }, to: { x: -52, y: 82, z: -53 }, },
                                island: { location: { x: -58, y: 55, z: -59 }, },
                                resourceLocation: { x: -45, y: 66, z: -53 },
                                spawnpointLocation: { x: -47, y: 66, z: -48 },
                                trader: [
                                    { type: "item", location: { x: -52, y: 66, z: -45 }, rotation: 270 },
                                    { type: "upgrade", location: { x: -52, y: 66, z: -47 }, rotation: 270 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 42, y: 66, z: -40 }, rotation: minecraft.StructureRotation.Rotate270, },
                                chestLocation: { x: 52, y: 66, z: -49 },
                                flagLocation: { from: { x: 44, y: 66, z: -43 }, to: { x: 53, y: 82, z: -52 }, },
                                island: { location: { x: 36, y: 55, z: -58 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 53, y: 66, z: -45 },
                                spawnpointLocation: { x: 48, y: 66, z: -47 },
                                trader: [
                                    { type: "item", location: { x: 45, y: 66, z: -52 }, rotation: 0 },
                                    { type: "upgrade", location: { x: 47, y: 66, z: -52 }, rotation: 0 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 40, y: 66, z: 42 }, },
                                chestLocation: { x: 49, y: 66, z: 52 },
                                flagLocation: { from: { x: 43, y: 66, z: 44 }, to: { x: 52, y: 82, z: 53 }, },
                                island: { location: { x: 35, y: 55, z: 36 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: 45, y: 66, z: 53 },
                                spawnpointLocation: { x: 47, y: 66, z: 48 },
                                trader: [
                                    { type: "item", location: { x: 52, y: 66, z: 45 }, rotation: 90 },
                                    { type: "upgrade", location: { x: 52, y: 66, z: 47 }, rotation: 90 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -42, y: 66, z: 40 }, rotation: minecraft.StructureRotation.Rotate90, },
                                chestLocation: { x: -52, y: 66, z: 49 },
                                flagLocation: { from: { x: -44, y: 66, z: 43 }, to: { x: -53, y: 82, z: 52 }, },
                                island: { location: { x: -59, y: 55, z: 35 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -53, y: 66, z: 45 },
                                spawnpointLocation: { x: -48, y: 66, z: 47 },
                                trader: [
                                    { type: "item", location: { x: -45, y: 66, z: 52 }, rotation: 0 },
                                    { type: "upgrade", location: { x: -47, y: 66, z: 52 }, rotation: 0 },
                                ],
                            },
                        ],
                        islandLoadTime: 1,
                        healPoolRadius: 15
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: -10, y: 56, z: -64 } },
                                { location: { x: 45, y: 56, z: -10 }, rotation: minecraft.StructureRotation.Rotate90 },
                                { location: { x: -10, y: 56, z: 45 }, rotation: minecraft.StructureRotation.Rotate180 },
                                { location: { x: -64, y: 56, z: -10 }, rotation: minecraft.StructureRotation.Rotate270 },
                            ]
                        },
                        {
                            id: "center_island",
                            loadTime: 6,
                            islandData: [
                                { location: { x: -22, y: 49, z: -22 } },
                            ]
                        },
                    ],
                    size: {
                        heightLimitMin: 59,
                        heightLimitMax: 91,
                    }
                },
            },

            /** 方尖碑 @type {BedwarsMapData} */
            obelisk: {
                description: {
                    id: "obelisk",
                    name: "方尖碑",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 35, y: 70, z: -35 }, { x: 35, y: 70, z: 35 }, { x: -35, y: 70, z: 35 }, { x: -35, y: 70, z: -35 }],
                        emeraldSpawnerLocation: [{ x: 0, y: 69, z: 0 }, { x: -6, y: 77, z: 6 }, { x: 6, y: 77, z: -6 }],
                        distributeResource: false,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 74, z: -75 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 73, z: -88 },
                                spawnpointLocation: { x: 0, y: 74, z: -85 },
                                chestLocation: { x: 4, y: 74, z: -83 },
                                island: { location: { x: -22, y: 60, z: -95 } },
                                flagLocation: { from: { x: -7, y: 80, z: -80 }, to: { x: 7, y: 75, z: -90 }, },
                                trader: [
                                    { type: "item", location: { x: 6, y: 74, z: -86 }, rotation: 90, teleportNearbyPlayerLocation: { x: 3, y: 74, z: -86 }, },
                                    { type: "upgrade", location: { x: -6, y: 74, z: -86 }, rotation: 270, teleportNearbyPlayerLocation: { x: -3, y: 74, z: -86 }, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 75, y: 74, z: 0 }, },
                                resourceLocation: { x: 88, y: 73, z: 0 },
                                spawnpointLocation: { x: 85, y: 74, z: 0 },
                                chestLocation: { x: 83, y: 74, z: 4 },
                                island: { location: { x: 59, y: 60, z: -22 }, rotation: minecraft.StructureRotation.Rotate90 },
                                flagLocation: { from: { x: 80, y: 80, z: -7 }, to: { x: 90, y: 75, z: 7 }, },
                                trader: [
                                    { type: "item", location: { x: 86, y: 74, z: 6 }, rotation: 180, teleportNearbyPlayerLocation: { x: 86, y: 74, z: 3 }, },
                                    { type: "upgrade", location: { x: 86, y: 74, z: -6 }, rotation: 0, teleportNearbyPlayerLocation: { x: 86, y: 74, z: -3 }, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 0, y: 74, z: 75 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 73, z: 88 },
                                spawnpointLocation: { x: 0, y: 74, z: 85 },
                                chestLocation: { x: -4, y: 74, z: 83 },
                                island: { location: { x: -22, y: 60, z: 59 }, rotation: minecraft.StructureRotation.Rotate180 },
                                flagLocation: { from: { x: 7, y: 80, z: 80 }, to: { x: -7, y: 75, z: 90 }, },
                                trader: [
                                    { type: "item", location: { x: -6, y: 74, z: 86 }, rotation: 270, teleportNearbyPlayerLocation: { x: -3, y: 74, z: 86 }, },
                                    { type: "upgrade", location: { x: 6, y: 74, z: 86 }, rotation: 90, teleportNearbyPlayerLocation: { x: 3, y: 74, z: 86 }, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -75, y: 74, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -88, y: 73, z: 0 },
                                spawnpointLocation: { x: -85, y: 74, z: 0 },
                                chestLocation: { x: -83, y: 74, z: -4 },
                                island: { location: { x: -95, y: 60, z: -22 }, rotation: minecraft.StructureRotation.Rotate270 },
                                flagLocation: { from: { x: -80, y: 80, z: 7 }, to: { x: -90, y: 75, z: -7 }, },
                                trader: [
                                    { type: "item", location: { x: -86, y: 74, z: -6 }, rotation: 0, teleportNearbyPlayerLocation: { x: -86, y: 74, z: -3 }, },
                                    { type: "upgrade", location: { x: -86, y: 74, z: 6 }, rotation: 180, teleportNearbyPlayerLocation: { x: -86, y: 74, z: 3 }, },
                                ],
                            },
                        ],
                        islandLoadTime: 4,
                        healPoolRadius: 15,
                        playerCouldIntoShop: false,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: 22, y: 64, z: -53 }, },
                                { location: { x: 25, y: 64, z: 22 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -53, y: 64, z: 25 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: -53, y: 64, z: -53 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 15,
                            islandData: [
                                { location: { x: -30, y: 55, z: -30 }, },
                            ],
                        }
                    ],
                    size: {
                        heightLimitMax: 105,
                        heightLimitMin: 67,
                    }
                }
            },

            /** 兰花 @type {BedwarsMapData} */
            orchid: {
                description: {
                    id: "orchid",
                    name: "兰花",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 0, y: 70, z: -76 }, { x: 56, y: 70, z: 0 }, { x: 0, y: 70, z: 76 }, { x: -56, y: 70, z: 0 },],
                        emeraldSpawnerLocation: [{ x: 0, y: 70, z: -8 }, { x: 0, y: 70, z: 8 },],
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 41, y: 71, z: -50 }, },
                                resourceLocation: { x: 62, y: 71, z: -50 },
                                spawnpointLocation: { x: 58, y: 71, z: -49 },
                                chestLocation: { x: 55, y: 71, z: -47 },
                                island: { location: { x: 36, y: 61, z: -64 }, },
                                flagLocation: { from: { x: 49, y: 82, z: -56 }, to: { x: 52, y: 78, z: -45 }, },
                                trader: [
                                    { type: "item", location: { x: 58, y: 71, z: -45 }, rotation: 180, teleportNearbyPlayerLocation: { x: 58, y: 71, z: -48 } },
                                    { type: "upgrade", location: { x: 55, y: 71, z: -54 }, rotation: 270, teleportNearbyPlayerLocation: { x: 58, y: 71, z: -54 } },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 41, y: 71, z: 50 }, },
                                resourceLocation: { x: 62, y: 71, z: 50 },
                                spawnpointLocation: { x: 58, y: 71, z: 49 },
                                chestLocation: { x: 55, y: 71, z: 47 },
                                island: { location: { x: 36, y: 61, z: 38 }, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: 49, y: 82, z: 56 }, to: { x: 52, y: 78, z: 45 }, },
                                trader: [
                                    { type: "item", location: { x: 58, y: 71, z: 45 }, rotation: 0, teleportNearbyPlayerLocation: { x: 58, y: 71, z: 48 } },
                                    { type: "upgrade", location: { x: 55, y: 71, z: 54 }, rotation: 270, teleportNearbyPlayerLocation: { x: 58, y: 71, z: 54 } },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: -41, y: 71, z: 50 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -62, y: 71, z: 50 },
                                spawnpointLocation: { x: -58, y: 71, z: 49 },
                                chestLocation: { x: -55, y: 71, z: 47 },
                                island: { location: { x: -67, y: 61, z: 38 }, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: -49, y: 82, z: 56 }, to: { x: -52, y: 78, z: 45 }, },
                                trader: [
                                    { type: "item", location: { x: -58, y: 71, z: 45 }, rotation: 0, teleportNearbyPlayerLocation: { x: -58, y: 71, z: 48 } },
                                    { type: "upgrade", location: { x: -55, y: 71, z: 54 }, rotation: 90, teleportNearbyPlayerLocation: { x: -58, y: 71, z: 54 } },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -41, y: 71, z: -50 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -62, y: 71, z: -50 },
                                spawnpointLocation: { x: -58, y: 71, z: -49 },
                                chestLocation: { x: -55, y: 71, z: -47 },
                                island: { location: { x: -67, y: 61, z: -64 }, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: -49, y: 82, z: -56 }, to: { x: -52, y: 78, z: -45 }, },
                                trader: [
                                    { type: "item", location: { x: -58, y: 71, z: -45 }, rotation: 180, teleportNearbyPlayerLocation: { x: -58, y: 71, z: -48 } },
                                    { type: "upgrade", location: { x: -55, y: 71, z: -54 }, rotation: 90, teleportNearbyPlayerLocation: { x: -58, y: 71, z: -54 } },
                                ],
                            }
                        ],
                        islandLoadTime: 2,
                        healPoolRadius: 21,
                        playerCouldIntoShop: false,
                    },
                    island: [
                        {
                            id: "diamond_island_1",
                            loadTime: 4,
                            islandData: [
                                { location: { x: 35, y: 59, z: -20 }, },
                                { location: { x: -65, y: 59, z: -20 }, mirror: minecraft.StructureMirrorAxis.Z, },
                            ],
                        },
                        {
                            id: "diamond_island_2",
                            loadTime: 2,
                            islandData: [
                                { location: { x: -13, y: 59, z: -89 }, },
                                { location: { x: -13, y: 59, z: 62 }, mirror: minecraft.StructureMirrorAxis.X, },
                            ],
                        },
                        {
                            id: "center_island_1",
                            loadTime: 4,
                            islandData: [
                                { location: { x: -25, y: 56, z: -16 }, },
                            ],
                        },
                        {
                            id: "center_island_2",
                            loadTime: 1,
                            islandData: [
                                { location: { x: -10, y: 59, z: -56 }, },
                                { location: { x: -10, y: 59, z: 17 }, mirror: minecraft.StructureMirrorAxis.X, },
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 95,
                        heightLimitMin: 64,
                    },
                },
            },

            /** 野餐 @type {BedwarsMapData} */ // 原名 Treenan
            picnic: {
                description: {
                    id: "picnic_4team",
                    name: "野餐",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 31, y: 66, z: 29 }, { x: -29, y: 66, z: 31 }, { x: -31, y: 66, z: -29 }, { x: 29, y: 66, z: -31 },],
                        emeraldSpawnerLocation: [{ x: 8, y: 70, z: 12 }, { x: -7, y: 70, z: -11 },]
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 66, y: 67, z: 0 }, },
                                resourceLocation: { x: 82, y: 66, z: 0 },
                                spawnpointLocation: { x: 78, y: 66, z: 0 },
                                chestLocation: { x: 77, y: 66, z: 3 },
                                island: { location: { x: 60, y: 57, z: -12 }, },
                                flagLocation: { from: { x: 75, y: 79, z: -6 }, to: { x: 73, y: 83, z: 13 }, },
                                trader: [
                                    { type: "item", location: { x: 79.5, y: 66, z: 6 }, rotation: 180, },
                                    { type: "upgrade", location: { x: 79.5, y: 66, z: -6 }, rotation: 0, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 0, y: 67, z: 66 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 66, z: 82 },
                                spawnpointLocation: { x: 0, y: 66, z: 78 },
                                chestLocation: { x: -3, y: 66, z: 77 },
                                island: { location: { x: -14, y: 57, z: 60 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: 6, y: 79, z: 75 }, to: { x: -13, y: 83, z: 73 }, },
                                trader: [
                                    { type: "item", location: { x: -6, y: 66, z: 79.5 }, rotation: 270, },
                                    { type: "upgrade", location: { x: 6, y: 66, z: 79.5 }, rotation: 90, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: -66, y: 67, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -82, y: 66, z: 0 },
                                spawnpointLocation: { x: -78, y: 66, z: 0 },
                                chestLocation: { x: -77, y: 66, z: -3 },
                                island: { location: { x: -87, y: 57, z: -14 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: -75, y: 79, z: 6 }, to: { x: -73, y: 83, z: -13 }, },
                                trader: [
                                    { type: "item", location: { x: -79.5, y: 66, z: -6 }, rotation: 0, },
                                    { type: "upgrade", location: { x: -79.5, y: 66, z: 6 }, rotation: 180, },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 0, y: 67, z: -66 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 66, z: -82 },
                                spawnpointLocation: { x: 0, y: 66, z: -78 },
                                chestLocation: { x: 3, y: 66, z: -77 },
                                island: { location: { x: -12, y: 57, z: -87 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: -6, y: 79, z: -75 }, to: { x: 13, y: 83, z: -73 }, },
                                trader: [
                                    { type: "item", location: { x: 6, y: 66, z: -79.5 }, rotation: 90, },
                                    { type: "upgrade", location: { x: -6, y: 66, z: -79.5 }, rotation: 270, },
                                ],
                            },
                        ],
                        healPoolRadius: 18,
                        islandLoadTime: 2,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 25, y: 61, z: 23 }, },
                                { location: { x: -41, y: 61, z: 25 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -43, y: 61, z: -41 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: 23, y: 61, z: -43 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 10,
                            islandData: [
                                { location: { x: -21, y: 51, z: -22 }, },
                            ],
                        },
                    ],
                    size: {
                        heightLimitMin: 56,
                        heightLimitMax: 97,
                    },
                },
            },

            /** 石头城堡 @type {BedwarsMapData} */
            stonekeep: {
                description: {
                    id: "stonekeep",
                    name: "石头城堡",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 44, y: 39, z: 44 }, { x: -44, y: 39, z: 44 }, { x: -44, y: 39, z: -44 }, { x: 44, y: 39, z: -44 },],
                        emeraldSpawnerLocation: [{ x: 0, y: 41, z: 0 }, { x: 0, y: 51, z: 0 },],
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 40, z: -66 }, rotation: minecraft.StructureRotation.Rotate270, },
                                chestLocation: { x: 4, y: 41, z: -75 },
                                flagLocation: { from: { x: -12, y: 47, z: -72 }, to: { x: 12, y: 81, z: -88 }, },
                                island: { location: { x: -14, y: 29, z: -90 }, },
                                resourceLocation: { x: 0, y: 41, z: -81 },
                                spawnpointLocation: { x: 0, y: 41, z: -77 },
                                trader: [
                                    { type: "item", location: { x: 7, y: 41, z: -78 }, rotation: 90 },
                                    { type: "upgrade", location: { x: -7, y: 41, z: -78 }, rotation: 270 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 66, y: 40, z: 0 }, },
                                chestLocation: { x: 75, y: 41, z: 4 },
                                flagLocation: { from: { x: 72, y: 47, z: -12 }, to: { x: 88, y: 81, z: 12 }, },
                                island: { location: { x: 62, y: 29, z: -14 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 81, y: 41, z: 0 },
                                spawnpointLocation: { x: 77, y: 41, z: 0 },
                                trader: [
                                    { type: "item", location: { x: 78, y: 41, z: 7 }, rotation: 180 },
                                    { type: "upgrade", location: { x: 78, y: 41, z: -7 }, rotation: 0 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 0, y: 40, z: 66 }, rotation: minecraft.StructureRotation.Rotate90, },
                                chestLocation: { x: -4, y: 41, z: 75 },
                                flagLocation: { from: { x: 12, y: 47, z: 72 }, to: { x: -12, y: 81, z: 88 }, },
                                island: { location: { x: -14, y: 29, z: 62 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: 0, y: 41, z: 81 },
                                spawnpointLocation: { x: 0, y: 41, z: 77 },
                                trader: [
                                    { type: "item", location: { x: -7, y: 41, z: 78 }, rotation: 270 },
                                    { type: "upgrade", location: { x: 7, y: 41, z: 78 }, rotation: 90 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -66, y: 40, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                chestLocation: { x: -75, y: 41, z: -4 },
                                flagLocation: { from: { x: -72, y: 47, z: 12 }, to: { x: -88, y: 81, z: -12 }, },
                                island: { location: { x: -90, y: 29, z: -14 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -81, y: 41, z: 0 },
                                spawnpointLocation: { x: -77, y: 41, z: 0 },
                                trader: [
                                    { type: "item", location: { x: -78, y: 41, z: -7 }, rotation: 0 },
                                    { type: "upgrade", location: { x: -78, y: 41, z: 7 }, rotation: 180 },
                                ],
                            },
                        ],
                        islandLoadTime: 4,
                        healPoolRadius: 18
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 34, y: 31, z: -54 } },
                                { location: { x: 34, y: 31, z: 34 }, rotation: minecraft.StructureRotation.Rotate90 },
                                { location: { x: -54, y: 31, z: 34 }, rotation: minecraft.StructureRotation.Rotate180 },
                                { location: { x: -54, y: 31, z: -54 }, rotation: minecraft.StructureRotation.Rotate270 },
                            ]
                        },
                        {
                            id: "center_island",
                            loadTime: 7,
                            islandData: [
                                { location: { x: -29, y: 31, z: -29 } },
                            ]
                        },
                    ],
                    size: {
                        heightLimitMin: 35,
                        heightLimitMax: 83,
                    }
                },
            },

            /** 海盗船 @type {BedwarsMapData} */
            swashbuckle: {
                description: {
                    id: "swashbuckle",
                    name: "海盗船",
                    mode: BedwarsModeType.Classic,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 35, y: 63, z: -35 }, { x: 35, y: 63, z: 35 }, { x: -35, y: 63, z: 35 }, { x: -35, y: 63, z: -35 },],
                        emeraldSpawnerLocation: [{ x: -7, y: 63, z: -7 }, { x: 7, y: 63, z: 7 },],
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 66, z: -70 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 64, z: -90 },
                                spawnpointLocation: { x: 0, y: 64, z: -85 },
                                chestLocation: { x: 3, y: 64, z: -83 },
                                island: { location: { x: -14, y: 52, z: -95 }, },
                                flagLocation: { from: { x: 8, y: 103, z: -95 }, to: { x: -8, y: 64, z: -69 } },
                                trader: [
                                    { type: "item", location: { x: 5, y: 64, z: -85 }, rotation: 90 },
                                    { type: "upgrade", location: { x: -5, y: 64, z: -85 }, rotation: 270 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 70, y: 66, z: 0 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: 90, y: 64, z: 0 },
                                spawnpointLocation: { x: 85, y: 64, z: 0 },
                                chestLocation: { x: 83, y: 64, z: 3 },
                                island: { location: { x: 55, y: 52, z: -14 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: 95, y: 103, z: 8 }, to: { x: 69, y: 64, z: -8 } },
                                trader: [
                                    { type: "item", location: { x: 85, y: 64, z: 5 }, rotation: 180 },
                                    { type: "upgrade", location: { x: 85, y: 64, z: -5 }, rotation: 0 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 0, y: 66, z: 70 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 64, z: 90 },
                                spawnpointLocation: { x: 0, y: 64, z: 85 },
                                chestLocation: { x: -3, y: 64, z: 83 },
                                island: { location: { x: -14, y: 52, z: 55 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: -8, y: 103, z: 95 }, to: { x: 8, y: 64, z: 69 } },
                                trader: [
                                    { type: "item", location: { x: -5, y: 64, z: 85 }, rotation: 270 },
                                    { type: "upgrade", location: { x: 5, y: 64, z: 85 }, rotation: 90 },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: -70, y: 66, z: 0 }, },
                                resourceLocation: { x: -90, y: 64, z: 0 },
                                spawnpointLocation: { x: -85, y: 64, z: 0 },
                                chestLocation: { x: -83, y: 64, z: -3 },
                                island: { location: { x: -95, y: 52, z: -14 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: -95, y: 103, z: -8 }, to: { x: -69, y: 64, z: 8 } },
                                trader: [
                                    { type: "item", location: { x: -85, y: 64, z: -5 }, rotation: 0 },
                                    { type: "upgrade", location: { x: -85, y: 64, z: 5 }, rotation: 180 },
                                ],
                            },
                        ],
                        healPoolRadius: 22,
                        islandLoadTime: 5,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 27, y: 55, z: -47 }, },
                                { location: { x: 27, y: 55, z: 27 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -47, y: 55, z: 27 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: -47, y: 55, z: -47 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 6,
                            islandData: [
                                { location: { x: -25, y: 57, z: -25 }, },
                            ],
                        },
                    ],
                    size: {
                        heightLimitMin: 58,
                        heightLimitMax: 90,
                    },
                }
            },

        },

        /** 8 队地图 */
        eightTeams: {

            /** 亚马逊 @type {BedwarsMapData} */
            amazon: {
                description: {
                    id: "amazon",
                    name: "亚马逊",
                    mode: BedwarsModeType.Classic,
                    isSolo: true,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 76, y: 61, z: 75 }, { x: -75, y: 61, z: 76 }, { x: 75, y: 61, z: -76 }, { x: -76, y: 61, z: -75 },],
                        emeraldSpawnerLocation: [{ x: 0, y: 78, z: 33 }, { x: 0, y: 78, z: -33 }, { x: 33, y: 78, z: 0 }, { x: -33, y: 78, z: 0 },],
                        distributeResource: false,
                        ironSpawnTimes: 3,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -33, y: 65, z: -80 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -33, y: 65, z: -100 },
                                spawnpointLocation: { x: -33, y: 65, z: -95 },
                                chestLocation: { x: -36, y: 66, z: -93 },
                                island: { location: { x: -54, y: 53, z: -102 }, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: -47, y: 68, z: -86 }, to: { x: -25, y: 83, z: -98 }, },
                                trader: [
                                    { location: { x: -26, y: 65, z: -95.5 }, rotation: 90, type: "item" },
                                    { location: { x: -39, y: 65, z: -95.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 33, y: 65, z: -80 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 33, y: 65, z: -100 },
                                spawnpointLocation: { x: 33, y: 65, z: -95 },
                                chestLocation: { x: 36, y: 66, z: -93 },
                                island: { location: { x: 20, y: 53, z: -102 }, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 47, y: 68, z: -86 }, to: { x: 25, y: 83, z: -98 }, },
                                trader: [
                                    { location: { x: 39, y: 65, z: -95.5 }, rotation: 90, type: "item" },
                                    { location: { x: 26, y: 65, z: -95.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 80, y: 65, z: -33 }, },
                                resourceLocation: { x: 100, y: 65, z: -33 },
                                spawnpointLocation: { x: 95, y: 65, z: -33 },
                                chestLocation: { x: 93, y: 66, z: -36 },
                                island: { location: { x: 75, y: 53, z: -54 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: 86, y: 68, z: -47 }, to: { x: 98, y: 83, z: -25 }, },
                                trader: [
                                    { location: { x: 95.5, y: 65, z: -26 }, rotation: 180, type: "item" },
                                    { location: { x: 95.5, y: 65, z: -39 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 80, y: 65, z: 33 }, },
                                resourceLocation: { x: 100, y: 65, z: 33 },
                                spawnpointLocation: { x: 95, y: 65, z: 33 },
                                chestLocation: { x: 93, y: 66, z: 36 },
                                island: { location: { x: 75, y: 53, z: 20 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 86, y: 68, z: 47 }, to: { x: 98, y: 83, z: 25 }, },
                                trader: [
                                    { location: { x: 95.5, y: 65, z: 39 }, rotation: 180, type: "item" },
                                    { location: { x: 95.5, y: 65, z: 26 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Cyan,
                                bed: { location: { x: 33, y: 65, z: 80 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 33, y: 65, z: 100 },
                                spawnpointLocation: { x: 33, y: 65, z: 95 },
                                chestLocation: { x: 36, y: 66, z: 93 },
                                island: { location: { x: 20, y: 53, z: 75 }, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: 47, y: 68, z: 86 }, to: { x: 25, y: 83, z: 98 }, },
                                trader: [
                                    { location: { x: 26, y: 65, z: 95.5 }, rotation: 270, type: "item" },
                                    { location: { x: 39, y: 65, z: 95.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.White,
                                bed: { location: { x: -33, y: 65, z: 80 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: -33, y: 65, z: 100 },
                                spawnpointLocation: { x: -33, y: 65, z: 95 },
                                chestLocation: { x: -36, y: 66, z: 93 },
                                island: { location: { x: -54, y: 53, z: 75 }, },
                                trader: [
                                    { location: { x: -39, y: 65, z: 95.5 }, rotation: 270, type: "item" },
                                    { location: { x: -26, y: 65, z: 95.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Pink,
                                bed: { location: { x: -80, y: 65, z: 33 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -100, y: 65, z: 33 },
                                spawnpointLocation: { x: -95, y: 65, z: 33 },
                                chestLocation: { x: -93, y: 66, z: 36 },
                                island: { location: { x: -102, y: 53, z: 20 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: -86, y: 68, z: 47 }, to: { x: -98, y: 83, z: 25 }, },
                                trader: [
                                    { location: { x: -95.5, y: 65, z: 26 }, rotation: 0, type: "item" },
                                    { location: { x: -95.5, y: 65, z: 39 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Gray,
                                bed: { location: { x: -80, y: 65, z: -33 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -100, y: 65, z: -33 },
                                spawnpointLocation: { x: -95, y: 65, z: -33 },
                                chestLocation: { x: -93, y: 66, z: -36 },
                                island: { location: { x: -102, y: 53, z: -54 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -86, y: 68, z: -47 }, to: { x: -98, y: 83, z: -25 }, },
                                trader: [
                                    { location: { x: -95.5, y: 65, z: -39 }, rotation: 0, type: "item" },
                                    { location: { x: -95.5, y: 65, z: -26 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                        ],
                        islandLoadTime: 3,
                        healPoolRadius: 19,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: -83, y: 56, z: 69 }, },
                                { location: { x: -84, y: 56, z: -83 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: 68, y: 56, z: -84 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: 69, y: 56, z: 68 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island_1",
                            loadTime: 11,
                            islandData: [
                                { location: { x: -62, y: 45, z: -62 }, }
                            ],
                        },
                        {
                            id: "center_island_2",
                            loadTime: 10,
                            islandData: [
                                { location: { x: 2, y: 45, z: -62 }, }
                            ],
                        },
                        {
                            id: "center_island_3",
                            loadTime: 11,
                            islandData: [
                                { location: { x: -62, y: 45, z: 0 }, }
                            ],
                        },
                        {
                            id: "center_island_4",
                            loadTime: 10,
                            islandData: [
                                { location: { x: 2, y: 45, z: 0 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 90,
                        heightLimitMin: 55,
                    },
                },
            },

            /** 莲叶 @type {BedwarsMapData} */
            deadwood: {
                description: {
                    id: "deadwood",
                    name: "莲叶",
                    mode: BedwarsModeType.Classic,
                    isSolo: true,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 55, y: 64, z: 55 }, { x: -55, y: 64, z: 55 }, { x: 55, y: 64, z: -55 }, { x: -55, y: 64, z: -55 },],
                        emeraldSpawnerLocation: [{ x: 18, y: 66, z: 18 }, { x: 18, y: 66, z: -18 }, { x: -18, y: 66, z: -18 }, { x: -18, y: 66, z: 18 },],
                        ironSpawnTimes: 3,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -30, y: 64, z: -82 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -30, y: 66, z: -99 },
                                spawnpointLocation: { x: -30, y: 66, z: -94 },
                                chestLocation: { x: -28, y: 66, z: -92 },
                                island: { location: { x: -41, y: 52, z: -105 }, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: -35, y: 68, z: -90 }, to: { x: -23, y: 71, z: -93 }, },
                                trader: [
                                    { location: { x: -25, y: 66, z: -93 }, rotation: 90, type: "item" },
                                    { location: { x: -34, y: 66, z: -93 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 30, y: 64, z: -82 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 30, y: 66, z: -99 },
                                spawnpointLocation: { x: 30, y: 66, z: -94 },
                                chestLocation: { x: 28, y: 66, z: -92 },
                                island: { location: { x: 19, y: 52, z: -105 }, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 35, y: 68, z: -90 }, to: { x: 23, y: 71, z: -93 }, },
                                trader: [
                                    { location: { x: 34, y: 66, z: -93 }, rotation: 90, type: "item" },
                                    { location: { x: 25, y: 66, z: -93 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 82, y: 64, z: -30 }, },
                                resourceLocation: { x: 99, y: 66, z: -30 },
                                spawnpointLocation: { x: 94, y: 66, z: -30 },
                                chestLocation: { x: 92, y: 66, z: -28 },
                                island: { location: { x: 74, y: 52, z: -41 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: 90, y: 68, z: -35 }, to: { x: 93, y: 71, z: -23 }, },
                                trader: [
                                    { location: { x: 93, y: 66, z: -25 }, rotation: 180, type: "item" },
                                    { location: { x: 93, y: 66, z: -34 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 82, y: 64, z: 30 }, },
                                resourceLocation: { x: 99, y: 66, z: 30 },
                                spawnpointLocation: { x: 94, y: 66, z: 30 },
                                chestLocation: { x: 92, y: 66, z: 28 },
                                island: { location: { x: 74, y: 52, z: 19 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 90, y: 68, z: 35 }, to: { x: 93, y: 71, z: 23 }, },
                                trader: [
                                    { location: { x: 93, y: 66, z: 34 }, rotation: 180, type: "item" },
                                    { location: { x: 93, y: 66, z: 25 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Cyan,
                                bed: { location: { x: 30, y: 64, z: 82 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 30, y: 66, z: 99 },
                                spawnpointLocation: { x: 30, y: 66, z: 94 },
                                chestLocation: { x: 28, y: 66, z: 92 },
                                island: { location: { x: 19, y: 52, z: 74 }, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: 35, y: 68, z: 90 }, to: { x: 23, y: 71, z: 93 }, },
                                trader: [
                                    { location: { x: 25, y: 66, z: 93 }, rotation: 270, type: "item" },
                                    { location: { x: 34, y: 66, z: 93 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.White,
                                bed: { location: { x: -30, y: 64, z: 82 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: -30, y: 66, z: 99 },
                                spawnpointLocation: { x: -30, y: 66, z: 94 },
                                chestLocation: { x: -28, y: 66, z: 92 },
                                island: { location: { x: -41, y: 52, z: 74 }, },
                                trader: [
                                    { location: { x: -34, y: 66, z: 93 }, rotation: 270, type: "item" },
                                    { location: { x: -25, y: 66, z: 93 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Pink,
                                bed: { location: { x: -82, y: 64, z: 30 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -99, y: 66, z: 30 },
                                spawnpointLocation: { x: -94, y: 66, z: 30 },
                                chestLocation: { x: -92, y: 66, z: 28 },
                                island: { location: { x: -105, y: 52, z: 19 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: -90, y: 68, z: 35 }, to: { x: -93, y: 71, z: 23 }, },
                                trader: [
                                    { location: { x: -93, y: 66, z: 25 }, rotation: 0, type: "item" },
                                    { location: { x: -93, y: 66, z: 34 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Gray,
                                bed: { location: { x: -82, y: 64, z: -30 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -99, y: 66, z: -30 },
                                spawnpointLocation: { x: -94, y: 66, z: -30 },
                                chestLocation: { x: -92, y: 66, z: -28 },
                                island: { location: { x: -105, y: 52, z: -41 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -90, y: 68, z: -35 }, to: { x: -93, y: 71, z: -23 }, },
                                trader: [
                                    { location: { x: -93, y: 66, z: -34 }, rotation: 0, type: "item" },
                                    { location: { x: -93, y: 66, z: -25 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                        ],
                        healPoolRadius: 20,
                        islandLoadTime: 1,
                    },
                    island: [
                        {
                            id: "side_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: -15, y: 50, z: 50 }, },
                                { location: { x: -90, y: 50, z: -15 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -15, y: 50, z: -90 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: 50, y: 50, z: -15 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: -69, y: 57, z: 24 }, },
                                { location: { x: -69, y: 57, z: -69 }, mirror: minecraft.StructureMirrorAxis.X, },
                                { location: { x: 24, y: 57, z: -69 }, mirror: minecraft.StructureMirrorAxis.XZ, },
                                { location: { x: 24, y: 57, z: 24 }, mirror: minecraft.StructureMirrorAxis.Z, },
                            ],
                        },
                        {
                            id: "center_island_1",
                            loadTime: 7,
                            islandData: [
                                { location: { x: -32, y: 50, z: -32 }, }
                            ],
                        },
                        {
                            id: "center_island_2",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 32, y: 61, z: -5 }, }
                            ],
                        },
                        {
                            id: "center_island_3",
                            loadTime: 1,
                            islandData: [
                                { location: { x: -5, y: 61, z: 32 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 89,
                        heightLimitMin: 62,
                    },
                },
            },

            /** 冰川 @type {BedwarsMapData} */
            glacier: {
                description: {
                    id: "glacier",
                    name: "冰川",
                    mode: BedwarsModeType.Classic,
                    isSolo: true,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 0, y: 79, z: 50 }, { x: 0, y: 79, z: -50 }, { x: 50, y: 79, z: 0 }, { x: -50, y: 79, z: 0 },],
                        emeraldSpawnerLocation: [{ x: 20, y: 78, z: 20 }, { x: 20, y: 78, z: -20 }, { x: -20, y: 78, z: 20 }, { x: -20, y: 78, z: -20 },],
                        distributeResource: false,
                        ironSpawnTimes: 3,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -32, y: 81, z: -65 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -32, y: 81, z: -86 },
                                spawnpointLocation: { x: -32, y: 81, z: -80 },
                                chestLocation: { x: -35, y: 81, z: -76 },
                                island: { location: { x: -44, y: 66, z: -89 }, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: -35, y: 81, z: -71 }, to: { x: -21, y: 95, z: -79 }, },
                                trader: [
                                    { location: { x: -28.5, y: 81, z: -87 }, rotation: 0, type: "item", },
                                    { location: { x: -35.5, y: 81, z: -87 }, rotation: 0, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 32, y: 81, z: -65 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 32, y: 81, z: -86 },
                                spawnpointLocation: { x: 32, y: 81, z: -80 },
                                chestLocation: { x: 35, y: 81, z: -76 },
                                island: { location: { x: 19, y: 66, z: -89 }, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 35, y: 81, z: -71 }, to: { x: 21, y: 95, z: -79 }, },
                                trader: [
                                    { location: { x: 35.5, y: 81, z: -87 }, rotation: 0, type: "item", },
                                    { location: { x: 28.5, y: 81, z: -87 }, rotation: 0, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 65, y: 81, z: -32 }, },
                                resourceLocation: { x: 86, y: 81, z: -32 },
                                spawnpointLocation: { x: 80, y: 81, z: -32 },
                                chestLocation: { x: 76, y: 81, z: -35 },
                                island: { location: { x: 62, y: 66, z: -44 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: 71, y: 81, z: -35 }, to: { x: 79, y: 95, z: -21 }, },
                                trader: [
                                    { location: { x: 87, y: 81, z: -28.5 }, rotation: 90, type: "item", },
                                    { location: { x: 87, y: 81, z: -35.5 }, rotation: 90, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 65, y: 81, z: 32 }, },
                                resourceLocation: { x: 86, y: 81, z: 32 },
                                spawnpointLocation: { x: 80, y: 81, z: 32 },
                                chestLocation: { x: 76, y: 81, z: 35 },
                                island: { location: { x: 62, y: 66, z: 19 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 71, y: 81, z: 35 }, to: { x: 79, y: 95, z: 21 }, },
                                trader: [
                                    { location: { x: 87, y: 81, z: 35.5 }, rotation: 90, type: "item", },
                                    { location: { x: 87, y: 81, z: 28.5 }, rotation: 90, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Cyan,
                                bed: { location: { x: 32, y: 81, z: 65 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 32, y: 81, z: 86 },
                                spawnpointLocation: { x: 32, y: 81, z: 80 },
                                chestLocation: { x: 35, y: 81, z: 76 },
                                island: { location: { x: 19, y: 66, z: 62 }, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: 35, y: 81, z: 71 }, to: { x: 21, y: 95, z: 79 }, },
                                trader: [
                                    { location: { x: 28.5, y: 81, z: 87 }, rotation: 180, type: "item", },
                                    { location: { x: 35.5, y: 81, z: 87 }, rotation: 180, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.White,
                                bed: { location: { x: -32, y: 81, z: 65 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: -32, y: 81, z: 86 },
                                spawnpointLocation: { x: -32, y: 81, z: 80 },
                                chestLocation: { x: -35, y: 81, z: 76 },
                                island: { location: { x: -44, y: 66, z: 62 }, },
                                trader: [
                                    { location: { x: -35.5, y: 81, z: 87 }, rotation: 180, type: "item", },
                                    { location: { x: -28.5, y: 81, z: 87 }, rotation: 180, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Pink,
                                bed: { location: { x: -65, y: 81, z: 32 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -86, y: 81, z: 32 },
                                spawnpointLocation: { x: -80, y: 81, z: 32 },
                                chestLocation: { x: -76, y: 81, z: 35 },
                                island: { location: { x: -89, y: 66, z: 19 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: -71, y: 81, z: 35 }, to: { x: -79, y: 95, z: 21 }, },
                                trader: [
                                    { location: { x: -87, y: 81, z: 28.5 }, rotation: 270, type: "item", },
                                    { location: { x: -87, y: 81, z: 35.5 }, rotation: 270, type: "upgrade", },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Gray,
                                bed: { location: { x: -65, y: 81, z: -32 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -86, y: 81, z: -32 },
                                spawnpointLocation: { x: -80, y: 81, z: -32 },
                                chestLocation: { x: -76, y: 81, z: -35 },
                                island: { location: { x: -89, y: 66, z: -44 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -71, y: 81, z: -35 }, to: { x: -79, y: 95, z: -21 }, },
                                trader: [
                                    { location: { x: -87, y: 81, z: -35.5 }, rotation: 270, type: "item", },
                                    { location: { x: -87, y: 81, z: -28.5 }, rotation: 270, type: "upgrade", },
                                ],
                            },

                        ],
                        healPoolRadius: 18,
                        islandLoadTime: 2,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: -9, y: 75, z: 43 }, },
                                { location: { x: -56, y: 75, z: -9 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -9, y: 75, z: -56 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: 43, y: 75, z: -9 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 8,
                            islandData: [
                                { location: { x: -27, y: 55, z: -27 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 106,
                        heightLimitMin: 75,
                    },
                },
            },

            /** 灯塔 @type {BedwarsMapData} */
            lighthouse: {
                description: {
                    id: "lighthouse",
                    name: "灯塔",
                    mode: BedwarsModeType.Classic,
                    isSolo: true,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: -49, y: 66, z: -52 }, { x: 55, y: 66, z: -52 }, { x: 55, y: 66, z: 52 }, { x: -49, y: 66, z: 52 },],
                        emeraldSpawnerLocation: [{ x: -7, y: 64, z: 14 }, { x: 13, y: 64, z: -14 }, { x: 3, y: 86, z: -7 }, { x: 3, y: 86, z: 7 },],
                        distributeResource: false,
                        ironSpawnTimes: 3,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -23, y: 66, z: -75 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -23, y: 65, z: -91 },
                                spawnpointLocation: { x: -23, y: 65, z: -87 },
                                chestLocation: { x: -19, y: 65, z: -86 },
                                island: { location: { x: -35, y: 55, z: -95 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: -35, y: 81, z: -84 }, to: { x: -16, y: 68, z: -76 }, },
                                trader: [
                                    { location: { x: -17, y: 65, z: -88.5 }, rotation: 90, type: "item" },
                                    { location: { x: -28, y: 65, z: -88.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 29, y: 66, z: -75 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 29, y: 65, z: -91 },
                                spawnpointLocation: { x: 29, y: 65, z: -87 },
                                chestLocation: { x: 33, y: 65, z: -86 },
                                island: { location: { x: 17, y: 55, z: -95 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: 17, y: 81, z: -84 }, to: { x: 36, y: 68, z: -76 }, },
                                trader: [
                                    { location: { x: 35, y: 65, z: -88.5 }, rotation: 90, type: "item" },
                                    { location: { x: 24, y: 65, z: -88.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 78, y: 66, z: -26 }, },
                                resourceLocation: { x: 94, y: 65, z: -26 },
                                spawnpointLocation: { x: 90, y: 65, z: -26 },
                                chestLocation: { x: 89, y: 65, z: -22 },
                                island: { location: { x: 72, y: 55, z: -38 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: 87, y: 81, z: -38 }, to: { x: 79, y: 68, z: -19 }, },
                                trader: [
                                    { location: { x: 91.5, y: 65, z: -20 }, rotation: 180, type: "item" },
                                    { location: { x: 91.5, y: 65, z: -30.5 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 78, y: 66, z: 26 }, },
                                resourceLocation: { x: 94, y: 65, z: 26 },
                                spawnpointLocation: { x: 90, y: 65, z: 26 },
                                chestLocation: { x: 89, y: 65, z: 30 },
                                island: { location: { x: 72, y: 55, z: 14 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: 87, y: 81, z: 14 }, to: { x: 79, y: 68, z: 33 }, },
                                trader: [
                                    { location: { x: 91.5, y: 65, z: 32 }, rotation: 180, type: "item" },
                                    { location: { x: 91.5, y: 65, z: 21 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Cyan,
                                bed: { location: { x: 29, y: 66, z: 75 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 29, y: 65, z: 91 },
                                spawnpointLocation: { x: 29, y: 65, z: 87 },
                                chestLocation: { x: 25, y: 65, z: 86 },
                                island: { location: { x: 19, y: 55, z: 69 }, },
                                flagLocation: { from: { x: 41, y: 81, z: 84 }, to: { x: 22, y: 68, z: 76 }, },
                                trader: [
                                    { location: { x: 23, y: 65, z: 88.5 }, rotation: 270, type: "item" },
                                    { location: { x: 34, y: 65, z: 88.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.White,
                                bed: { location: { x: -23, y: 66, z: 75 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: -23, y: 65, z: 91 },
                                spawnpointLocation: { x: -23, y: 65, z: 87 },
                                chestLocation: { x: -27, y: 65, z: 86 },
                                island: { location: { x: -33, y: 55, z: 69 }, },
                                trader: [
                                    { location: { x: -29, y: 65, z: 88.5 }, rotation: 270, type: "item" },
                                    { location: { x: -18, y: 65, z: 88.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Pink,
                                bed: { location: { x: -72, y: 66, z: 26 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -88, y: 65, z: 26 },
                                spawnpointLocation: { x: -84, y: 65, z: 26 },
                                chestLocation: { x: -83, y: 65, z: 22 },
                                island: { location: { x: -92, y: 55, z: 16 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -81, y: 81, z: 38 }, to: { x: -73, y: 68, z: 19 }, },
                                trader: [
                                    { location: { x: -85.5, y: 65, z: 20 }, rotation: 0, type: "item" },
                                    { location: { x: -85.5, y: 65, z: 31 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Gray,
                                bed: { location: { x: -72, y: 66, z: -26 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -88, y: 65, z: -26 },
                                spawnpointLocation: { x: -84, y: 65, z: -26 },
                                chestLocation: { x: -83, y: 65, z: -30 },
                                island: { location: { x: -92, y: 55, z: -36 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -81, y: 81, z: -14 }, to: { x: -73, y: 68, z: -33 }, },
                                trader: [
                                    { location: { x: -85.5, y: 65, z: -32 }, rotation: 0, type: "item" },
                                    { location: { x: -85.5, y: 65, z: -21 }, rotation: 180, type: "upgrade" },
                                ],
                            },

                        ],
                        healPoolRadius: 19,
                        islandLoadTime: 1,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: -64, y: 57, z: 44 }, },
                                { location: { x: -61, y: 57, z: -67 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: 47, y: 57, z: -64 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: 47, y: 57, z: 44 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "side_island",
                            loadTime: 3,
                            islandData: [
                                { location: { x: -17, y: 50, z: 25 }, },
                                { location: { x: -49, y: 50, z: -20 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -17, y: 50, z: -52 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: 28, y: 50, z: -20 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 8,
                            islandData: [
                                { location: { x: -17, y: 46, z: -20 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 100,
                        heightLimitMin: 62,
                    },
                },
            },

            /** 乐园 @type {BedwarsMapData} */
            playground: {
                description: {
                    id: "playground",
                    name: "乐园",
                    mode: BedwarsModeType.Classic,
                    isSolo: true,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: -62, y: 61, z: 0 }, { x: 0, y: 61, z: -62 }, { x: 62, y: 61, z: 0 }, { x: 0, y: 61, z: 62 },],
                        emeraldSpawnerLocation: [{ x: 26, y: 70, z: 26 }, { x: 26, y: 70, z: -26 }, { x: -26, y: 70, z: 26 }, { x: -26, y: 70, z: -26 },],
                        distributeResource: false,
                        ironSpawnTimes: 3,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -38, y: 62, z: -80 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -38, y: 62, z: -97 },
                                spawnpointLocation: { x: -38, y: 62, z: -92 },
                                chestLocation: { x: -41, y: 62, z: -89 },
                                island: { location: { x: -51, y: 57, z: -101 }, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: -46, y: 58, z: -78 }, to: { x: -30, y: 72, z: -99 } },
                                trader: [
                                    { location: { x: -33, y: 62, z: -93.5 }, rotation: 90, type: "item" },
                                    { location: { x: -33, y: 62, z: -90.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 38, y: 62, z: -80 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 38, y: 62, z: -97 },
                                spawnpointLocation: { x: 38, y: 62, z: -92 },
                                chestLocation: { x: 41, y: 62, z: -89 },
                                island: { location: { x: 29, y: 57, z: -101 }, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 46, y: 58, z: -78 }, to: { x: 30, y: 72, z: -99 }, },
                                trader: [
                                    { location: { x: 33, y: 62, z: -90.5 }, rotation: 270, type: "item" },
                                    { location: { x: 33, y: 62, z: -93.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 80, y: 62, z: -38 }, },
                                resourceLocation: { x: 97, y: 62, z: -38 },
                                spawnpointLocation: { x: 92, y: 62, z: -38 },
                                chestLocation: { x: 89, y: 62, z: -41 },
                                island: { location: { x: 76, y: 57, z: -51 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: 78, y: 58, z: -46 }, to: { x: 99, y: 72, z: -30 }, },
                                trader: [
                                    { location: { x: 93.5, y: 62, z: -33 }, rotation: 180, type: "item" },
                                    { location: { x: 90.5, y: 62, z: -33 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 80, y: 62, z: 38 }, },
                                resourceLocation: { x: 97, y: 62, z: 38 },
                                spawnpointLocation: { x: 92, y: 62, z: 38 },
                                chestLocation: { x: 89, y: 62, z: 41 },
                                island: { location: { x: 76, y: 57, z: 29 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 78, y: 58, z: 46 }, to: { x: 99, y: 72, z: 30 }, },
                                trader: [
                                    { location: { x: 90.5, y: 62, z: 33 }, rotation: 0, type: "item" },
                                    { location: { x: 93.5, y: 62, z: 33 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Cyan,
                                bed: { location: { x: 38, y: 62, z: 80 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 38, y: 62, z: 97 },
                                spawnpointLocation: { x: 38, y: 62, z: 92 },
                                chestLocation: { x: 41, y: 62, z: 89 },
                                island: { location: { x: 29, y: 57, z: 76 }, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: 46, y: 58, z: 78 }, to: { x: 30, y: 72, z: 99 }, },
                                trader: [
                                    { location: { x: 33, y: 62, z: 93.5 }, rotation: 270, type: "item" },
                                    { location: { x: 33, y: 62, z: 90.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.White,
                                bed: { location: { x: -38, y: 62, z: 80 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: -38, y: 62, z: 97 },
                                spawnpointLocation: { x: -38, y: 62, z: 92 },
                                chestLocation: { x: -41, y: 62, z: 89 },
                                island: { location: { x: -51, y: 57, z: 76 }, },
                                trader: [
                                    { location: { x: -33, y: 62, z: 90.5 }, rotation: 90, type: "item" },
                                    { location: { x: -33, y: 62, z: 93.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Pink,
                                bed: { location: { x: -80, y: 62, z: 38 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -97, y: 62, z: 38 },
                                spawnpointLocation: { x: -92, y: 62, z: 38 },
                                chestLocation: { x: -89, y: 62, z: 41 },
                                island: { location: { x: -101, y: 57, z: 29 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: -78, y: 58, z: 46 }, to: { x: -99, y: 72, z: 30 }, },
                                trader: [
                                    { location: { x: -93.5, y: 62, z: 33 }, rotation: 0, type: "item" },
                                    { location: { x: -90.5, y: 62, z: 33 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Gray,
                                bed: { location: { x: -80, y: 62, z: -38 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -97, y: 62, z: -38 },
                                spawnpointLocation: { x: -92, y: 62, z: -38 },
                                chestLocation: { x: -89, y: 62, z: -41 },
                                island: { location: { x: -101, y: 57, z: -51 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -78, y: 58, z: -46 }, to: { x: -99, y: 72, z: -30 }, },
                                trader: [
                                    { location: { x: -90.5, y: 62, z: -33 }, rotation: 180, type: "item" },
                                    { location: { x: -93.5, y: 62, z: -33 }, rotation: 180, type: "upgrade" },
                                ],
                            },

                        ],
                        healPoolRadius: 17,
                        islandLoadTime: 1,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: -70, y: 51, z: -26 }, },
                                { location: { x: -26, y: 51, z: -70 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: 38, y: 51, z: -26 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: -26, y: 51, z: 38 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island_1",
                            loadTime: 10,
                            islandData: [
                                { location: { x: -36, y: 62, z: -36 }, }
                            ],
                        },
                        {
                            id: "center_island_2",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 28, y: 62, z: -36 }, }
                            ],
                        },
                        {
                            id: "center_island_3",
                            loadTime: 1,
                            islandData: [
                                { location: { x: -36, y: 62, z: 28 }, }
                            ],
                        },
                        {
                            id: "center_island_4",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 28, y: 62, z: 28 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 87,
                        heightLimitMin: 57,
                    },
                    removeItemEntity: ["minecraft:white_carpet"]
                },
            },

            /** 屋顶 @type {BedwarsMapData} */
            rooftop: {
                description: {
                    id: "rooftop",
                    name: "屋顶",
                    mode: BedwarsModeType.Classic,
                    isSolo: true,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 39, y: 70, z: 39 }, { x: -39, y: 70, z: 39 }, { x: 39, y: 70, z: -39 }, { x: -39, y: 70, z: -39 },],
                        emeraldSpawnerLocation: [{ x: 11, y: 79, z: 11 }, { x: -11, y: 79, z: -11 }, { x: 11, y: 70, z: 13 }, { x: -11, y: 70, z: -13 },],
                        distributeResource: false,
                        ironSpawnTimes: 3,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -34, y: 66, z: -79 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -34, y: 66, z: -96 },
                                spawnpointLocation: { x: -34, y: 66, z: -89 },
                                chestLocation: { x: -38, y: 66, z: -85 },
                                island: { location: { x: -47, y: 20, z: -100 }, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: -42, y: 66, z: -83 }, to: { x: -40, y: 81, z: -87 }, },
                                trader: [
                                    { location: { x: -28, y: 66, z: -90.5 }, rotation: 90, type: "item" },
                                    { location: { x: -40, y: 66, z: -90.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 34, y: 66, z: -79 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 34, y: 66, z: -96 },
                                spawnpointLocation: { x: 34, y: 66, z: -89 },
                                chestLocation: { x: 38, y: 66, z: -85 },
                                island: { location: { x: 21, y: 20, z: -100 }, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 42, y: 66, z: -83 }, to: { x: 40, y: 81, z: -87 }, },
                                trader: [
                                    { location: { x: 40, y: 66, z: -90.5 }, rotation: 90, type: "item" },
                                    { location: { x: 28, y: 66, z: -90.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 79, y: 66, z: -34 }, },
                                resourceLocation: { x: 96, y: 66, z: -34 },
                                spawnpointLocation: { x: 89, y: 66, z: -34 },
                                chestLocation: { x: 85, y: 66, z: -38 },
                                island: { location: { x: 75, y: 20, z: -47 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.X, },
                                flagLocation: { from: { x: 83, y: 66, z: -42 }, to: { x: 87, y: 81, z: -40 }, },
                                trader: [
                                    { location: { x: 90.5, y: 66, z: -28 }, rotation: 180, type: "item" },
                                    { location: { x: 90.5, y: 66, z: -40 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 79, y: 66, z: 34 }, },
                                resourceLocation: { x: 96, y: 66, z: 34 },
                                spawnpointLocation: { x: 89, y: 66, z: 34 },
                                chestLocation: { x: 85, y: 66, z: 38 },
                                island: { location: { x: 75, y: 20, z: 21 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.XZ, },
                                flagLocation: { from: { x: 83, y: 66, z: 42 }, to: { x: 87, y: 81, z: 40 }, },
                                trader: [
                                    { location: { x: 90.5, y: 66, z: 40 }, rotation: 180, type: "item" },
                                    { location: { x: 90.5, y: 66, z: 28 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Cyan,
                                bed: { location: { x: 34, y: 66, z: 79 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 34, y: 66, z: 96 },
                                spawnpointLocation: { x: 34, y: 66, z: 89 },
                                chestLocation: { x: 38, y: 66, z: 85 },
                                island: { location: { x: 21, y: 20, z: 75 }, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: 42, y: 66, z: 83 }, to: { x: 40, y: 81, z: 87 }, },
                                trader: [
                                    { location: { x: 28, y: 66, z: 90.5 }, rotation: 270, type: "item" },
                                    { location: { x: 40, y: 66, z: 90.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.White,
                                bed: { location: { x: -34, y: 66, z: 79 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: -34, y: 66, z: 96 },
                                spawnpointLocation: { x: -34, y: 66, z: 89 },
                                chestLocation: { x: -38, y: 66, z: 85 },
                                island: { location: { x: -47, y: 20, z: 75 }, },
                                trader: [
                                    { location: { x: -40, y: 66, z: 90.5 }, rotation: 270, type: "item" },
                                    { location: { x: -28, y: 66, z: 90.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Pink,
                                bed: { location: { x: -79, y: 66, z: 34 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -96, y: 66, z: 34 },
                                spawnpointLocation: { x: -89, y: 66, z: 34 },
                                chestLocation: { x: -85, y: 66, z: 38 },
                                island: { location: { x: -100, y: 20, z: 21 }, rotation: minecraft.StructureRotation.Rotate90, mirror: minecraft.StructureMirrorAxis.Z, },
                                flagLocation: { from: { x: -83, y: 66, z: 42 }, to: { x: -87, y: 81, z: 40 }, },
                                trader: [
                                    { location: { x: -90.5, y: 66, z: 28 }, rotation: 0, type: "item" },
                                    { location: { x: -90.5, y: 66, z: 40 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Gray,
                                bed: { location: { x: -79, y: 66, z: -34 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -96, y: 66, z: -34 },
                                spawnpointLocation: { x: -89, y: 66, z: -34 },
                                chestLocation: { x: -85, y: 66, z: -38 },
                                island: { location: { x: -100, y: 20, z: -47 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -83, y: 66, z: -42 }, to: { x: -87, y: 81, z: -40 }, },
                                trader: [
                                    { location: { x: -90.5, y: 66, z: -40 }, rotation: 0, type: "item" },
                                    { location: { x: -90.5, y: 66, z: -28 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                        ],
                        healPoolRadius: 14,
                        islandLoadTime: 4,
                    },
                    island: [
                        {
                            id: "diamond_island",
                            loadTime: 2,
                            islandData: [
                                { location: { x: -49, y: 20, z: -49 }, },
                                { location: { x: 29, y: 20, z: -49 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: 29, y: 20, z: 29 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: -49, y: 20, z: 29 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island_1",
                            loadTime: 9,
                            islandData: [
                                { location: { x: -22, y: 20, z: 24 }, },
                                { location: { x: -70, y: 20, z: -18 }, rotation: minecraft.StructureRotation.Rotate90, },
                                { location: { x: -18, y: 20, z: -70 }, rotation: minecraft.StructureRotation.Rotate180, },
                                { location: { x: 24, y: 20, z: -22 }, rotation: minecraft.StructureRotation.Rotate270, },
                            ],
                        },
                        {
                            id: "center_island_2",
                            loadTime: 11,
                            islandData: [
                                { location: { x: -22, y: 20, z: -22 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 91,
                        heightLimitMin: 62,
                    },
                    removeItemEntity: ["minecraft:white_carpet", "minecraft:rail", "minecraft:detector_rail", "minecraft:flower_pot"],
                },
            },

            /** 瀑布 @type {BedwarsMapData} */
            waterfall: {
                description: {
                    id: "waterfall",
                    name: "瀑布",
                    mode: BedwarsModeType.Classic,
                    isSolo: true,
                },
                components: {
                    resource: {
                        diamondSpawnerLocation: [{ x: 0, y: 63, z: -52 }, { x: 52, y: 63, z: 0 }, { x: 0, y: 63, z: 52 }, { x: -52, y: 63, z: 0 },],
                        emeraldSpawnerLocation: [{ x: 12, y: 77, z: 12 }, { x: 12, y: 77, z: -12 }, { x: -12, y: 77, z: 12 }, { x: -12, y: 77, z: -12 },],
                        distributeResource: false,
                        ironSpawnTimes: 3,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: -33, y: 66, z: -64 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: -34, y: 66, z: -77 },
                                spawnpointLocation: { x: -34, y: 66, z: -74 },
                                chestLocation: { x: -31, y: 66, z: -71 },
                                island: { location: { x: -45, y: 57, z: -84 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: -28, y: 86, z: -72 }, to: { x: -22, y: 79, z: -74 }, },
                                trader: [
                                    { location: { x: -29, y: 66, z: -73.5 }, rotation: 90, type: "item" },
                                    { location: { x: -39, y: 66, z: -73.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 33, y: 66, z: -64 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 32, y: 66, z: -77 },
                                spawnpointLocation: { x: 32, y: 66, z: -74 },
                                chestLocation: { x: 35, y: 66, z: -71 },
                                island: { location: { x: 21, y: 57, z: -84 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: 38, y: 86, z: -72 }, to: { x: 44, y: 79, z: -74 }, },
                                trader: [
                                    { location: { x: 37, y: 66, z: -73.5 }, rotation: 90, type: "item" },
                                    { location: { x: 27, y: 66, z: -73.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Green,
                                bed: { location: { x: 64, y: 66, z: -33 }, },
                                resourceLocation: { x: 77, y: 66, z: -34 },
                                spawnpointLocation: { x: 74, y: 66, z: -34 },
                                chestLocation: { x: 71, y: 66, z: -31 },
                                island: { location: { x: 60, y: 57, z: -45 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: 72, y: 86, z: -28 }, to: { x: 74, y: 79, z: -22 }, },
                                trader: [
                                    { location: { x: 73.5, y: 66, z: -29 }, rotation: 180, type: "item" },
                                    { location: { x: 73.5, y: 66, z: -39 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Yellow,
                                bed: { location: { x: 64, y: 66, z: 33 }, },
                                resourceLocation: { x: 77, y: 66, z: 32 },
                                spawnpointLocation: { x: 74, y: 66, z: 32 },
                                chestLocation: { x: 71, y: 66, z: 35 },
                                island: { location: { x: 60, y: 57, z: 21 }, rotation: minecraft.StructureRotation.Rotate270, },
                                flagLocation: { from: { x: 72, y: 86, z: 38 }, to: { x: 74, y: 79, z: 44 }, },
                                trader: [
                                    { location: { x: 73.5, y: 66, z: 37 }, rotation: 180, type: "item" },
                                    { location: { x: 73.5, y: 66, z: 27 }, rotation: 0, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Cyan,
                                bed: { location: { x: 33, y: 66, z: 64 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 34, y: 66, z: 77 },
                                spawnpointLocation: { x: 34, y: 66, z: 74 },
                                chestLocation: { x: 31, y: 66, z: 71 },
                                island: { location: { x: 22, y: 57, z: 60 }, },
                                flagLocation: { from: { x: 28, y: 86, z: 72 }, to: { x: 22, y: 79, z: 74 }, },
                                trader: [
                                    { location: { x: 29, y: 66, z: 73.5 }, rotation: 270, type: "item" },
                                    { location: { x: 39, y: 66, z: 73.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.White,
                                bed: { location: { x: -33, y: 66, z: 64 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: -32, y: 66, z: 77 },
                                spawnpointLocation: { x: -32, y: 66, z: 74 },
                                chestLocation: { x: -35, y: 66, z: 71 },
                                island: { location: { x: -44, y: 57, z: 60 }, },
                                trader: [
                                    { location: { x: -37, y: 66, z: 73.5 }, rotation: 270, type: "item" },
                                    { location: { x: -27, y: 66, z: 73.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Pink,
                                bed: { location: { x: -64, y: 66, z: 33 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -77, y: 66, z: 34 },
                                spawnpointLocation: { x: -74, y: 66, z: 34 },
                                chestLocation: { x: -71, y: 66, z: 31 },
                                island: { location: { x: -84, y: 57, z: 22 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -72, y: 86, z: 28 }, to: { x: -74, y: 79, z: 22 }, },
                                trader: [
                                    { location: { x: -73.5, y: 66, z: 29 }, rotation: 0, type: "item" },
                                    { location: { x: -73.5, y: 66, z: 39 }, rotation: 180, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Gray,
                                bed: { location: { x: -64, y: 66, z: -33 }, rotation: minecraft.StructureRotation.Rotate180, },
                                resourceLocation: { x: -77, y: 66, z: -32 },
                                spawnpointLocation: { x: -74, y: 66, z: -32 },
                                chestLocation: { x: -71, y: 66, z: -35 },
                                island: { location: { x: -84, y: 57, z: -44 }, rotation: minecraft.StructureRotation.Rotate90, },
                                flagLocation: { from: { x: -72, y: 86, z: -38 }, to: { x: -74, y: 79, z: -44 }, },
                                trader: [
                                    { location: { x: -73.5, y: 66, z: -37 }, rotation: 0, type: "item" },
                                    { location: { x: -73.5, y: 66, z: -27 }, rotation: 180, type: "upgrade" },
                                ],
                            },

                        ],
                        healPoolRadius: 12,
                        islandLoadTime: 2,
                    },
                    island: [
                        {
                            id: "center_island_1",
                            loadTime: 15,
                            islandData: [
                                { location: { x: -58, y: 45, z: -58 }, }
                            ],
                        },
                        {
                            id: "center_island_2",
                            loadTime: 16,
                            islandData: [
                                { location: { x: -58, y: 45, z: 0 }, }
                            ],
                        },
                        {
                            id: "center_island_3",
                            loadTime: 15,
                            islandData: [
                                { location: { x: 1, y: 45, z: 0 }, }
                            ],
                        },
                        {
                            id: "center_island_4",
                            loadTime: 15,
                            islandData: [
                                { location: { x: 1, y: 45, z: -58 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 102,
                        heightLimitMin: 57,
                    },
                },
            },

        },

    },

    /** 夺点模式地图数据 */
    capture: {

        twoTeams: {

            /** 地图：野餐 @type {BedwarsMapData} */
            picnic: {
                description: {
                    id: "picnic_capture",
                    name: "野餐",
                    mode: BedwarsModeType.Capture,
                },
                components: {
                    capture: {
                        validBeds: [
                            { location: { x: 0, y: 64, z: -63 }, teamId: BedwarsTeamType.Red, },
                            { location: { x: 0, y: 64, z: 61 }, teamId: BedwarsTeamType.Blue, },
                            { location: { x: 48, y: 64, z: 10 }, },
                            { location: { x: 0, y: 64, z: -1 }, },
                            { location: { x: -48, y: 64, z: -11 }, },
                        ],
                        score: 1500,
                    },
                    resource: {
                        diamondSpawnerLocation: [{ x: -36, y: 65, z: -38 }, { x: 36, y: 65, z: -33 }, { x: 36, y: 65, z: 37 }, { x: -36, y: 65, z: 32 },],
                        emeraldSpawnerLocation: [{ x: -7, y: 69, z: -11 }, { x: 8, y: 69, z: 12 },],
                        distributeResource: false,
                    },
                    team: {
                        teamData: [
                            {
                                id: BedwarsTeamType.Red,
                                bed: { location: { x: 0, y: 64, z: -63 }, rotation: minecraft.StructureRotation.Rotate270, },
                                resourceLocation: { x: 0, y: 63, z: -78 },
                                spawnpointLocation: { x: 0, y: 63, z: -74 },
                                chestLocation: { x: 3, y: 63, z: -73 },
                                island: { location: { x: -12, y: 54, z: -82 }, },
                                flagLocation: { from: { x: -5, y: 63, z: -59 }, to: { x: 13, y: 80, z: -72 } },
                                trader: [
                                    { location: { x: 6, y: 63, z: -75.5 }, rotation: 90, type: "item" },
                                    { location: { x: -6, y: 63, z: -75.5 }, rotation: 270, type: "upgrade" },
                                ],
                            },
                            {
                                id: BedwarsTeamType.Blue,
                                bed: { location: { x: 0, y: 64, z: 61 }, rotation: minecraft.StructureRotation.Rotate90, },
                                resourceLocation: { x: 0, y: 63, z: 77 },
                                spawnpointLocation: { x: 0, y: 63, z: 73 },
                                chestLocation: { x: -3, y: 63, z: 72 },
                                island: { location: { x: -16, y: 54, z: 33 }, rotation: minecraft.StructureRotation.Rotate180, },
                                flagLocation: { from: { x: 5, y: 63, z: 58 }, to: { x: -13, y: 80, z: 71 }, },
                                trader: [
                                    { location: { x: -6, y: 63, z: 74.5 }, rotation: 270, type: "item" },
                                    { location: { x: 6, y: 63, z: 74.5 }, rotation: 90, type: "upgrade" },
                                ],
                            },
                        ],
                        healPoolRadius: 19,
                        islandLoadTime: 4,
                    },
                    island: [
                        {
                            id: "side_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 38, y: 57, z: -5 }, },
                                { location: { x: -63, y: 57, z: -23 }, rotation: minecraft.StructureRotation.Rotate180, }
                            ],
                        },
                        {
                            id: "diamond_island",
                            loadTime: 1,
                            islandData: [
                                { location: { x: 29, y: 58, z: -44 }, },
                                { location: { x: 29, y: 58, z: 31 }, mirror: minecraft.StructureMirrorAxis.X, },
                                { location: { x: -48, y: 58, z: -49 }, mirror: minecraft.StructureMirrorAxis.Z, },
                                { location: { x: -48, y: 58, z: 26 }, mirror: minecraft.StructureMirrorAxis.XZ, },
                            ],
                        },
                        {
                            id: "center_island",
                            loadTime: 10,
                            islandData: [
                                { location: { x: -21, y: 48, z: -22 }, }
                            ],
                        },
                    ],
                    size: {
                        heightLimitMax: 89,
                        heightLimitMin: 59,
                    },
                }
            }

        }

    },

};

// ===== 商人数据 =====

/**
 * @typedef BedwarsCategoryItem 定义分类物品信息
 * @property {string} icon 物品分类物品的图标物品
 * @property {BedwarsItemShopitemCategory} category 物品分类的 ID
 */

/** 物品类商人标签物品信息 */
export const categoryItemData = {
    /** 快速购买 @type {BedwarsCategoryItem} */
    quickBuy: {
        icon: "bedwars:category_quick_buy",
        category: BedwarsItemShopitemCategory.QuickBuy,
    },
    /** 方块 @type {BedwarsCategoryItem} */
    blocks: {
        icon: "bedwars:category_blocks",
        category: BedwarsItemShopitemCategory.Blocks,
    },
    /** 近战 @type {BedwarsCategoryItem} */
    melee: {
        icon: "bedwars:category_melee",
        category: BedwarsItemShopitemCategory.Melee,
    },
    /** 盔甲 @type {BedwarsCategoryItem} */
    armor: {
        icon: "bedwars:category_armor",
        category: BedwarsItemShopitemCategory.Armor,
    },
    /** 工具 @type {BedwarsCategoryItem} */
    tools: {
        icon: "bedwars:category_tools",
        category: BedwarsItemShopitemCategory.Tools,
    },
    /** 远程 @type {BedwarsCategoryItem} */
    ranged: {
        icon: "bedwars:category_ranged",
        category: BedwarsItemShopitemCategory.Ranged,
    },
    /** 药水 @type {BedwarsCategoryItem} */
    potions: {
        icon: "bedwars:category_potions",
        category: BedwarsItemShopitemCategory.Potions,
    },
    /** 实用道具 @type {BedwarsCategoryItem} */
    utility: {
        icon: "bedwars:category_utility",
        category: BedwarsItemShopitemCategory.Utility,
    },
    /** 轮换物品 @type {BedwarsCategoryItem} */
    rotatingItems: {
        icon: "bedwars:category_rotating_items",
        category: BedwarsItemShopitemCategory.RotatingItems,
    },
};

// 商店物品基本信息
/**
 * @typedef BedwarsShopitemModeEnabledDescription 商店物品启用信息
 * @property {boolean} [classic] 该物品是否在经典模式启用 | 默认值：true
 * @property {boolean} [capture] 该物品是否在夺点模式启用 | 默认值：true
 * @property {boolean} [experience] 该物品是否在经验模式启用 | 默认值：true
 * @property {boolean} [rush] 该物品是否在疾速模式启用 | 默认值：true
 */

// 物品类商店物品基本信息
/**
 * @typedef BedwarsItemShopitemData 定义物品类商店物品信息
 * @property {BedwarsItemShopitemDescription} description 物品类类商店物品描述
 * @property {BedwarsItemShopitemComponent} [component] 物品类商店物品组件（单物品形式可用）
 * @property {BedwarsItemShopitemComponent[]} [components] 物品类商店物品组件（多物品形式可用）
 * 
 * @typedef BedwarsItemShopitemDescription 物品类商店物品描述
 * @property {"item"|"itemGroup"} format 商店物品形式
 * @property {BedwarsItemShopitemCategory} category 商店物品类别
 * @property {string[]} [description] 物品简介，按照 lore 的形式显示到商店物品上，一个字符串代表一行
 * @property {boolean} [isQuickBuy] 是否为快速购买物品，若是则在商店首页显示
 * @property {BedwarsShopitemModeEnabledDescription} [modeEnabled] 该物品在特定模式下是否启用 | 默认值：均为 true
 * @property {boolean} [isArmor] 该物品是否为盔甲，它是永久性装备，不会直接给予
 * @property {boolean} [isShears] 该物品是否为剪刀，它是永久性装备，不会直接给予
 * @property {boolean} [isPickaxe] 该物品是否为镐子，它是永久性装备，不会直接给予
 * @property {boolean} [isAxe] 该物品是否为斧头，它是永久性装备，不会直接给予
 * 
 * @typedef BedwarsItemShopitemComponent 物品类商店物品组件
 * @property {string} id 物品 ID，决定显示在商店内的商店物品和给予玩家的物品
 * @property {number} amount 物品数量，决定显示在商店内的物品数量和给予玩家的物品数量
 * @property {BedwarsItemResourceComponent} resource 指定该物品的资源需求
 * @property {BedwarsItemTierComponent} [tier] 指定该物品的等级，多物品情况下应指定该组件，以指定显示物品的条件
 * @property {BedwarsItemRealItemIdComponent} [realItemId] 指定该物品是否要覆写默认值，不指定该组件时将默认将给予物品的 ID 设置为 bedwars:(id)
 * @property {BedwarsItemEnchantmentComponent} [enchantment] 物品的附魔信息
 * @property {string[]} [lore] 给予物品后的 lore 信息
 * @property {string[]} [removeItem] 购买此物品后将移除哪些物品，应指定为物品 ID 的数组
 */

// 物品类商店物品组件
/**
 * @typedef BedwarsItemRealItemIdComponent 真实 ID 组件
 * @property {boolean} [isVanilla] 该物品是否为原版物品，指定该参数将设置 ID 为 minecraft:(id)，指定 id 参数时会直接覆盖该参数的解析
 * @property {boolean} [isColored] 该物品是否为彩色物品，指定该参数将设置 ID 为 bedwars:(队伍颜色)_(id)，指定 id 参数时会直接覆盖该参数的解析
 * @property {string} [id] 指定要直接覆写为的 ID 
 * 
 * @typedef BedwarsItemResourceComponent 所需物品组件
 * @property {BedwarsResourceType} type 该物品需要什么类型的资源
 * @property {number} amount 该物品需要多少资源
 * @property {number} [amountInSolo] 该物品在 8 队模式下需要多少资源，若不指定则默认为 amount
 * @property {number} [experienceAmount] 该物品在经验模式下需要多少资源，若不指定则默认为 (资源价格)*amount
 * @property {number} [experienceAmountInSolo] 该物品在 8 队经验模式下需要多少资源，若不指定则默认为 (资源价格)*amountInSolo
 * @property {BedwarsResourceType} [amplifier] 当资源使用经验购买时，资源将按照何种资源的价值（注意：不是价格）放大，若不指定则不放大
 * @property {number} [multiplier] 当资源使用经验购买时，资源将按照该种资源的价格的多少倍继续放大，若不指定则不放大
 * 
 * @typedef BedwarsItemEnchantmentComponent 物品附魔组件
 * @property {lib.EnchantmentInfo[]} [list] 物品固有的附魔
 * @property {boolean} [applySharpness] （仅限非永久性物品可用）是否在玩家所在团队拥有锋利附魔升级时添加锋利附魔
 * @property {boolean} [applyFeatherFalling] （仅限非永久性物品可用）是否在玩家所在团队拥有缓冲靴子升级时添加摔落缓冲附魔
 * 
 * @typedef BedwarsItemTierComponent 物品等级组件
 * @property {number} tier 商店物品等级，对于堆叠式物品（format: itemGroup），当该玩家的对应物品升级的等级 = tier - 1 时允许购买；对于单个物品，该玩家的对应物品升级的等级 < tier 时允许购买
 * @property {boolean} [showCurrentTier] 显示当前等级和物品可升级提示
 * @property {boolean} [loseTierUponDeath] 物品是否会降级，同时显示降级提示
 */

/** 物品类商店物品基本信息 */
export const itemShopitemData = {

    // ===== 方块 =====

    /** 羊毛，4 铁锭 -> 16 羊毛 @type {BedwarsItemShopitemData} */
    wool: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Blocks,
            description: ["可用于搭桥穿越岛屿。搭出的桥的颜色会对应你的队伍颜色。"],
            isQuickBuy: true,
        },
        component: {
            id: "wool",
            amount: 16,
            resource: { type: BedwarsResourceType.Iron, amount: 4 },
            realItemId: { isColored: true },
        },
    },
    /** 硬化粘土（陶瓦），12 铁锭 -> 16 硬化粘土 @type {BedwarsItemShopitemData} */
    stainedHardenedClay: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Blocks,
            description: ["用于保卫床的基础方块。"],
        },
        component: {
            id: "stained_hardened_clay",
            amount: 16,
            resource: { type: BedwarsResourceType.Iron, amount: 12 },
            realItemId: { isColored: true }
        },
    },
    /** 防爆玻璃，12 铁锭 -> 4 防爆玻璃 @type {BedwarsItemShopitemData} */
    blastProofGlass: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Blocks,
            description: ["免疫爆炸。"],
        },
        component: {
            id: "blast_proof_glass",
            amount: 4,
            resource: { type: BedwarsResourceType.Iron, amount: 12 },
            realItemId: { isColored: true }
        },
    },
    /** 末地石，24 铁锭 -> 12 末地石 @type {BedwarsItemShopitemData} */
    endStone: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Blocks,
            description: ["用于保卫床的坚固方块。"],
            isQuickBuy: true,
        },
        component: {
            id: "end_stone",
            amount: 12,
            resource: { type: BedwarsResourceType.Iron, amount: 24 },
        },
    },
    /** 梯子，4 铁锭 -> 8 梯子 @type {BedwarsItemShopitemData} */
    ladder: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Blocks,
            description: ["可用于救助在树上卡住的猫。"],
        },
        component: {
            id: "ladder",
            amount: 8,
            resource: { type: BedwarsResourceType.Iron, amount: 4 },
            realItemId: { isVanilla: true }
        },
    },
    /** 木板，4 金锭 -> 16 木板 @type {BedwarsItemShopitemData} */
    planks: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Blocks,
            description: ["用于保卫床的优质方块。能有效", "抵御镐子的破坏。"],
            isQuickBuy: true,
        },
        component: {
            id: "oak_planks",
            amount: 16,
            resource: { type: BedwarsResourceType.Gold, amount: 4 },
        },
    },
    /** 黑曜石，4 绿宝石 -> 4 黑曜石 @type {BedwarsItemShopitemData} */
    obsidian: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Blocks,
            description: ["百分百保护你的床。"],
            modeEnabled: { rush: false, }
        },
        component: {
            id: "obsidian",
            amount: 4,
            resource: { type: BedwarsResourceType.Emerald, amount: 4 },
        },
    },

    // ===== 近战 =====

    /** 石剑，10 铁锭 -> 1 石剑 @type {BedwarsItemShopitemData} */
    stoneSword: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Melee,
        },
        component: {
            id: "stone_sword",
            amount: 1,
            resource: { type: BedwarsResourceType.Iron, amount: 10 },
            enchantment: { applySharpness: true },
            removeItem: ["bedwars:wooden_sword"],
        },
    },
    /** 铁剑，7 金锭 -> 1 铁剑 @type {BedwarsItemShopitemData} */
    ironSword: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Melee,
            isQuickBuy: true,
        },
        component: {
            id: "iron_sword",
            amount: 1,
            resource: { type: BedwarsResourceType.Gold, amount: 7 },
            enchantment: { applySharpness: true },
            removeItem: ["bedwars:wooden_sword"],
        },
    },
    /** 钻石剑，3 绿宝石（非 8 队）或 4 绿宝石（8 队） -> 1 钻石剑 @type {BedwarsItemShopitemData} */
    diamondSword: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Melee,
        },
        component: {
            id: "diamond_sword",
            amount: 1,
            resource: { type: BedwarsResourceType.Emerald, amount: 3, amountInSolo: 4 },
            enchantment: { applySharpness: true },
            removeItem: ["bedwars:wooden_sword"],
        },
    },
    /** 击退棒，5 金锭 -> 1 击退棒 @type {BedwarsItemShopitemData} */
    knockbackStick: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Melee,
        },
        component: {
            id: "knockback_stick",
            amount: 1,
            resource: { type: BedwarsResourceType.Gold, amount: 5 },
            enchantment: { list: [{ id: "knockback", level: 1 }] },
        },
    },

    // ===== 盔甲 =====

    /** 永久的锁链盔甲，24 铁锭 -> 1 永久的锁链盔甲 @type {BedwarsItemShopitemData} */
    chainArmor: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Armor,
            description: ["每次重生时，会获得锁链护腿和锁链靴子。"],
            isArmor: true,
        },
        component: {
            id: "chain_armor",
            amount: 1,
            resource: { type: BedwarsResourceType.Iron, amount: 24 },
            // enchantment: { applyFeatherFalling: true }, （该物品是永久性物品，指定此参数无效）,
            tier: { tier: 2 }
        },
    },
    /** 永久的铁盔甲，12 金锭 -> 1 永久的铁盔甲 @type {BedwarsItemShopitemData} */
    ironArmor: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Armor,
            description: ["每次重生时，会获得铁护腿和铁靴子。"],
            isQuickBuy: true,
            isArmor: true,
        },
        component: {
            id: "iron_armor",
            amount: 1,
            resource: { type: BedwarsResourceType.Gold, amount: 12 },
            // enchantment: { applyFeatherFalling: true }, （该物品是永久性物品，指定此参数无效）
            tier: { tier: 3 }
        },
    },
    /** 永久的钻石盔甲，6 绿宝石 -> 1 永久的钻石盔甲 @type {BedwarsItemShopitemData} */
    diamondArmor: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Armor,
            description: ["每次重生时，会获得钻石护腿和钻石靴子。"],
            isArmor: true,
        },
        component: {
            id: "diamond_armor",
            amount: 1,
            resource: { type: BedwarsResourceType.Emerald, amount: 6 },
            // enchantment: { applyFeatherFalling: true }, （该物品是永久性物品，指定此参数无效）
            tier: { tier: 4 },
        },
    },

    // ===== 工具 =====

    /** 永久的剪刀，20 铁锭 -> 1 永久的剪刀 @type {BedwarsItemShopitemData} */
    shears: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Tools,
            description: ["适用于破坏羊毛，每次重生时会获得剪刀。"],
            isShears: true,
        },
        component: {
            id: "shears",
            amount: 1,
            resource: { type: BedwarsResourceType.Iron, amount: 20 },
        },
    },
    /** 镐 @type {BedwarsItemShopitemData} */
    pickaxe: {
        description: {
            format: "itemGroup",
            category: BedwarsItemShopitemCategory.Tools,
            isQuickBuy: true,
            isPickaxe: true,
        },
        components: [
            {
                id: "wooden_pickaxe",
                amount: 1,
                resource: { type: BedwarsResourceType.Iron, amount: 10 },
                tier: { tier: 1, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "iron_pickaxe",
                amount: 1,
                resource: { type: BedwarsResourceType.Iron, amount: 10 },
                removeItem: ["bedwars:wooden_pickaxe"],
                tier: { tier: 2, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "golden_pickaxe",
                amount: 1,
                resource: { type: BedwarsResourceType.Gold, amount: 3 },
                removeItem: ["bedwars:wooden_pickaxe", "bedwars:iron_pickaxe"],
                tier: { tier: 3, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "diamond_pickaxe",
                amount: 1,
                resource: { type: BedwarsResourceType.Gold, amount: 6 },
                removeItem: ["bedwars:wooden_pickaxe", "bedwars:iron_pickaxe", "bedwars:golden_pickaxe"],
                tier: { tier: 4, showCurrentTier: true, loseTierUponDeath: true },
            }
        ],
    },
    /** 斧 @type {BedwarsItemShopitemData} */
    axe: {
        description: {
            format: "itemGroup",
            category: BedwarsItemShopitemCategory.Tools,
            isQuickBuy: true,
            isAxe: true,
        },
        components: [
            {
                id: "wooden_axe",
                amount: 1,
                resource: { type: BedwarsResourceType.Iron, amount: 10 },
                // enchantment: { applySharpness: true }, （该物品是永久性物品，指定此参数无效）
                tier: { tier: 1, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "stone_axe",
                amount: 1,
                resource: { type: BedwarsResourceType.Iron, amount: 10 },
                // enchantment: { applySharpness: true }, （该物品是永久性物品，指定此参数无效）
                removeItem: ["bedwars:wooden_axe"],
                tier: { tier: 2, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "iron_axe",
                amount: 1,
                resource: { type: BedwarsResourceType.Gold, amount: 3 },
                // enchantment: { applySharpness: true }, （该物品是永久性物品，指定此参数无效）
                removeItem: ["bedwars:wooden_axe", "bedwars:stone_axe"],
                tier: { tier: 3, showCurrentTier: true, loseTierUponDeath: true },
            },
            {
                id: "diamond_axe",
                amount: 1,
                resource: { type: BedwarsResourceType.Gold, amount: 6 },
                // enchantment: { applySharpness: true }, （该物品是永久性物品，指定此参数无效）
                removeItem: ["bedwars:wooden_axe", "bedwars:stone_axe", "bedwars:iron_axe"],
                tier: { tier: 4, showCurrentTier: true, loseTierUponDeath: true },
            }
        ],
    },

    // ===== 远程 =====

    /** 箭，2 金锭 -> 6 箭 @type {BedwarsItemShopitemData} */
    arrow: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Ranged,
            isQuickBuy: true,
        },
        component: {
            id: "arrow",
            amount: 6,
            resource: { type: BedwarsResourceType.Gold, amount: 2 },
            realItemId: { isVanilla: true },
        },
    },
    /** 弓，12 金锭 -> 1 弓 @type {BedwarsItemShopitemData} */
    bow: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Ranged,
            isQuickBuy: true,
        },
        component: {
            id: "bow",
            amount: 1,
            resource: { type: BedwarsResourceType.Gold, amount: 12 },
            realItemId: { isVanilla: true },
        },
    },
    /** 弓（力量 I），20 金锭 -> 1 弓（力量 I） @type {BedwarsItemShopitemData} */
    bowPower: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Ranged,
        },
        component: {
            id: "bow_power",
            amount: 1,
            resource: { type: BedwarsResourceType.Gold, amount: 20 },
            realItemId: { id: "minecraft:bow" },
            enchantment: { list: [{ id: "power", level: 1 }] },
        },
    },
    /** 弓（力量 I，冲击 I），6 绿宝石 -> 1 弓（力量 I，冲击 I） @type {BedwarsItemShopitemData} */
    bowPowerPunch: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Ranged,
        },
        component: {
            id: "bow_power_punch",
            amount: 1,
            resource: { type: BedwarsResourceType.Emerald, amount: 6 },
            realItemId: { id: "minecraft:bow" },
            enchantment: { list: [{ id: "power", level: 1 }, { id: "punch", level: 1 }] },
        },
    },

    // ===== 药水 =====

    /** 速度药水，1 绿宝石 -> 1 速度药水 @type {BedwarsItemShopitemData} */
    speedPotion: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Potions,
            description: ["§9速度 II（0:30）。"],
        },
        component: {
            id: "potion_speed",
            amount: 1,
            resource: { type: BedwarsResourceType.Emerald, amount: 1 },
            lore: ["§r§9迅捷 II (0:30)"],
        },
    },
    /** 跳跃药水，1 绿宝石 -> 1 跳跃药水 @type {BedwarsItemShopitemData} */
    jumpBoostPotion: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Potions,
            description: ["§9跳跃提升 V（0:45）。"],
        },
        component: {
            id: "potion_jump_boost",
            amount: 1,
            resource: { type: BedwarsResourceType.Emerald, amount: 1 },
            lore: ["§r§9跳跃提升 V (0:45)"],
        },
    },
    /** 隐身药水，2 绿宝石 -> 1 隐身药水 @type {BedwarsItemShopitemData} */
    invisibilityPotion: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Potions,
            description: ["§9完全隐身（0:30）。"],
            isQuickBuy: true,
            modeEnabled: { experience: false },
        },
        component: {
            id: "potion_invisibility",
            amount: 1,
            resource: { type: BedwarsResourceType.Emerald, amount: 2 },
            lore: ["§r§9隐身 (0:30)"],
        },
    },

    // ===== 实用道具 =====

    /** 金苹果，3 金锭 -> 1 金苹果 @type {BedwarsItemShopitemData} */
    goldenApple: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["全面治愈。"],
            isQuickBuy: true,
        },
        component: {
            id: "golden_apple",
            amount: 1,
            resource: { type: BedwarsResourceType.Gold, amount: 3 },
            realItemId: { isVanilla: true }
        },
    },
    /** 床虱，24 铁锭 -> 1 床虱 @type {BedwarsItemShopitemData} */
    bedBug: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["在雪球着陆的地方生成蠹虫，", "用于分散敌人注意力，持续15秒。"],
        },
        component: {
            id: "bed_bug",
            amount: 1,
            resource: { type: BedwarsResourceType.Iron, amount: 24 },
        },
    },
    /** 梦境守护者，120 铁锭 -> 1 梦境守护者 @type {BedwarsItemShopitemData} */
    dreamDefender: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["铁傀儡帮你守卫基地，", "持续4分钟。"],
        },
        component: {
            id: "dream_defender",
            amount: 1,
            resource: { type: BedwarsResourceType.Iron, amount: 120, multiplier: 2.5 },
        },
    },
    /** 火球，40 铁锭 -> 1 火球 @type {BedwarsItemShopitemData} */
    fireball: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["右键发射！击飞在桥上行走的敌人！"],
            isQuickBuy: true,
        },
        component: {
            id: "fireball",
            amount: 1,
            resource: { type: BedwarsResourceType.Iron, amount: 40 },
        },
    },
    /** TNT，8 金锭（非 8 队）或 4 金锭（8 队） -> 1 TNT @type {BedwarsItemShopitemData} */
    tnt: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["瞬间点燃，适用于摧毁沿途防御工事！"],
            isQuickBuy: true,
        },
        component: {
            id: "tnt",
            amount: 1,
            resource: { type: BedwarsResourceType.Gold, amount: 8, amountInSolo: 4 },
        },
    },
    /** 末影珍珠，4 绿宝石 -> 1 末影珍珠 @type {BedwarsItemShopitemData} */
    enderPearl: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["入侵敌人基地的最快方法。"],
        },
        component: {
            id: "ender_pearl",
            amount: 1,
            resource: { type: BedwarsResourceType.Emerald, amount: 4 },
            realItemId: { isVanilla: true },
        },
    },
    /** 水桶，3 金锭（非 8 队）或 2 金锭（8 队） -> 1 水桶 @type {BedwarsItemShopitemData} */
    waterBucket: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["能很好地降低来犯敌人的速度。", "也可以抵御来自TNT的伤害。"],
        },
        component: {
            id: "water_bucket",
            amount: 1,
            resource: { type: BedwarsResourceType.Gold, amount: 3, amountInSolo: 2 },
            realItemId: { isVanilla: true },
        },
    },
    /** 搭桥蛋，1 绿宝石 -> 1 搭桥蛋 @type {BedwarsItemShopitemData} */
    bridgeEgg: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["扔出蛋后，会在其飞行轨迹上生成一座桥。"],
        },
        component: {
            id: "bridge_egg",
            amount: 1,
            resource: { type: BedwarsResourceType.Emerald, amount: 1 },
        },
    },
    /** 魔法牛奶，4 金锭 -> 1 魔法牛奶 @type {BedwarsItemShopitemData} */
    magicMilk: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["使用后，30秒内避免触发陷阱。"],
            isQuickBuy: true,
        },
        component: {
            id: "magic_milk",
            amount: 1,
            resource: { type: BedwarsResourceType.Gold, amount: 4 },
        },
    },
    /** 海绵，3 金锭（非 8 队）或 2 金锭（8 队） -> 4 海绵 @type {BedwarsItemShopitemData} */
    sponge: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.Utility,
            description: ["用于吸收水分。"],
        },
        component: {
            id: "sponge",
            amount: 4,
            resource: { type: BedwarsResourceType.Gold, amount: 3, amountInSolo: 2 },
            realItemId: { isVanilla: true }
        },
    },
    // /** 紧凑式速建塔，24 铁锭 -> 1 紧凑式速建塔 @type {BedwarsItemShopitemData} */
    // conpactPopUpTower: {
    //     description: {
    //         format: "item",
    //         category: BedwarsItemShopitemCategory.Utility,
    //         description: ["建造一座速建塔！"],
    //     },
    //     component: {
    //         id: "conpactPopUpTower",
    //         amount: 1,
    //         resource: { type: BedwarsResourceType.Iron, amount: 24 },
    //     },
    // },

    // ===== 轮换道具 =====

    /** 床，2 钻石 -> 1 床 @type {BedwarsItemShopitemData} */
    bed: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.RotatingItems,
            description: ["在基岩上放置床以夺取点位，", "使敌方更快地减少分数！"],
            modeEnabled: { classic: false, experience: false, rush: false },
        },
        component: {
            id: "bed",
            amount: 1,
            resource: { type: BedwarsResourceType.Diamond, amount: 2 },
            realItemId: { isColored: true }
        }
    },
    /** 铁锭，(铁锭价值) 等级 -> 铁锭 @type {BedwarsItemShopitemData} */
    ironIngot: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.RotatingItems,
            description: ["向队友扔出此物品以分享你的经验。"],
            modeEnabled: { classic: false, capture: false, rush: false },
        },
        component: {
            id: "iron_ingot_shareable",
            amount: 1,
            resource: { type: BedwarsResourceType.Level, amount: 1, amplifier: BedwarsResourceType.Iron },
            lore: ["§r§7扔出此物品并拾起以获取经验。"]
        }
    },
    /** 金锭，(金锭价值) 等级 -> 金锭 @type {BedwarsItemShopitemData} */
    goldIngot: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.RotatingItems,
            description: ["向队友扔出此物品以分享你的经验。"],
            modeEnabled: { classic: false, capture: false, rush: false },
        },
        component: {
            id: "gold_ingot_shareable",
            amount: 1,
            resource: { type: BedwarsResourceType.Level, amount: 1, amplifier: BedwarsResourceType.Gold },
            lore: ["§r§7扔出此物品并拾起以获取经验。"]
        }
    },
    /** 绿宝石，(绿宝石价值) 等级 -> 绿宝石 @type {BedwarsItemShopitemData} */
    emeraldIngot: {
        description: {
            format: "item",
            category: BedwarsItemShopitemCategory.RotatingItems,
            description: ["向队友扔出此物品以分享你的经验。"],
            modeEnabled: { classic: false, capture: false, rush: false },
        },
        component: {
            id: "emerald_shareable",
            amount: 1,
            resource: { type: BedwarsResourceType.Level, amount: 1, amplifier: BedwarsResourceType.Emerald },
            lore: ["§r§7扔出此物品并拾起以获取经验。"]
        }
    },

};

// 团队升级类商店物品基本信息
/**
 * @typedef BedwarsUpgradeShopitemData 定义团队升级商店物品信息
 * @property {BedwarsUpgradeShopitemDescription} description 团队升级类商店物品描述
 * @property {BedwarsUpgradeShopitemComponent} [component] 团队升级类商店物品组件（单物品形式可用）
 * @property {BedwarsUpgradeShopitemComponent[]} [components] 团队升级类商店物品组件（多物品形式可用）
 * 
 * @typedef BedwarsUpgradeShopitemDescription
 * @property {"item"|"itemGroup"} format 商店物品形式
 * @property {"upgrade"|"trap"} category 商店物品分类
 * @property {string[]} [description] 商店物品简介，显示该团队升级的最根本用途
 * @property {BedwarsShopitemModeEnabledDescription} [modeEnabled] 该物品在特定模式下是否启用 | 默认值：均为 true
 * 
 * @typedef BedwarsUpgradeShopitemComponent
 * @property {BedwarsTeamUpgradeType|BedwarsTrapType} id 团队升级 ID
 * @property {string} shopitemId 商店物品 ID
 * @property {number} amount 在商店中显示为多少物品
 * @property {BedwarsItemResourceComponent} resource 指定该物品的资源需求
 * @property {BedwarsUpgradeTierComponent} [tier] 指定该物品的等级
 */

// 团队升级类商店物品组件
/**
 * @typedef BedwarsUpgradeTierComponent
 * @property {number} tier 团队升级等级，只有当该队伍的对应升级的等级 = tier - 1 时允许购买
 * @property {string[]} [thisTierDescription] （仅限多物品模式可用）显示该等级的用途，最后将显示为：“tier级： thisTierDecription， resourceAmount 钻石”
 */

/** 团队升级类商店物品基本信息 */
export const upgradeShopitemData = {

    // --- 团队升级 ---

    /** 锋利附魔 @type {BedwarsUpgradeShopitemData} */
    sharpenedSwords: {
        description: {
            format: "item",
            category: "upgrade",
            description: ["你方所有成员的剑和斧将永久获得锋利I附魔！"],
        },
        component: {
            id: BedwarsTeamUpgradeType.SharpenedSwords,
            shopitemId: "bedwars:upgrade_sharpened_swords",
            amount: 1,
            resource: { type: BedwarsResourceType.Diamond, amount: 8, amountInSolo: 4 },
            tier: { tier: 1 },
        }
    },
    /** 盔甲强化 @type {BedwarsUpgradeShopitemData} */
    reinforcedArmor: {
        description: {
            format: "itemGroup",
            category: "upgrade",
            description: ["己方所有成员的盔甲将永久获得保护附魔！"],
        },
        components: [
            {
                id: BedwarsTeamUpgradeType.ReinforcedArmor,
                shopitemId: "bedwars:upgrade_reinforced_armor_tier_1",
                amount: 1,
                resource: { type: BedwarsResourceType.Diamond, amount: 5, amountInSolo: 2 },
                tier: { tier: 1, thisTierDescription: ["保护 I"] },
            },
            {
                id: BedwarsTeamUpgradeType.ReinforcedArmor,
                shopitemId: "bedwars:upgrade_reinforced_armor_tier_2",
                amount: 2,
                resource: { type: BedwarsResourceType.Diamond, amount: 10, amountInSolo: 4 },
                tier: { tier: 2, thisTierDescription: ["保护 II"] },
            },
            {
                id: BedwarsTeamUpgradeType.ReinforcedArmor,
                shopitemId: "bedwars:upgrade_reinforced_armor_tier_3",
                amount: 3,
                resource: { type: BedwarsResourceType.Diamond, amount: 20, amountInSolo: 8 },
                tier: { tier: 3, thisTierDescription: ["保护 III"] },
            },
            {
                id: BedwarsTeamUpgradeType.ReinforcedArmor,
                shopitemId: "bedwars:upgrade_reinforced_armor_tier_4",
                amount: 4,
                resource: { type: BedwarsResourceType.Diamond, amount: 30, amountInSolo: 16 },
                tier: { tier: 4, thisTierDescription: ["保护 IV"] },
            }
        ]
    },
    /** 疯狂矿工 @type {BedwarsUpgradeShopitemData} */
    maniacMiner: {
        description: {
            format: "itemGroup",
            category: "upgrade",
            description: ["己方所有成员获得永久急迫效果！"],
        },
        components: [
            {
                id: BedwarsTeamUpgradeType.ManiacMiner,
                shopitemId: "bedwars:upgrade_maniac_miner_tier_1",
                amount: 1,
                resource: { type: BedwarsResourceType.Diamond, amount: 4, amountInSolo: 2 },
                tier: { tier: 1, thisTierDescription: ["急迫 I"] },
            },
            {
                id: BedwarsTeamUpgradeType.ManiacMiner,
                shopitemId: "bedwars:upgrade_maniac_miner_tier_2",
                amount: 2,
                resource: { type: BedwarsResourceType.Diamond, amount: 6, amountInSolo: 4 },
                tier: { tier: 2, thisTierDescription: ["急迫 II"] },
            }
        ]
    },
    /** 锻炉 @type {BedwarsUpgradeShopitemData} */
    forge: {
        description: {
            format: "itemGroup",
            category: "upgrade",
            description: ["升级你岛屿资源池的生成速度和最大容量。"],
        },
        components: [
            {
                id: BedwarsTeamUpgradeType.Forge,
                shopitemId: "bedwars:upgrade_forge_tier_1",
                amount: 1,
                resource: { type: BedwarsResourceType.Diamond, amount: 4, amountInSolo: 2 },
                tier: { tier: 1, thisTierDescription: ["+50%资源"] },
            },
            {
                id: BedwarsTeamUpgradeType.Forge,
                shopitemId: "bedwars:upgrade_forge_tier_2",
                amount: 2,
                resource: { type: BedwarsResourceType.Diamond, amount: 8, amountInSolo: 4 },
                tier: { tier: 2, thisTierDescription: ["+100%资源"] },
            },
            {
                id: BedwarsTeamUpgradeType.Forge,
                shopitemId: "bedwars:upgrade_forge_tier_3",
                amount: 3,
                resource: { type: BedwarsResourceType.Diamond, amount: 12, amountInSolo: 6 },
                tier: { tier: 3, thisTierDescription: ["生成绿宝石"] },
            },
            {
                id: BedwarsTeamUpgradeType.Forge,
                shopitemId: "bedwars:upgrade_forge_tier_4",
                amount: 4,
                resource: { type: BedwarsResourceType.Diamond, amount: 16, amountInSolo: 8 },
                tier: { tier: 4, thisTierDescription: ["+200%资源"] },
            }
        ]
    },
    /** 治愈池 @type {BedwarsUpgradeShopitemData} */
    healPool: {
        description: {
            format: "item",
            category: "upgrade",
            description: ["基地附近的队伍成员将获得生命恢复效果！"],
        },
        component: {
            id: BedwarsTeamUpgradeType.HealPool,
            shopitemId: "bedwars:upgrade_heal_pool",
            amount: 1,
            resource: { type: BedwarsResourceType.Diamond, amount: 3, amountInSolo: 1 },
            tier: { tier: 1 }
        }
    },
    /** 缓冲靴子 @type {BedwarsUpgradeShopitemData} */
    cushionedBoots: {
        description: {
            format: "itemGroup",
            category: "upgrade",
            description: ["你队伍的靴子获得了永久摔落缓冲！"],
        },
        components: [
            {
                id: BedwarsTeamUpgradeType.CushionedBoots,
                shopitemId: "bedwars:upgrade_cushioned_boots_tier_1",
                amount: 1,
                resource: { type: BedwarsResourceType.Diamond, amount: 2, amountInSolo: 1 },
                tier: { tier: 1, thisTierDescription: ["摔落缓冲 I"] },
            },
            {
                id: BedwarsTeamUpgradeType.CushionedBoots,
                shopitemId: "bedwars:upgrade_cushioned_boots_tier_2",
                amount: 2,
                resource: { type: BedwarsResourceType.Diamond, amount: 4, amountInSolo: 2 },
                tier: { tier: 2, thisTierDescription: ["摔落缓冲 II"] },
            }
        ]
    },
    /** 末影龙增益 @type {BedwarsUpgradeShopitemData} */
    dragonBuff: {
        description: {
            format: "item",
            category: "upgrade",
            description: ["你的队伍在绝杀模式中将会有两条末影龙，而不是一条！"],
            modeEnabled: { classic: false, capture: false, experience: false, rush: false },
        },
        component: {
            id: BedwarsTeamUpgradeType.DragonBuff,
            shopitemId: "bedwars:upgrade_dragon_buff",
            amount: 1,
            resource: { type: BedwarsResourceType.Diamond, amount: 5 },
            tier: { tier: 1 },
        }
    },

    // --- 陷阱 ---

    /** 失明陷阱 @type {BedwarsUpgradeShopitemData} */
    blindnessTrap: {
        description: {
            format: "item",
            category: "trap",
            description: ["造成失明与缓慢效果，持续8秒。"],
        },
        component: {
            id: BedwarsTrapType.BlindnessTrap,
            shopitemId: "bedwars:upgrade_blindness_trap",
            amount: 1,
            resource: { type: BedwarsResourceType.Diamond, amount: 1 },
        }
    },
    /** 反击陷阱 @type {BedwarsUpgradeShopitemData} */
    counterOffensiveTrap: {
        description: {
            format: "item",
            category: "trap",
            description: ["赋予基地附近的队友速度 II 与跳跃提升 II", "效果，持续15秒。"],
        },
        component: {
            id: BedwarsTrapType.CounterOffensiveTrap,
            shopitemId: "bedwars:upgrade_counter_offensive_trap",
            amount: 1,
            resource: { type: BedwarsResourceType.Diamond, amount: 1 },
        },
    },
    /** 显影陷阱 @type {BedwarsUpgradeShopitemData} */
    revealTrap: {
        description: {
            format: "item",
            category: "trap",
            description: ["显示隐身的玩家，", "及其名称与队伍名。"],
        },
        component: {
            id: BedwarsTrapType.RevealTrap,
            shopitemId: "bedwars:upgrade_reveal_trap",
            amount: 1,
            resource: { type: BedwarsResourceType.Diamond, amount: 1 },
        },
    },
    /** 挖掘疲劳陷阱 @type {BedwarsUpgradeShopitemData} */
    minerFatigueTrap: {
        description: {
            format: "item",
            category: "trap",
            description: ["造成挖掘疲劳效果，持续8秒。"],
        },
        component: {
            id: BedwarsTrapType.MinerFatigueTrap,
            shopitemId: "bedwars:upgrade_miner_fatigue_trap",
            amount: 1,
            resource: { type: BedwarsResourceType.Diamond, amount: 1 },
        },
    },

};

/**
 * @typedef BedwarsTrapInformation
 * @property {string} icon 陷阱信息的图标物品
 * @property {string} name 陷阱信息显示为何种名字
 * @property {boolean} [isValid] 是否为有效的陷阱，有效陷阱将显示为绿色标题
 */

/** 陷阱信息 */
export const trapInformationData = {
    /** 无陷阱 @type {BedwarsTrapInformation} */
    noTrap: {
        icon: "minecraft:light_gray_stained_glass",
        name: "无陷阱！",
    },
    /** 失明陷阱 @type {BedwarsTrapInformation} */
    blindnessTrap: {
        icon: "minecraft:tripwire_hook",
        isValid: true,
        name: "失明陷阱",
    },
    /** 反击陷阱 @type {BedwarsTrapInformation} */
    counterOffensiveTrap: {
        icon: "minecraft:feather",
        isValid: true,
        name: "反击陷阱",
    },
    /** 显影陷阱 @type {BedwarsTrapInformation} */
    revealTrap: {
        icon: "minecraft:redstone_torch",
        isValid: true,
        name: "显影陷阱",
    },
    /** 挖掘疲劳陷阱 @type {BedwarsTrapInformation} */
    minerFatigueTrap: {
        icon: "minecraft:iron_pickaxe",
        isValid: true,
        name: "挖掘疲劳陷阱",
    },
};

// ===== 击杀样式数据 =====

/**
 * @typedef killStyleData
 * @property {string} id 击杀样式的 ID
 * @property {string} name 击杀样式的名称
 * @property {number} numberId 击杀样式对应的数字 ID，用于记分板中
 */

/** 击杀样式信息 */
export const killStyle = {

    /** @type {killStyleData} */
    default: {
        id: "default",
        name: "默认",
        numberId: 0,
    },
    /** @type {killStyleData} */
    flame: {
        id: "flame",
        name: "火焰",
        numberId: 1,
    },
    /** @type {killStyleData} */
    west: {
        id: "west",
        name: "西部",
        numberId: 2,
    },
    /** @type {killStyleData} */
    glory: {
        id: "glory",
        name: "光荣",
        numberId: 3,
    },
    /** @type {killStyleData} */
    pirate: {
        id: "pirate",
        name: "海盗",
        numberId: 4,
    },
    /** @type {killStyleData} */
    love: {
        id: "love",
        name: "爱情",
        numberId: 5,
    },
    /** @type {killStyleData} */
    christmas: {
        id: "christmas",
        name: "圣诞老人工坊",
        numberId: 6,
    },
    /** @type {killStyleData} */
    meme: {
        id: "meme",
        name: "表情包",
        numberId: 7,
    },
    /** @type {killStyleData} */
    pack: {
        id: "pack",
        name: "打包",
        numberId: 8,
    },
    /** @type {killStyleData} */
    newThreeKingdom: {
        id: "newThreeKingdom",
        name: "新三国（原创）",
        numberId: 9,
    },
};

/** 通过玩家的记分板数值获取击杀样式 ID
 * @param {minecraft.Player} player 
 */
export function getKillStyleByNumberId(player) {
    const killStyleNumberId = lib.ScoreboardPlayerUtil.getOrSetDefault("killStyle", player, 0);
    const killStyleId = new Map(Object.values(killStyle).map(k => [k.numberId, k.id])).get(killStyleNumberId) ?? "default";
    return killStyleId;
}

// ===== 更新日志数据 =====

/** 更新日志 */
export const updateLog = {
    version1_0: [
        "该版本是初代版本，使用 SAPI 实现了起床战争经典模式和夺点模式的基础功能。",
    ],
    version1_1: [
        "§l性能优化",
        "§7- §l§b重要更新§r§7 全面重写脚本底层，以应对糟糕的性能问题表现。",
        "§7- 我们预期，该版本的性能优化理论上应该比1.0版本要更好。",
        "§7- 大幅度优化了商店的性能和表现",
        "§l结构加载",
        "§7- §l§b重要更新§r§7 结构加载现在是一个一个岛屿地加载（甚至是一个岛屿的一部分一部分地加载），而不再是所有结构同时加载",
        "§7- 现在每个结构都有自己的加载时间，如果结构大小比较大，加载时间就会比较长，反之则会比较短",
        "§7- 采用这种异步加载方式，对于某些较小的地图来说，这种加载方式可以兼顾加载速度和性能，对于某些较大的地图来说，虽然加载速度会变慢，但是理论上应该可以在结构加载时提供更好的服务端性能",
        "§l设置 UI",
        "§7- §l§b重要更新§r§7 添加了一个新的设置菜单，仅管理员可使用并获取。", // debug 应该在非管理员使用该物品报错
        "§7- 移除了以前的全部/scriptevent命令，现在将其中的功能全部移动到了设置菜单中。",
        "§7- 现在设置能够在设置完成后自动备份数据，能够在/reload、重启地图、重启服务器前恢复以前设置的数据。",
        "§7- 新增以下设置：地图清除速度、地图加载速度、玩家人数上限、玩家自主选队、资源设置、击杀样式设置、无效队伍检测、虚空可扔物品、备份与恢复设置、开发者设置。",
        "§7- 现在在设置清除地图和加载地图速度为较快、快和非常快后，清除和加载速度分别会达到默认状态的 150%%、200%% 和 400%%",
        "§l击杀样式",
        "§7- §l§b重要更新§r§7 在玩家杀死玩家、破坏床后，现在可以显示为独特的击杀消息。",
        "§7- 可以在设置启用以允许玩家个性化击杀样式，或启用随机击杀样式防止选择困难。",
        "§7- 一共加入了10种击杀样式§o§7（其中有一种是整活）§r。",
        "§7- 现在铁傀儡和蠹虫在击杀玩家后，会为其主人增加击杀数并显示独特的击杀消息。",
        "§l自主选队",
        "§7- §l§b重要更新§r§7 在开始游戏前，玩家现在可以自己选择要加入的队伍。",
        "§7- 默认是关闭的，以对应Hypixel，然而你可以在设置启用以允许玩家选择队伍。",
        "§7- 只允许一个队伍比另一个队伍最多多出 1 名玩家§7（比如不允许3 3 3 1的组队方法）。",
        "§l新地图",
        "§7- §l§b重要更新§r§7 新增8张4队地图：伊斯特伍德（Eastwood）、野餐（Treenan）、海盗船（Swashbuckle）、方尖碑（Obelisk）、海岸（Ashore）、竞技场（Lectus）、石头城堡（Stonekeep）、入侵（Invasion）",
        "§7- §l§b重要更新§r§7 新增3张8队地图：瀑布（Waterfall）、乐园（Playground）、灯塔（Lighthouse）。",
        "§7- 所有的地图都有特定的最低建造高度上限和特定的治愈池范围。",
        "§l商店",
        "§7- §l§b重要更新§r§7 现在全新的商店设计，商人UI现在采用非共享UI，不同的玩家将看到不同的内容。",
        "§7- 将以前的“方块与物品”和“武器与盔甲”商人合二为一，成为物品商店，物品商店采用类似于 Hypixel 的标签页设计，包含 9 大分类：快速购买、方块、近战、盔甲、工具、远程、药水、实用道具、轮换物品。",
        "§7- 现在镐子和斧头不再摊开放置了，而是在一个格子之内。",
        "§7- 现在除非和商人交互，否则不会再误锁物品栏，并且只要和商人交易后小角度切换视角即可解锁物品栏。",
        "§7- 修复了梯子定价为4个金锭的问题，改为了4个铁锭。",
        "§7- 将商店的高等级盔甲改为了靴子（以前是胸甲）。",
        "§7- 将“这是个陷阱！”更名为“失明陷阱”；将“报警陷阱”更名为“显影陷阱”；移除了“末影龙增益”团队升级，改为了“缓冲靴子”。",
        "§7- 现在商店物品的提示框也和Hypixel保持了高度一致。",
        "§7- 现在团队升级在已解锁后或陷阱排满后会显示出来，而不是显示为花费。",
        "§7- 现在不再允许两个玩家同时打开一个商人的 UI，如果检查到此情况会立刻关闭这两名玩家的 UI",
        "§l经验模式",
        "§7- §l§b重要更新§r§7 隆重推出——经验模式！",
        "§7- 玩家获取的铁锭、金锭、绿宝石会转化为经验，转化量（资源价值）可在设置调整，钻石不会转化为经验",
        "§7- 在经验模式下，物品商店接收经验，而非铁锭、金锭和绿宝石，物品的售价是随着铁锭价格、金锭价格、绿宝石价格而等比例放大的，放大比例可在设置调整",
        "§7- 在商店新增了可共享的铁锭、金锭和绿宝石，扔出这些物品再拾起即可获取对应的经验值，在商店中的价格随着这三样物品的价值的变动而变动",
        "§7- 团队升级商人没有变化，依旧接收钻石",
        "§7- 调整了经验模式的资源生成速率，可在设置调整，以使中岛的资源生成效率要快于队伍岛，但钻石的生成速率没有变化",
        "§7- 经验模式禁用了隐身药水",
        "§l疾速模式",
        "§7- §l§b重要更新§r§7 正式推出——疾速模式！",
        "§7- 所有队伍的床都默认得到 3 层保护：木板 → 羊毛 → 防爆玻璃",
        "§7- 所有资源的生成速度全部拉满，所有队伍都默认获得 4 级锻炉",
        "§7- 开始游戏后 15 分钟床自毁，床自毁后 15 分钟游戏结束",
        "§7- 玩家可以右键任意一种剑开启搭桥模式，在搭桥模式下玩家放置羊毛后会在玩家放置羊毛的方向上每 0.1 秒延伸 1 个羊毛，合计延伸 5 个羊毛；在搭桥模式下，再次使用剑关闭搭桥模式",
        "§7- 疾速模式禁用了黑曜石",
        "§l物品",
        "§7- 搭桥蛋现在不再会将已搭好的桥清空掉某些部分，也不再能在安全区放置方块了",
        "§7- 现在梦境守护者的使用能够适应玩家所交互的方块面，并降低了梦境守护者的伤害",
        "§7- §l§b重要更新§r§7 现在爆炸施加向量采用新式算法：以前，爆炸只会对玩家施加y方向上的速度，具体表现为抬高，但不添加水平方向的速度；现在，爆炸根据爆炸位置和玩家位置的连线向量进行计算，这意味着爆炸将带来更加强力而真实的冲击效果",
        "§7- 现在弓击中敌方后会提示敌方剩余的血量。",
        "§7- 修复了在弓击中同队玩家时会多次响起音效的问题。",
        "§7- 修复了末影珍珠的出界检测会包括顶面的问题，这个问题可能导致向上扔的末影珍珠被吞掉。",
        "§l游戏内容",
        "§7- §l§b重要更新§r§7 现在玩家不再能在资源点、商人或队伍出生点附近放置方块。",
        "§7- §l§b重要更新§r§7 现在其他队伍的玩家不再能开启其他队伍的箱子，除非该队伍已被淘汰。",
        "§7- 提高了本模组的最低版本需求到1.21.100。",
        "§7- 修复了灰队的铁傀儡无法辨认剩余时长的问题。",
        "§7- 修复了地毯可能会被冲掉并使玩家获得地毯的问题。",
        "§7- 修复了在最高处或最低处平搭依然会阻止搭路的问题。",
        "§7- 修复了启用创造模式玩家可破坏方块的设置后，生存模式的玩家也能破坏方块的问题。",
        "§7- 将包图标改成了床。",
        "§7- 将创造模式的判断准则改为了判断是否为管理员玩家。",
        "§7- 更改了铁锻炉的图标为熔炉",
        "§7- §l§b重要更新§r§7 在杂项设置中新增了一个新设置「信息板末行信息」，用于更改游戏右侧信息板末尾一行显示的内容，这对开服务器的服主可能会比较有用",
        "§7- 在杂项设置中新增了一个新设置「购买物品通知」，用于控制在购买物品类物品后是否通知玩家，不影响团队升级类物品",
        "§7- 现在末影龙的落点高度是根据地图的最低高度而设定的，而非锁定在(0,60,0)落点",
        "§l资源生成",
        "§7- 现在所有的单挑模式的地图的铁锭、金锭生成速度都是非单挑模式生成速度的60%%。",
        "§l信息板",
        "§7- 现在游戏前信息板的人数信息显示为§a(当前人数)/(上限人数)§r。",
        "§7- 现在游戏前信息板在等待更多玩家进入时，“等待中...”的后面现在会显示还需要多少玩家进入。",
        "§7- 现在游戏前信息板会显示版本了。",
    ],
    versionTest: [
        "§c请注意：当前版本仍处于测试阶段。功能可能不稳定，可能会随时修改、移除。造成不便敬请见谅！",
        "§l疾速模式",
        "§7- §l§b重要更新§r§7 正式推出——疾速模式！",
        "§7- 所有队伍的床都默认得到 3 层保护：木板 → 羊毛 → 防爆玻璃",
        "§7- 所有资源的生成速度全部拉满，所有队伍都默认获得 4 级锻炉",
        "§7- 开始游戏后 15 分钟床自毁，床自毁后 15 分钟游戏结束",
        "§7- 为疾速模式新增了一个新设置「疾速模式生成速度倍率」，以调整疾速模式下各队金锭和铁锭的生成速度，默认值为 x0.5",
        "§7- 玩家可以右键任意一种剑开启搭桥模式，在搭桥模式下玩家放置羊毛后会在玩家放置羊毛的方向上每 0.1 秒延伸 1 个羊毛，合计延伸 5 个羊毛",
        "§7  - 在竖直向上搭时，不会延伸羊毛",
        "§7- 在搭桥模式下，再次使用剑关闭搭桥模式",
        "§7- 疾速模式禁用了黑曜石",
        "§7- 在设置中新增了启用疾速模式的支持",
        "§l新地图",
        "§7- §l§b重要更新§r§7 新增了 7 张 4 队地图：Picnic（Treenan） 野餐、Swashbuckle 海盗船、Obelisk 方尖碑、Ashore 海岸、Lectus 竞技场、Stonekeep 石头城堡、Invasion 入侵",
        "§l游戏内容",
        "§7- 更改了铁锻炉的图标为熔炉",
        "§7- §l§b重要更新§r§7 在杂项设置中新增了一个新设置「信息板末行信息」，用于更改游戏右侧信息板末尾一行显示的内容，这对开服务器的服主可能会比较有用",
        "§7- #62 降低了绿宝石的默认价格，由 x200 经验改为了 x150 经验",
        "§7- #63 提高了铁傀儡在经验模式中的价格，现在为 300 经验（是上个版本的 2.5 倍）",
        "§7- #65 在杂项设置中新增了一个新设置「购买物品通知」，用于控制在购买物品类物品后是否通知玩家，不影响团队升级类物品",
        "§7- #66 现在末影龙的落点高度是根据地图的最低高度而设定的，而非锁定在(0,60,0)落点",
        "§l漏洞修复",
        "§7- #64 现在被淘汰的玩家在二度离开游戏后，不再会重复播报队伍被淘汰；并且二度返回游戏后不再会重复播报该玩家已死亡",
        "§7- #67 修复了两处可能的报错",
        "§7- #70 修复了在设置中先将开始人数下限调至大于房间人数后恢复默认设置，会使游戏无法开始的问题",
        "§7- 修复了有玩家在等待期间进入或退出游戏后，会重置等待倒计时的问题，现在仅会在进入等待阶段后、以及人数不足后重置等待倒计时",
        "§7- 修复了有玩家在等待期间退出游戏导致人数不足后，不会提示玩家的问题",
    ],
}
