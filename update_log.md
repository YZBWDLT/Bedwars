# Alpha 1.1_01 更新日志

## 地图

- 新增 1 张 4 队地图：伊斯特伍德（Eastwood）。
- 新增 3 张 8 队地图：瀑布（Waterfall）。
- 现在所有的地图都有特定的最低建造高度上限。
- 现在所有的地图都有特定的治愈池范围。
- 现在地图 屋顶 的最低建造高度上限由 55 提升到了 62。
- 现在默认的加载时长由 5 秒调整为了 15 秒。特殊地，屋顶的加载时长延长到了 30 秒。

## 设置

- 隆重介绍：新的设置菜单！
- 以前的`/scriptevent`命令被**全部移除**，转而使用设置菜单代替。
- 新增了一个物品：**设置**。
- 右键使用设置物品调出设置菜单。
- 设置菜单分为 5 个子项，完全继承以前的设置命令功能。
- 新增设置“虚空扔物品”，控制在虚空中掉落的玩家是否允许扔出物品。
- 新增设置“启用夺点2队模式地图”，控制夺点模式是否能够生成。

## 最低版本需求

- 提高了本模组的最低版本需求到 1.21.20。

## 底层更新

- 更新了行为包的`manifest.json`的版本号到`1.0.20`。
- 更新了行为包的脚本版本到`@minecraft/server@1.13.0`和`@minecraft/server-ui@1.2.0`。
- 现在破坏无效的床也不再会报错了。

### `BedwarsMap`类，`methods/bedwarsMap.js`的方法

- **新增** 类型声明`islandInfo`、`teamIslandColorInfo`、`traderInfo`、`spawnerInfo`。
- **更改** 为`loadInfo`属性作出如下更改：
  - 新增`loadInfo.loadStage`，当前所处的加载阶段。
  - 新增`loadInfo.mapClear`对象，清除地图的方法和变量，其中包括`currentLayer`、`timeCostPerLayer`、`clear()`。
  - 新增`loadInfo.mapReload`对象，加载地图的方法和变量，其中包括`islands`、`totalTime`、`countdown`、`loadStructure()`、`loadBorder()`。
  - 新增`loadInfo.teamIslandColor`对象，设置队伍岛屿的羊毛颜色，其中包括`isEnabled`、`countdown`、`colors`、`load()`。
  - 移除`loadInfo.clearingLayer`，现在用`loadInfo.mapClear.currentLayer`代替。
  - 移除`loadInfo.clearTimePerLayer`，现在用`loadInfo.mapClear.timeCostPerLayer`代替。
  - 移除`loadInfo.structureLoadTime`，现在用`loadInfo.mapReload.countdown`代替。
  - 移除`loadInfo.setTeamIslandTime`，现在用`loadInfo.teamIslandColor.countdown`代替。
- **新增** `mapSize`属性，表示当前及上一张地图的地图大小。
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

### `BedwarsTeam`类

- **新增** 类型声明`validTeams`、`teamInfo`。
- **更改** 重命名属性`bedInfo.direction`→`bedInfo.rotation`，并且更改了其类型，由`Number`改为`StructureRotation`。
- **更改** 现在构建器由`constructor(id,bedPos,bedDirection,resourceSpawnerPos,spawnpointPos)`改为了`constructor(id,teamInfo)`。
- **移除** 变量`validTeams`。

### `methods/scoreboardManager.js`

- 是用于控制记分板的方法。
- `tryAddScoreboard(id,displayName) {}`：尝试创建一个记分板，并获取该记分板的数据。如果记分板已存在，则直接返回其数据。
- `getScoreboard(id) {}`：获取记分板数据。
- `removeScoreboard(id) {}`：尝试移除一个记分板，并返回是否成功执行。
- `displayScoreboard(display,id,order) {}`：尝试在特定位置显示记分板，并返回上一个在该位置显示的记分板数据。
- `tryAddAndDisplayScoreboard(id,displayName,display,order) {}`：尝试创建记分板并直接在特定位置显示，返回创建的记分板和上一个在同样位置显示的记分板。
- `eachScoreboard(func,condition) {}`：令所有记分板执行一个函数。
- `removeAllScoreboards(condition) {}`：移除所有记分板。
- `addScore(objective,participant,score) {}`：添加分数。
- `setScore(objective,participant,score) {}`：设置分数。
- `getScore(objective,participant) {}`：获取分数。
- `getObjectiveFromParticipant(participantName) {}`：获取被追踪对象的全部记分项数据。

### `methods/uiManager.js`

- 用于控制 UI 的方法。
- `createActionUi(buttonInfo,bodyText,titleText) {}`：创建一个`ActionForm`的 UI。
- `createMessageUi(button1Text,button2Text,bodyText,titleText) {}`：创建一个`MessageForm`的 UI。
- `createModalUi(buttonInfo,titleText,submitText) {}`：创建一个`ModalForm`的 UI。
- `showActionOrMessageUi(ui,showPlayer,playerSelectedFunc,playerCanceledFunc) {}`：显示一个`ActionForm`或`MessageForm`的 UI，并追踪玩家的选择。
- `showModalUi(ui,showPlayer,submittedFunc,playerCanceledFunc) {}`：显示一个`ModalForm`的 UI，并追踪玩家的选择。

### 设置与`methods/bedwarsSettings.js`

- **新增** 物品`bedwars:settings`。
- **移除** 移除了所有的设置命令，转而使用设置菜单代替。
- **新增** 为`settings`对象新增了`settings.miscellaneous.playerCanThrowItemsInVoid`，控制虚空扔物品的设置。
- **更改** 为`settings`对象进行了以下重命名：
  - `settings.minWaitingPlayers` → `settings.waiting.minWaitingPlayers`；
  - `settings.gameStartWaitingTime` → `settings.waiting.gameStartWaitingTime`；
  - `settings.resourceMaxSpawnTimes.iron` → `settings.gaming.resourceLimit.iron`；
  - `settings.resourceMaxSpawnTimes.gold` → `settings.gaming.resourceLimit.gold`；
  - `settings.resourceMaxSpawnTimes.diamond` → `settings.gaming.resourceLimit.diamond`；
  - `settings.resourceMaxSpawnTimes.emerald` → `settings.gaming.resourceLimit.emerald`；
  - `settings.respawnTime.normalPlayers` → `settings.gaming.respawnTime.normalPlayers`；
  - `settings.respawnTime.rejoinedPlayers` → `settings.gaming.respawnTime.rejoinedPlayers`；
  - `settings.invalidTeamCouldSpawnResources` → `settings.gaming.invalidTeamCouldSpawnResources`；
  - `settings.randomMap.allow2Teams` → `settings.mapEnabled.classicTwoTeamsEnabled`和`settings.mapEnabled.captureTwoTeamsEnabled`；
  - `settings.randomMap.allow4Teams` → `settings.mapEnabled.classicFourTeamsEnabled`；
  - `settings.randomMap.allow8Teams` → `settings.mapEnabled.classicEightTeamsEnabled`；
  - `settings.creativePlayerCanBreakBlocks` → `settings.miscellaneous.creativePlayerCanBreakBlocks`。
- **更改** 重命名`settingsEvent(event) {}` → `settingsFunction(event) {}`，并更改了其依赖事件，由`system.afterEvents.scriptEventReceive`改为`world.afterEvents.itemUse`。

### 翻译文件`zh_CN.lang`

- **新增** 来自 Hypixel 的部分击杀样式信息。
- **新增** 部分在未来规划中的模式介绍信息。
