# Alpha 1.1_01 更新日志

## 地图

- 现在所有的地图都有特定的最低建造高度上限。
- 现在所有的地图都有特定的治愈池范围。
- 现在地图 屋顶 的最低建造高度上限由 55 提升到了 62。

## 底层更新

- 更新了行为包的`manifest.json`的版本号到`1.0.20`。

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
- **移除** 方法`addTrader(pos,direction,type) {}`，现在请直接更改`traderInfo`数组。
- **更改** 方法`addSpawner(resourceType,pos) {}`→`addSpawners(...spawners) {}`，现在允许直接传入多个参数，并且现在每个生成点信息所传入的坐标`pos`需传入钻石点或绿宝石点中钻石块或绿宝石块的位置，而不再是其上方 2 格。

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
