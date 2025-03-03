# 量筒的起床战争

嗨！欢迎你来到本仓库！本仓库储存了在 Bilibili 上的极筑工坊的视频「[【Minecraft】Hypixel起床战争，但是MC基岩版地图！](https://www.bilibili.com/video/BV1Jv421C7ev/)」和我的（一只卑微的量筒）视频「[我在基岩版还原了Hypixel起床战争！ | 量筒的起床战争 宣传片](https://www.bilibili.com/video/BV14CA5eDEDF)」中所提到的起床战争的源代码。

我清楚可能有很多人对我们这个项目很感兴趣。我们非常感谢大家对我们的支持！我们选择将这个项目完全公开到 GitHub 上，供大家学习、参考与游玩！

## 如何使用？

如果稍微「懂行」的同志可能已经看出，我们所提供的是行为包与资源包，并不是地图文件。您可以在右侧的「Releases」中找到我们已经发布的版本，并且下载。

为方便导入，您可以下载我们所给出的「`Bedwars_(版本号).mcaddon`」文件。

如果不出意外，您的 Minecraft 国际版只要是高于 1.21.50 的版本，就都能正确安装两包。为正常使用该包，您需要：

1. 进入新建地图的界面，使用生存模式，启用作弊；
2. 将刚安装成功的包（「量筒的起床战争 行为包」和「量筒的起床战争 资源包」）导入进去，然后创建世界；
3. 世界创建后，即可直接进行游玩！

## 注意事项

1. 禁止转载！您下载本包后，就代表着**本包仅允许您内部的使用**，严禁分发、二次或多次修改后分发。
2. 如果有问题欢迎直接在本 GitHub 仓库的 issues 里面提交您遇到的问题，也可以加入 QQ 群： 673941729 。非诚勿扰！

---

## 最新版本（Alpha 1.1_01）的更新日志

### 地图

- 新增 1 张 4 队地图：伊斯特伍德（Eastwood）。
- 新增 3 张 8 队地图：瀑布（Waterfall）。
- 现在所有的地图都有特定的最低建造高度上限。
- 现在所有的地图都有特定的治愈池范围。
- 现在地图 屋顶 的最低建造高度上限由 55 提升到了 62。
- 现在默认的加载时长由 5 秒调整为了 15 秒。特殊地，屋顶的加载时长延长到了 30 秒。
- 现在所有的单挑模式的地图的铁锭、金锭生成速度都是 4 队模式或 2 队模式生成速度的 60 %。您可以见下表以查看我们所作出的更改。

| | 1.0 版本 | Alpha 1.1_01 版本 |
| --- | --- | --- |
| 4 队模式和 2 队模式的铁生成间隔 | 6 游戏刻 | 6 游戏刻 |
| 单挑模式的铁生成间隔 | 20 游戏刻 | 6 / 0.6 = 10 游戏刻 |
| 4 队模式和 2 队模式的金生成间隔 | 75 游戏刻 | 75 游戏刻 |
| 单挑模式的金生成间隔 | 120 游戏刻 | 75 / 0.6 = 125 游戏刻 |

- 现在所有的单挑模式每次都生成 3 个铁而非 1 个。

### 设置

- 隆重介绍：新的设置菜单！
- 以前的`/scriptevent`命令被**全部移除**，转而使用设置菜单代替。
- 新增了一个物品：**设置**。
- 右键使用设置物品调出设置菜单。
- 在开始游戏前，创造模式的玩家能够默认获得此物品。
- 现在设置能够在设置完成后自动备份数据，能够在`/reload`、重启地图、重启服务器前恢复以前设置的数据。即：现在设置不再会因前述原因而重置。
- 设置菜单分为 7 个子项，完全继承以前的设置命令功能。下文中，【设置项】为命令系统原有的设置。
  - 游戏前设置：控制游戏前的运行逻辑，例如地图重置、等待时。包括：
    - #29 地图重置设置：包括地图清除速度、地图加载速度。
    - 等待设置：包括【玩家人数下限】、玩家人数上限、【开始游戏的等待时间】。
    - 组队设置：包括组队模式（暂未实装）、开始前组队（暂未实装）、玩家自主选队（暂未实装）。
  - 游戏内设置：控制资源生成、复活时间等。包括：
    - 【资源上限设置】：包括【铁生成上限】、【金生成上限】、【钻石生成上限】、【绿宝石生成上限】。
    - 资源生成间隔设置：包括铁生成间隔、金生成间隔、钻石生成间隔、绿宝石生成间隔、单挑模式生成倍率。*是的，现在你可以调整资源生成间隔了！*
    - 【重生时间设置】：包括【普通玩家重生时长】、【重进玩家重生时长】。
    - 无效队伍设置：包括无效队伍检测、【无效队伍能否生成资源】、无效队伍能否生成商人（暂未实装）。
  - 【地图启用设置】：控制何种地图能够生成。包括：【启用经典 2 队模式地图】、【启用经典 4 队模式地图】、【启用经典 8 队模式地图】、【启用夺点 2 队模式地图】（*拆分出来单独的模式*）。
  - 【生成地图】：立即生成地图。
  - 杂项设置：包括【破坏原版方块】、虚空扔物品。
  - #22 关于：制作人和关于我们的页面。
  - 开发者设置：开发人员可用的设置项。正式版本发布后，将移除此设置。

### 其他更改

- 更改了游戏开始前的等待信息板。
  - 人数信息现在显示为 当前人数/上限人数 ；
  - 在等待更多玩家进入时，“等待中...”的后面现在会显示还需要多少玩家进入；
  - 现在会显示版本了。
- #12 #30 现在玩家不再能在资源点、商人或队伍出生点附近放置方块。
- #15 现在其他队伍的玩家不再能开启其他队伍的箱子，除非该队伍已被淘汰。
- #21 现在弓击中敌方后会提示敌方剩余的血量。
- #32 优化了对英语的支持。感谢 @Fanconma ！
- 提高了本模组的最低版本需求到 1.21.50。

### 漏洞修复

- #19 修复了灰队的铁傀儡无法辨认剩余时长的问题。
- #23 修复了地毯可能会被冲掉并使玩家获得地毯的问题。
- #24 修复了末影珍珠的出界检测会包括顶面的问题，这个问题可能导致向上扔的末影珍珠被吞掉。
- #25 修复了在弓击中同队玩家时会多次响起音效的问题。
- 修复了在最高处或最低处平搭依然会阻止搭路的问题。
- 修复了启用创造模式玩家可破坏方块的设置后，生存模式的玩家也能破坏方块的问题。

### 底层更新

- 更新了行为包的`manifest.json`的版本号到`1.0.20`。
- 更新了行为包的脚本版本到`@minecraft/server@1.15.0`和`@minecraft/server-ui@1.3.0`。
- 现在破坏无效的床也不再会报错了。
- 更名`events/classic/playerBreakBlockTest.js`→`events/classic/breakBlock.js`。
- 更名`events/classic/equipmentTest.js`→`events/classic/equipment.js`。
- 更名`events/classic/heightLimit.js`→`events/classic/playerUseBlock.js`，并新增了两个函数：
  - `playerOpenChest(event) {}`：玩家尝试开其他未淘汰的队伍的箱子时，阻止之；
  - `safeAreaLimit(event) {}`：玩家尝试在安全区（例如队伍岛屿的重生点、资源点）放置方块时，阻止之。
- 更名`events/classic/itemLock.js`→`events/classic/items.js`，并新增了一个函数`removeInvalidItems() {}`以清除额外的物品。
- **新增** 在`methods/itemManager.js`中新增了`getValidItems(entity) {}`方法。
- 在`events/classic/trading.js`中移除了有关`capture`的内容，现在是按照地图设置自动处理的一般情况。
- **新增** 在`methods/positionManager.js`的`positionManager`对象中新增了多个方法：
  - `isEqual(pos1,pos2) {}`：判断两个坐标是否一致；
  - `hasPosition(positions, testPos) {}`：判断一个坐标数组里是否存在一个坐标；
  - `distance(pos1,pos2) {}`：判断两个坐标之间的距离。
- **移除** 在`methods/number.js`中的`objectInArray(array, object) {}`方法。现在用`positionManager.hasPosition(positions, testPos) {}`代替。
- 更名`BedwarsPlayer`类的`runtimeId`属性为`gameId`属性，以和`BedwarsMap`类一致。

#### `BedwarsMap`类，`methods/bedwarsMap.js`的方法

- **新增** 类型声明`islandInfo`、`teamIslandColorInfo`、`traderInfo`、`spawnerInfo`。
- **更改** 为`loadInfo`属性作出如下更改：
  - 新增`loadInfo.loadStage`，当前所处的加载阶段。
  - 新增`loadInfo.mapClear`对象，清除地图的方法和变量，其中包括`currentLayer`、`timeCostPerLayer`、`clear()`、`countdown`。
  - 新增`loadInfo.mapReload`对象，加载地图的方法和变量，其中包括`islands`、`totalTime`、`countdown`、`loadStructure()`、`loadBorder()`。
  - 新增`loadInfo.teamIslandColor`对象，设置队伍岛屿的羊毛颜色，其中包括`isEnabled`、`countdown`、`colors`、`load()`。
  - 移除`loadInfo.clearingLayer`，现在用`loadInfo.mapClear.currentLayer`代替。
  - 移除`loadInfo.clearTimePerLayer`，现在用`loadInfo.mapClear.timeCostPerLayer`代替。
  - 移除`loadInfo.structureLoadTime`，现在用`loadInfo.mapReload.countdown`代替。
  - 移除`loadInfo.setTeamIslandTime`，现在用`loadInfo.teamIslandColor.countdown`代替。
- **新增** `mapSize`属性，表示当前及上一张地图的地图大小。
- **新增** `version`属性，表示地图版本。
- **更改** 拆分了`methods/bedwarsMap.js`的方法和函数：
  - 这样做是为了便于控制结构加载的时间。
  - 移动了`createMap(mapName)()`函数到脚本`maps/(teamCount)Teams/(mapName).js`中存储数据。
  - 移动了`regenerateMap()`函数到脚本`maps/mapGenerator.js`中。
  - 移除了命令函数`maps/(map_name)/generate.mcfunction`和`maps/(map_name)/team_island.mcfunction`。
    - 现在相关数据分别记录在`loadInfo.mapReload.islands`和`loadInfo.teamIslandColor.colors`
- **更改** 现在构建器由`constructor(id,name,options={})`改为了`constructor(id,name,islands,teamIslandColor)`。如果需要更改地图设置，请直接在构建后更改。
- **更改** 方法`addTeam(team) {}`→`addTeams(...teams) {}`，现在允许直接传入多个参数，并移除了无效的名称检查。
- **更改** 方法`addTrader(pos,direction,type) {}`→`addTrader(...traders) {}`，现在允许直接传入多个参数。
- **更改** 方法`addSpawner(resourceType,pos) {}`→`addSpawners(...spawners) {}`，现在允许直接传入多个参数，并且现在每个生成点信息所传入的坐标`pos`需传入钻石点或绿宝石点中钻石块或绿宝石块的位置，而不再是其上方 2 格。
- **更改** 为`mapGenerator.js`将`validMapsFor2Teams`等变量改为一个`validMaps`对象，并新增了一个方法`getValidMaps() {}`以确定当前设置下有效的地图ID。
- **移除** `spawnerInfo`属性下的：
  - `spawnerInfo.ironInterval`；
  - `spawnerInfo.goldInterval`；
  - `spawnerInfo.diamondInterval`；
  - `spawnerInfo.emeraldInterval`；

#### `BedwarsTeam`类

- **新增** 类型声明`validTeams`、`teamInfo`。
- **更改** 重命名属性`bedInfo.direction`→`bedInfo.rotation`，并且更改了其类型，由`Number`改为`StructureRotation`。
- **更改** 现在构建器由`constructor(id,bedPos,bedDirection,resourceSpawnerPos,spawnpointPos)`改为了`constructor(id,teamInfo)`，并且`teamInfo`中支持输入`chestPos`。
- **移除** 变量`validTeams`。
- **移除** 移除属性`chestInfo`，以`chestPos: number`代替。

#### `methods/scoreboardManager.js`

- 是用于控制记分板的方法。
- `tryAddScoreboard(id,displayName) {}`：尝试创建一个记分板，并获取该记分板的数据。如果记分板已存在，则直接返回其数据。
- `getScoreboard(id) {}`：获取记分板数据。
- `removeScoreboard(id) {}`：尝试移除一个记分板，并返回是否成功执行。
- `displayScoreboard(display,id,order) {}`：尝试在特定位置显示记分板，并返回上一个在该位置显示的记分板数据。
- `tryAddAndDisplayScoreboard(id,displayName,display,order) {}`：尝试创建记分板并直接在特定位置显示，返回创建的记分板和上一个在同样位置显示的记分板。
- `eachScoreboard(func,condition) {}`：令所有记分板执行一个函数。
- `removeAllScoreboards(condition) {}`：移除所有记分板。
- `addScore(objective,participant,score) {}`：添加分数。
- `setScore(objective,participant,score) {}`：设置分数并返回这个值。
- `getScore(objective,participant,defaultValue) {}`：获取分数。如果无法获取分数，则设置为默认值并返回这个值。
- `getObjectiveFromParticipant(participantName) {}`：获取被追踪对象的全部记分项数据。

#### `methods/uiManager.js`

- 用于控制 UI 的方法。
- **新增** 类型声明`actionUiButtonInfo`、`modalUiButtonInfo`
- `createActionUi(buttonInfo,bodyText,titleText) {}`：创建一个`ActionForm`的 UI。
- `createMessageUi(button1Text,button2Text,bodyText,titleText) {}`：创建一个`MessageForm`的 UI。
- `createModalUi(buttonInfo,titleText,submitText) {}`：创建一个`ModalForm`的 UI。
- `showActionOrMessageUi(ui,showPlayer,playerSelectedFunc,playerCanceledFunc) {}`：显示一个`ActionForm`或`MessageForm`的 UI，并追踪玩家的选择。
- `showModalUi(ui,showPlayer,submittedFunc,playerCanceledFunc) {}`：显示一个`ModalForm`的 UI，并追踪玩家的选择。
- `createAndShowActionUi(player,buttonInfo,playerCanceledFunc,bodyText,titleText) {}`：创建一个`ActionForm`的 UI 并立即显示，同时追踪玩家的选择并执行内容。
- `createAndShowMessageUi(player,buttonInfo,bodyText,titleText) {}`：创建一个`MessageForm`的 UI 并立即显示，同时追踪玩家的选择并执行内容。
- `createAndShowModalUi(player,buttonInfo,submittedFunc,playerCanceledFunc,titleText,submitText) {}`：创建一个`ModalForm`的 UI 并立即显示，同时追踪玩家的选择并执行内容。

#### 设置与`methods/bedwarsSettings.js`

- **新增** 物品`bedwars:settings`。
- **移除** 移除了所有的设置命令，转而使用设置菜单代替。
- **新增** 为`settings`对象新增了以下属性：
  - `settings.miscellaneous.playerCanThrowItemsInVoid`，控制虚空扔物品的设置。
  - `settings.beforeGaming.waiting.maxPlayerCount`，控制一局中最多有多少玩家能够参与游戏。
  - `settings.beforeGaming.reload.clearSpeed`，控制清除地图的速度。
  - `settings.beforeGaming.reload.loadSpeed`，控制加载地图的速度。
  - `settings.beforeGaming.teamAssign.mode`，控制队伍分配的方式。
  - `settings.beforeGaming.teamAssign.assignBeforeGaming`，是否在开始前就随机组队。
  - `settings.beforeGaming.teamAssign.playerSelectEnabled`，是否启用自由选队。
  - `settings.gaming.resourceInterval.iron`，平均每个铁的基准生成间隔。
  - `settings.gaming.resourceInterval.gold`，金基准生成间隔。
  - `settings.gaming.resourceInterval.diamond`，钻石基准生成间隔。
  - `settings.gaming.resourceInterval.emerald`，绿宝石基准生成间隔。
  - `settings.gaming.resourceInterval.soloSpeedMultiplier`，单挑模式下的生成间隔乘数。
  - `settings.gaming.invalidTeam.enableTest`，是否启用无效队伍的检测。
  - `settings.gaming.invalidTeam.spawnTraders`，无效队伍是否生成商人。
- **更改** 为`settings`对象进行了以下重命名：
  - `settings.minWaitingPlayers` → `settings.beforeGaming.waiting.minPlayerCount`；
  - `settings.gameStartWaitingTime` → `settings.beforeGaming.waiting.gameStartWaitingTime`；
  - `settings.resourceMaxSpawnTimes.iron` → `settings.gaming.resourceLimit.iron`；
  - `settings.resourceMaxSpawnTimes.gold` → `settings.gaming.resourceLimit.gold`；
  - `settings.resourceMaxSpawnTimes.diamond` → `settings.gaming.resourceLimit.diamond`；
  - `settings.resourceMaxSpawnTimes.emerald` → `settings.gaming.resourceLimit.emerald`；
  - `settings.respawnTime.normalPlayers` → `settings.gaming.respawnTime.normalPlayers`；
  - `settings.respawnTime.rejoinedPlayers` → `settings.gaming.respawnTime.rejoinedPlayers`；
  - `settings.invalidTeamCouldSpawnResources` → `settings.gaming.invalidTeam.spawnResources`；
  - `settings.randomMap.allow2Teams` → `settings.mapEnabled.classicTwoTeamsEnabled`和`settings.mapEnabled.captureTwoTeamsEnabled`；
  - `settings.randomMap.allow4Teams` → `settings.mapEnabled.classicFourTeamsEnabled`；
  - `settings.randomMap.allow8Teams` → `settings.mapEnabled.classicEightTeamsEnabled`；
  - `settings.creativePlayerCanBreakBlocks` → `settings.miscellaneous.creativePlayerCanBreakBlocks`。
- **更改** 重命名`settingsEvent(event) {}` → `settingsFunction(event) {}`，并更改了其依赖事件，由`system.afterEvents.scriptEventReceive`改为`world.afterEvents.itemUse`。
- **新增** `settingsBackup() {}`方法，用于在玩家设置完成后备份数据。
- **新增** `settingsRecover() {}`方法，用于恢复已备份的数据。

#### 翻译文件`zh_CN.lang`

- **新增** 来自 Hypixel 的部分击杀样式信息。
- **新增** 部分在未来规划中的模式介绍信息。
