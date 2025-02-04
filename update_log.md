## 夺点模式

- 全新的游玩模式！
- 取自于 2018 年时，Hypixel 公布的一款全新的起床战争玩法。
- 夺点模式是基于 2 队模式而制作的新模式。
  - 但是，底层代码中已经做了一些对多人模式的适配。
- 玩家可以在 **「武器与盔甲」** 商人处，花费 **2 颗钻石**购买一张床。
  - 因此，钻石岛从经典模式的 2 个增加到了 4 个。
- 玩家购买的床可以在世界中散落的 **5 个点位**处放置。
  - 5 个点位分别在：队伍岛 2 个、侧岛 2 个、中岛 1 个。
  - 床只能够放置在基岩上。
  - 开局时，每个队伍的岛屿处都有一张属于自己队伍的床。
- 双方在开局时都有 1500 分，每 1 秒各个队伍都将扣除其他队伍床数的总和的分数。
  - 例如，若红队有 3 张床，蓝队有 1 张床，则红队每秒扣除 1 分，蓝队每秒扣除 3 分。
- 先扣除完所有分数的队伍，将被淘汰！
  - 也就是说，在当前的两队模式下，只要不率先被扣除完全部分数就能获得胜利！
  - 传统的起床战争判定模式仍然生效 —— 若一个队伍的床被全部破坏后，且队伍成员被全部最终击杀，则该队伍亦被淘汰！
  - 如果两个队伍同时被扣除完分数，则为平局。
- 此外，夺点模式相比于经典模式，还有以下的特性：
  - 现在的信息板将显示各个队伍的分数和每秒被扣除的分数、以及占据的点位情况。
  - 信息板不显示最终击杀数和破坏床数。
  - 床被破坏显示的信息和标题也不相同。
  - 移除了绝杀模式和床自毁事件。
    - 因此，每个队伍都默认获得「末影龙增益」团队升级（虽然它并没有用处）。
  - 每个点位附近会有羊毛来指代该床是属于何队伍的。如果为白色，则代表着目前没有队伍占据该点位。
  - 床被破坏、或新放置的床都会使得点位周围的可染色方块（包括羊毛、玻璃、硬化粘土（染色陶瓦））发生颜色的变化。
  - 如果一个队伍的床被全部破坏后放置了唯一的一张床，则所有被淘汰的成员都将在 5 秒内全部复活。
    - 因此，劣势队伍还可以通过放置一张新的床来扳回一城。

## 道具

- 调低了铁傀儡的伤害（5~13 → 5~10）。
- 现在蠹虫不再会钻到石头里。

## 资源生成

- 现在绿宝石默认为 65 秒生成 1 颗，每 1 级减 10 秒。

## 新地图

- 新增了一张 4 队地图：Aquarium（水族馆）。
- 新增了一张 8 队地图：Deadwood（莲叶）。
  - 虽然 Deadwood 的实际英译为「枯木」，不过地图实际装饰更像是莲叶。
- 新增了一张夺点模式地图：Picnic（野餐）。
  - 该地图是 Hypixel 官方唯一的一张夺点模式地图。
  - 该地图有一张 2 队地图与之对应。

## 漏洞修复

- 修复了 4 队地图 拱形廊道 的铁锭生成速率为正常地图的 10 倍的问题。

## 底层更新

### `manifest.json`

- 行为包的清单文件现在更新到了`1.0.2`版本。
- 资源包的清单文件现在更新到了`1.2.4`版本。

### 商人

- 新增了一个新的商人类型：武器与盔甲（夺点）`weapon_and_armor_capture`。
  - 相比于普通的武器与盔甲商人，该商人的物品栏多一个槽位以填充床的商店物品。

### 床

- 新增了 2 个新物品：红色床`bedwars:red_bed`、蓝色床`bedwars:blue_bed`。
  - 仅能在基岩上放置，可放置结构空位。
  - 通过脚本系统检测玩家放置了床，从而控制点位归属权的更改。
- 新增了 1 个商店物品：床（商店物品）`bedwars:shopitem_bed`。
  - 用于使玩家购买红色床或蓝色床，购买的颜色取决于玩家所在的队伍。

### 防爆玻璃

- 新增了一个方块模型`geometry.glass`，现在防爆玻璃在物品栏显示的颜色和原版方块类似，并且不再出现有关缺失`minecraft:material_instance`组件的`warning`报错。
  - 虽然，这个报错是 Minecraft 本身的问题，并且 Mojang 在 1.21.60 版本中就已经移除了这个报错。

### 脚本

- 对脚本系统再次进行大改和拆分。
- 下文均为对脚本系统的更改细节。

### 文件移除、拆分与修改

- 移除了`methods.js`，其中的方法大多数拆分到`methods`脚本文件夹中。在该文件夹的文件中，写入了一些基本的方法或者类。
  - 彻底移除了`resourceTypeToResourceId(resourceType) {}`。该函数在任何文件中都不再使用。
  - 彻底移除了`teamNameToTeamNumber(teamName) {}`和`teamNumberToTeamName(teamNumber) {}`。该函数在任何文件中都不再使用。
  - 彻底移除了`hasItemTypeTest(entity,stringOfItemId) {}`。该函数在任何文件中都不再使用。
- 移除了`maps.js`，其中的方法大多数拆分到`methods`脚本文件夹中的`bedwarsMaps.js`。在该文件中，写入了一些基本的方法或者类。
- 移除了`team.js`，其中的方法大多数拆分到`methods`脚本文件夹中的`bedwarsTeams.js`。在该文件中，写入了一些基本的方法或者类。
- 移除了`shopitem.js`，其中的方法大多数拆分到`methods`脚本文件夹中的`bedwarsShopitem.js`。在该文件中，写入了一些基本的方法或者类。
- 移除了`events.js`，其中的函数大多数拆分到`events`脚本文件夹中。在该文件夹的文件中，写入了大量取自原`events.js`、`BedwarsMap`类、`BedwarsTeam`类、`BedwarsPlayer`类、`Shopitem`类中的函数、方法。
  - `events`脚本文件夹分为 3 个文件夹和 1 个文件。
  - `items/`：其中的文件控制物品的使用逻辑。包括床虱、搭桥蛋、梦境守护者、魔法牛奶、药水、TNT、水桶。这些物品的使用逻辑在任何模式均生效。
  - `gaming/`：其中的文件控制经典模式的游戏运行逻辑。这些函数可以通过`events/eventManager.js`来控制启用或是禁用，从而便于在其他模式下开启或关闭某些功能。
  - `capture/`：其中的文件控制夺点模式的游戏运行逻辑。这些文件名大多和`gaming/`是相同的，代表夺点模式是基于经典模式的逻辑而编写的，只是使用了`eventManager`禁用了经典模式的部分逻辑，而使用夺点模式的独有逻辑。
  - `eventManager.js`：用于启用或禁用部分事件，这些事件就像是拼图一样，可以拆分再重组。
- 移除了`constants.js`，其中应用的变量被移动到各个对应功能的文件中去。
- 移除了`events.js`，其中的方法大多数拆分到`events`脚本文件夹中。并更改了`main.js`对于游戏事件的调用方法。现在主文件通过调用`methods/intervalManager.js`和`methods/eventManager.js`的方法来控制代码的运行。

#### `methods/debug.js`

- 用于在开发过程中进行调试的方法。
- 主要为 @沫尘 写的用于打印对象的方法。
- `objectPrint(obj) {}`：打印一个对象。
  - 拆自原`methods.js`的`object_print(obj)`函数。
- `objectPrintNoMethod(obj) {}`：打印一个对象，但不打印其中的方法。
  - 拆自原`methods.js`的`object_print_no_method(obj)`函数。
- `objectPrintActionbar(obj) {}`：打印一个对象到快捷栏标题。
  - 拆自原`methods.js`的`object_print_actionbar(obj)`函数。
- `objectPrintActionbarNoMethod(obj) {}`：打印一个对象到快捷栏标题，但不打印其中的方法。
  - 拆自原`methods.js`的`object_print_actionbar_no_method(obj)`函数。
- `sendMessage(obj) {}`：发送一段消息。
  - 拆自原`methods.js`的`sendMessage(obj)`函数。

#### `methods/eventManager.js`

- 用于进行 SAPI 系统中的 `beforeEvents` 和 `afterEvents` 事件管理。
- `createEvent(id,eventId,func,tags=[],options={}) {}`：创建一个新的事件。
- `deleteEvents(...ids) {}`：删除一个或一些特定 ID 的事件。
- `deleteEventsWithTag(...tags) {}`：删除一个或一些具有特定 tag 的事件。

#### `methods/intervalManager.js`

- 用于进行 SAPI 系统中的 `system.runInterval()` 循环函数管理。
- `createInterval(id,func,tags=[],tick=1) {}`：创建一个新的循环函数。
- `deleteIntervals(...ids) {}`：删除一个或一些特定 ID 的循环函数。
- `deleteIntervalsWithTag(...tags) {}`：删除一个或一些具有特定 tag 的循环函数。

#### `methods/itemManager.js`

- 用于进行特定实体的物品管理、物品栏管理、或进行物品实体管理。
- `generateItemStack(itemId,options={}) {}`：按照所给信息生成一个 `ItemStack` 信息。
  - 拆自原`method.js`的`itemInfo(itemId,options={}) {}`。
- `spawnItem(pos,itemId,options={})`：在一个位置生成物品掉落物。
  - 拆自原`method.js`的同名函数。
- `giveItem(player,itemId,options={})`：给予玩家物品。
  - 拆自原`method.js`的同名函数。
- `replaceEquipmentItem(player,itemId,slot,options={}) {}`：设置玩家的盔甲。
  - 拆自原`method.js`的同名函数。
- `replaceInventoryItem(entity,itemId,slot,options={}) {}`：设置玩家特定物品栏槽位的物品。
  - 拆自原`method.js`的同名函数。
- `removeItem(entity,itemId,count=1,data=-1) {}`：移除玩家的物品。
- `removeItemEntity(itemId) {}`：移除特定 ID 的物品实体。
  - 拆自原`method.js`的`removeItem(itemId) {}`。
- `getAllInventoryItems(entity) {}`：获取特定实体所有物品栏的物品。
- `getAllSlots(entity) {}`：获取特定实体所有槽位信息。
- `hasItem(entity,item,options={}) {}`：获取特定实体是否拥有某物品。
- `eachValidItem(entity,func) {}`：令特定实体的所有有效物品（非`undefined`）执行一个函数。
- `eachValidSlot(entity,func) {}`：令特定实体的所有有效槽位（非`undefined`）执行一个函数。
- `getItemAmount(entity,itemId) {}`：获取所有特定实体拥有的物品数目。
  - 拆自原`method.js`的`entityHasItemAmount(entity,itemId) {}`。
- `getInventoryEnchantmentLevel(player,slot,enchantmentId) {}`：获取特定物品栏槽位下，该物品的附魔等级。
- `getEquipmentEnchantmentLevel(player,slot,enchantmentId) {}`：获取特定盔甲栏槽位下，该物品的附魔等级。
  - 拆自原`method.js`的`getEnchantmentLevel(player,slot,enchantmentId) {}`。

#### `methods/playerManager.js`

- 用于进行玩家管理。
- `getPlayerAmount() {}`：获取玩家人数。
  - 拆自原`method.js`的同名函数。
- `getPlayerNearby(pos,r) {}`：获取在特定位置周围的玩家信息。
  - 拆自原`method.js`的同名函数。
- `eachPlayer(func) {}`：令每个玩家都执行特定函数。
  - 拆自原`method.js`的`eachPlayer(callback) {}`。
- `eachNearbyPlayer(pos,r,func){}`：令每个在特定位置周围的玩家都执行特定函数。
- `entityIsNearby(entity,pos,r) {}`：检测是否有特定实体在特定位置周围。
- `setPlayerGamemode(player,gamemode) {}`：设置玩家的游戏模式，但创造模式的玩家不受影响。
- `showTitle(player,title,subtitle="",options={}){}`：显示标题。
  - 拆自原`method.js`的同名函数。

#### `methods/positionManager.js`

- 用于进行坐标管理，或者一些基础的坐标运算。
- `overworld`：返回主世界信息。
  - 拆自原`constants.js`的同名变量。
- 类 `Vector`：返回一个二维或三维向量。
- `positionManager = {...}`：用于进行坐标转换的对象，并返回一个新的坐标，使得原坐标不会被影响。
  - `copy(vector) {}`：复制一个坐标信息。
    - 拆自原`method.js`的`copyPosition(pos) {}`。
  - `add(vector,xAdder=0,yAdder=0,zAdder=0) {}`：将输入的坐标分别加上特定的值后输出一个新坐标。
  - `center(pos) {}`：返回一个将`x`和`z`中心化后的坐标（各加`0.5`）。
    - 拆自原`method.js`的`centerPosition(pos) {}`。

#### `methods/time.js`

- 用于进行时间值管理，例如转换、或者输出特定字符串。
- `tickToSecond(tickTime) {}`：将游戏刻的时间转化为秒数时间。向上取整。
  - 拆自原`method.js`的同名函数。
- `secondToMinute(secondTime) {}`：将秒数时间转化为分钟时间，并同时返回转化后的秒数和分钟数对象。
  - 拆自原`method.js`的`secondToMinute(secondTime,returnType="value") {}`。
- `timeString(mode,time={minute,second,tick}) {}`：将给定的时间值转化为时间字符串。
  - 拆自原`method.js`的`secondToMinute(secondTime,returnType="value") {}`。

#### `methods/number.js`

- 基于 JavaScript 特性编写的一些有用方法。
- `randomInt(min,max) {}`：返回在特定范围间的整数，含两端。
  - 拆自原`method.js`的同名函数。
- `intToRoman(num) {}`：返回一个数字对应的罗马数字字符串。
- `getKeyByValue(obj,value) {}`：从一个对象中搜索特定值的键。
- `shuffleArray(array) {}`：打乱一个数组。
  - 拆自原`maps.js`的同名函数。
- `isEmptyObject(obj) {}`：检查传入的对象是否为空对象。
- `removeElementOfArray(array,element) {}`：移除数组中的特定元素。
- `objectInArray(array, object) {}`：判断由对象组成的数组中是否含有某个对象。

#### `methods/bedwarsMaps.js`

- 控制起床战争地图基本的运行方式。
- 类 `BedwarsMap`：地图基本信息。
  - 拆自原`maps.js`的`BedwarsMap`类。
  - **新增** 变量`mode`，类型为`"classic"|"capture"`，控制地图将以经典模式运行还是以夺点模式运行。
  - **新增** 对象`captureInfo`，记录夺点模式信息。
    - `validBedPoints`：类型为`Vector[]`。记录该地图所有有效床的点位，均记录床的`x`、`y`、`z`的最小值。
    - `gameOverCountdown`：类型为`Number`。游戏结束倒计时，单位：秒。
    - `dominantTeam`：类型为`"red"|"blue"|"none"`。优势方的队伍 ID 。
  - **新增** 方法`setNextEvent(nextEventCountdown,nextEventName) {}`，使`this.gameEvent.currentId`自加并使用输入的倒计时和下一个事件名称。
  - **新增** 方法`modeName() {}`，获取地图模式名称。
  - **新增** 方法`getStartIntro() {}`，获取开始游戏的聊天栏介绍。
  - **新增** 方法`getCaptureInfo() {}`，获取夺点模式信息（优势方和游戏结束倒计时）并返回值。
  - **更改** 现在`traderInfo`的`type`可以填写为`weapon_and_armor_capture`。
  - **更改** 现在`spawnpointPos`采用`positionManager.js`的`Vector`类构建。
  - **更改** 现在构建器构建时可以使用`mode`作为可选项了。
  - **更改** 方法`gameOver() {}`，简化该方法，现在该方法仅重置游戏阶段为`2`并开启重置倒计时。以前的类似方法位于`events/gaming/afterGaming.js`。
  - **移除** 对象`gameEvent`的`nextEventId`，转而使用`currentId`来表示目前的事件 ID 。
  - **移除** 方法`waitingScoreboard(infoBoardProgress) {}`。类似的方法位于`events/gaming/infoBoard.js`。
  - **移除** 方法`spawnResources(resourceType) {}`。类似的方法位于`events/gaming/spawnResources.js`。
  - **移除** 方法`resetSpawnerSpawnedTimes(pos) {}`。类似的方法位于`events/gaming/spawnResources.js`。
  - **移除** 方法`getResourcesSpawnCountdown(resourceType) {}`。类似的方法位于`events/gaming/spawnResources.js`。
  - **移除** 方法`showTextAndAnimation() {}`。类似的方法位于`events/gaming/spawnResources.js`。
  - **移除** 方法`getEventName() {}`，采用方法`setNextEvent(nextEventCountdown,nextEventName) {}`代替。
  - **移除** 方法`triggerEvent() {}`。类似的方法位于`events/gaming/gameEvents.js`。
  - **移除** 方法`gameStart() {}`。类似的方法位于`events/gaming/beforeGaming.js`。
  - **移除** 方法`addSpectator() {}`。类似的方法位于`events/gaming/playerLeaveAndRejoin.js`。
- `createMapAquarium() {}`：生成地图 水族馆 的信息并插入到 `world.bedwarsMap` 。
- `createMapDeadwood() {}`：生成地图 莲叶 的信息并插入到 `world.bedwarsMap` 。
- `createMapPicnicCapture() {}`：生成地图 野餐（夺点） 的信息并插入到 `world.bedwarsMap` 。

#### `methods/bedwarsTeam.js`

- 控制起床战争队伍基本的运行方式。
- 类 `BedwarsTeam`：队伍基本信息。
  - 拆自原`team.js`的`BedwarsTeam`类。
  - **新增** 对象`captureModeInfo`，记录夺点模式信息。
    - `bedsPos`：类型为`Vector[]`。记录该队所占有的所有有效床的点位，均记录床的`x`、`y`、`z`的最小值。这些点位必须是`BedwarsMap`类中`captureInfo.validBedPoints`中的一个。
    - `score`：类型为`Number`。队伍当前积分。
    - `otherTeamBedAmount`：类型为`Number`。其他队伍合计的床数。
  - **新增** 方法`getOtherTeamBed() {}`，获取其他队伍的床数。仅限夺点模式下可用。
  - **更改** 拆分方法`getTeamName(type) {}`，现在使用以下 3 个方法：
    - `getTeamColor() {}`：获取队伍对应的颜色代码，例如：“§c”。
    - `getTeamName() {}`：获取队伍对应的名称，例如：“红”。
    - `getTeamNameWithColor() {}`：获取队伍带颜色的队伍名称，例如：“§c红”。
  - **更改** 现在方法`setBed() {}`也可以适用于夺点模式。
  - **移除** 方法`bedDestroyedByInvalidPlayer(breaker) {}`。类似的方法位于`events/gaming/playerBreakBlockTest.js`。
  - **移除** 方法`bedDestroyedBySelfPlayer(breaker) {}`。类似的方法位于`events/gaming/playerBreakBlockTest.js`。
  - **移除** 方法`bedDestroyedByOtherPlayer(breaker) {}`。类似的方法位于`events/gaming/playerBreakBlockTest.js`。
  - **移除** 方法`addPlayer(player) {}`。现在使用`new BedwarsPlayer(...)`代替。
  - **移除** 方法`spawnResources(resourceType) {}`。类似的方法位于`events/gaming/spawnResources.js`。
  - **移除** 方法`resetSpawnerSpawnedTimes() {}`。类似的方法位于`events/gaming/spawnResources.js`。
  - **移除** 方法`getForgeBonus() {}`。类似的方法位于`events/gaming/spawnResources.js`。
  - **移除** 方法`triggerTrap(enemyPlayer) {}`。类似的方法位于`events/gaming/trap.js`。
  - **移除** 方法`teamUpgradeEffect() {}`。类似的方法位于`events/gaming/effects.js`。
- `eachTeam(func) {}`：令每个队伍执行一个函数。
  - 拆自原`method.js`的`eachTeam(callback) {}`。
- `getTeam(id) {}`：获取特定 ID 的队伍信息。

#### `methods/bedwarsPlayer.js`

- 控制起床战争玩家基本的运行方式。
- 类 `BedwarsPlayer`：队伍基本信息。
  - 拆自原`methods.js`的`BedwarsPlayer`类。
  - **更改** 现在将所需要的变量放到了类体中，而非构建器中，并添加了注释以标记变量用途
  - **更改** 现在在构建时，会根据输入的队伍信息自动分配玩家信息。
    - 因此，移除了`BedwarsTeam`类的方法`addPlayer(player) {}`。
  - **新增** 方法`setSpectator() {}`，将玩家标记为旁观者模式，并进行一系列操作。
  - **新增** 方法`setTeamMember() {}`，将玩家设置为构建器输入的队伍的成员，并进行一系列操作。
  - **新增** 方法`addHurtInfo(attacker) {}`，新增受伤信息。
  - **新增** 方法`resetHurtInfo() {}`，清空受伤信息。
  - **新增** 方法`loseToolTier() {}`，将玩家的镐和斧降级。
  - **新增** 方法`setPlayerAlive() {}`，设置玩家的参数为非死亡状态。
  - **新增** 方法`setPlayerDead(deathType) {}`，设置玩家的死亡状态和死亡类型。
  - **新增** 方法`getBedState() {}`，获取玩家所在的队伍是否有床。
  - **新增** 方法`spawn(option={}) {}`，设置玩家在队伍岛屿生成。
  - **更改** 将`setNameColor(name) {}`更名为`setNametag() {}`，移除了对参数的需求，并且现在该函数直接更改玩家的名称，而非返回一个玩家的名称再由其他函数更改。
  - **移除** 方法`selfBedDestroyed(player,bedKiller) {}`。类似的方法位于`events/gaming/playerBreakBlockTest.js`。
  - **移除** 方法`otherBedDestroyed(player,bedKiller,teamId) {}`。类似的方法位于`events/gaming/playerBreakBlockTest.js`。
  - **移除** 方法`showTrapsInInventory() {}`。类似的方法位于`events/gaming/trap.js`。
  - **移除** 方法`playerDied() {}`。类似的方法位于`events/gaming/combat.js`。
  - **移除** 方法`playerRespawned() {}`。类似的方法位于`events/gaming/combat.js`。
  - **移除** 方法`swordSupplier() {}`。类似的方法位于`events/gaming/equipmentTest.js`。
  - **移除** 方法`axeSupplier() {}`。类似的方法位于`events/gaming/equipmentTest.js`。
  - **移除** 方法`pickaxeSupplier() {}`。类似的方法位于`events/gaming/equipmentTest.js`。
  - **移除** 方法`shearsSupplier() {}`。类似的方法位于`events/gaming/equipmentTest.js`。
  - **移除** 方法`show2TeamsScoreboard() {}`。类似的方法位于`events/gaming/infoBoard.js`。
  - **移除** 方法`show4TeamsScoreboard() {}`。类似的方法位于`events/gaming/infoBoard.js`。
  - **移除** 方法`show8TeamsScoreboard() {}`。类似的方法位于`events/gaming/infoBoard.js`。
  - **移除** 方法`dataBackup(player) {}`。类似的方法位于`events/gaming/playerLeaveAndRejoin.js`。
  - **移除** 方法`dataReset(data) {}`。类似的方法位于`events/gaming/playerLeaveAndRejoin.js`。
  - **移除** 方法`showHealth() {}`。类似的方法位于`events/gaming/infoBoard.js`。
- `playerIsValid(player) {}`：检查输入的玩家是否含有起床战争信息（即有效玩家）。 
  - 拆自原`method.js`的同名函数。
- `playerIsAlive(player) {}`：检查输入的玩家是否含有起床战争信息，且是否为存活的玩家。
  - 拆自原`method.js`的同名函数。
- `getPlayerBedwarsInfo(player) {}`：返回玩家的起床战争信息。
- `eachValidPlayer(func) {}`：令每个有效玩家执行一个函数。
  - 拆自原`method.js`的同名函数。
- `eachAlivePlayer(func) {}`：令每个存活玩家执行一个函数。
- `getValidPlayers() {}`：获取所有的有效玩家。
- `warnPlayer(player,rawtext) {}`：以音调为 2.0 的传送音效和聊天栏信息警告特定玩家。
  - 拆自原`method.js`的同名函数。
- `initPlayer(player) {}`：在等待期间时初始化玩家。
  - 拆自原`method.js`的同名函数。

#### `methods/bedwarsSettings.js`

- 控制起床战争的部分设置。
- 该文件移动自`settings.js`，内容无大变动。

#### `methods/bedwarsShopitem.js`

- 控制起床战争商店物品的运行方式。
- 类 `Shopitem`：商店物品基本信息。
  - 拆自原`methods.js`的`Shopitem`类。
  - **更改** 将`generateLore() {}`更名为`getLore() {}`，并进行了代码整理与优化。
  - **移除** 方法`setTraderItem(slotLocation) {}`。类似的方法位于`events/gaming/trading.js`。
  - **移除** 方法`playerPurchaseItems(player) {}`。类似的方法位于`events/gaming/trading.js`。

#### `events/eventManager.js`

- 是一种区别于以前的全新的事件处理方式。
- 现在事件不再通过`main.js`直接处理，而是调用`methods/intervalManager.js`和`methods/eventManager.js`的方法来控制事件的运行。
- 和以前不同的是，现在很多的`beforeEvent`和`afterEvent`事件是能够直接取消执行的。
- 因此，利用这一机制，可以便捷地将经典模式的部分代码取消，并转用独有模式的独有事件。
- **新增** `eventManager`对象。调用该对象的方法可以轻松地进行不同模式不同阶段的事件管理。
  - `createGeneralEvents() {}`方法：用于添加全局通用事件。
  - `createBeforeGamingEvents() {}`方法：用于添加经典模式的游戏前事件，即等待期间的事件。
  - `createGamingEvents() {}`方法：用于添加经典模式的游戏时事件，也是运行时的主要事件。
  - `createAfterGamingEvents() {}`方法：用于添加经典模式的游戏后事件，即游戏结束后的事件。
  - `deleteBeforeGamingEvents() {}`方法：用于移除经典模式的游戏前事件，即等待期间的事件。
  - `deleteGamingEvents() {}`方法：用于移除经典模式的游戏时事件，也是运行时的主要事件。
  - `deleteAfterGamingEvents() {}`方法：用于移除经典模式的游戏后事件，即游戏结束后的事件。
  - `captureGamingEvents() {}`方法：用于添加夺点模式的游戏时事件。该方法将移除少量的经典模式事件并使用夺点模式的独有事件，即基于经典模式之上的独有代码。
  - `captureAfterEvents() {}`方法：用于添加夺点模式的游戏后事件，即游戏结束后的事件。

#### `events/gaming/beforeGaming.js`

- 控制经典模式运行的游戏前逻辑。
- `waiting() {}`：拆自原`events.js`的`waitingFunction() {}`。

#### `events/gaming/combat.js`

- 控制经典模式运行的战斗逻辑。
- `combat() {}`：进行有关战斗、重生的检测。
  - 拆自原`events.js`的`respawnFunction() {}`、`playerHurtFunction() {}`、`voidDamageFunction() {}`。
- `playerDied(event) {}`：当玩家死亡后执行的内容。
  - 拆自原`events.js`的`playerDieEvent(event) {}`。
- `hurtByPlayer(event) {}`：当被玩家攻击后，记录攻击者的信息。
  - 拆自原`events.js`的`hurtByPlayerEvent(event) {}`。
- `hurtByFireball(event) {}`：当被玩家的火球攻击后，记录攻击者的信息。
  - 拆自原`events.js`的`hurtByFireballsEvent(event) {}`。
  - **已知漏洞**：火球的攻击者会记录自身的信息。

#### `events/gaming/playerBreakBlockTest.js`

- 控制经典模式破坏方块的行为逻辑。
- `playerBreakVanillaBlocksTest(event) {}`：当玩家破坏原版方块时，阻止玩家破坏方块。
  - 拆自原`events.js`的`playerBreakBlockEvent(event) {}`。
- `playerBreakBedTest(event) {}`：当玩家破坏床时，进行判定。
  - 拆自原`events.js`的`playerBreakBlockEvent(event) {}`。

#### `events/gaming/heightLimit.js`

- 控制经典模式高度上限与下限的行为逻辑。
- `maxHeightLimit(event) {}`：当玩家在高度上限处使用物品时，进行警告并阻止之。
  - 拆自原`events.js`的`playerUseItemOnHeightLimitEvent(event) {}`。
- `minHeightLimit(event) {}`：当玩家在高度下限处使用物品时，进行警告并阻止之。
  - 拆自原`events.js`的`playerUseItemOnHeightLimitEvent(event) {}`。

#### `events/gaming/equipmentTest.js`

- 控制经典模式装备供应的行为逻辑。包括剑、镐、斧、剪刀和盔甲（包括附魔）的供应。
- `equipmentTest() {}`：当玩家的装备信息不符合其起床战争信息时，则更换或重附魔之。
  - 拆自原`events.js`的`equipmentFunction() {}`，并在原基础上大幅修改。
  - 该文件中采用的大量方法，均来自于拆分前的`BedwarsPlayer`类方法。

#### `events/gaming/explosion.js`

- 控制经典模式下的各种爆炸事件。例如阻止原版方块被破坏，或实现火球跳等。
- `preventBreakingVanillaBlocks(event) {}`：防止爆炸破坏原版方块或不该破坏的方块。
  - 拆自原`events.js`的`explosionEvents(event) {}`。
- `dropLoot(event) {}`：令某些原本无法通过爆炸掉落的方块手动掉落。主要为末地石和各色硬化粘土，这些方块并不应用原版方块。
  - 拆自原`events.js`的`explosionEvents(event) {}`。
- `applyYVelocity(event) {}`：为爆炸中的提供 Y 方向的瞬时速度。用于火球跳。
  - 该函数可能会在未来继续优化，以更接近 Hypixel 。
  - 拆自原`events.js`的`explosionEvents(event) {}`。
- `applyResistanceNearby()`：为爆炸物附近的玩家提供抗性提升，以求爆炸实现高范围低伤害。
  - 拆自原`events.js`的`explosionFunction() {}`。

#### `events/gaming/effects.js`

- 控制经典模式下的各种状态效果事件。
- `alwaysSaturation() {}`：为玩家提供始终饱和，防止玩家需要食物。
  - 拆自原`events.js`的`effectFunction() {}`。
- `teamUpgradeEffects() {}`：为玩家提供团队效果，例如急迫等。
  - 拆自原`events.js`的`effectFunction() {}`。
- `invulnerableAfterGame() {}`：游戏结束后提供抗性提升，防止玩家死亡。

#### `events/gaming/spawnesources.js`

- 控制经典模式的资源生成逻辑。
- `spawnResources() {}`：控制资源的生成位置、生成数量、生成时间等。
  - 拆自原`events.js`的`spawnResourceFunction() {}`，并在原基础上大幅修改。
  - 该文件中采用的大量方法，均来自于拆分前的`BedwarsTeam`类和`BedwarsMap`类方法。

#### `events/gaming/trading.js`

- 控制经典模式的交易逻辑。
- `trading() {}`：控制交易时的玩家物品锁定、商人物品供应、玩家购买物品、移除商店物品实体等功能。
  - 拆自原`events.js`的`tradeFunction() {}`，并在原基础上大幅修改。
  - 该文件中采用的大量方法，均来自于拆分前的`Shopitem`类方法。

#### `events/gaming/infoboard.js`

- 控制经典模式的信息板逻辑。
- `beforeGamingInfoBoard() {}`：控制在游戏前使用的信息板的显示内容。
  - 拆自原`BedwarsMap`类的一个方法`waitingScoreboard(infoBoardProgress) {}`。
- `gamingInfoBoard() {}`：控制在游戏过程中使用的信息板的显示内容。
  - 拆自原`events.js`的`scoreboardFunction() {}`，并在原基础上大幅修改。
  - 拆自原`BedwarsPlayer`类的三个方法`show2TeamsScoreboard() {}`、`show4TeamsScoreboard() {}`、`show8TeamsScoreboard() {}`，进行优化、整理和合并后得到该方法。
- `healthScoreboard() {}`：控制在游戏过程中使用的信息板的显示内容。
  - 拆自原`events.js`的`scoreboardFunction() {}`。
  - 拆自原`BedwarsPlayer`类的一个方法`showHealth() {}`。

#### `events/gaming/gameEvents.js`

- 控制经典模式的游戏事件逻辑和输赢判定逻辑。
- `gameEvents() {}`：控制常规的游戏事件，例如钻石点升级、绿宝石点升级等。
  - 拆自原`events.js`的`gameEventFunction() {}`。
- `teamEliminateAndWin() {}`：对队伍的输赢进行判定。
  - 拆自原`events.js`的`teamFunction() {}`。

#### `events/gaming/playerLeaveAndRejoin.js`

- 对退出重进的玩家进行状态判定，如果状态正常则设置为队员，并设置为死亡状态，否则设置为旁观者。
- `playerLeave(event) {}`：当玩家退出时，进行数据备份。
  - 拆自原`events.js`的`playerLeaveEvent(event) {}`和原`BedwarsPlayer`类的一个方法`dataBackup(player) {}`。
- `playerRejoin(event) {}`：当玩家回到游戏时，对其身份进行判定，并视情况设置为队员或旁观者。
  - 拆自原`events.js`的`playerRejoinEvent(event) {}`。

#### `events/gaming/afterGaming.js`

- 在游戏结束后进行的事件处理。
- `gameOver(winningTeam) {}`：按照输入的队伍处理游戏结束事件并判定。
  - 拆自原`BedwarsMap`类的一个同名方法。
- `gameOverCountdown() {}`：游戏结束后进行的倒计时，当倒计时结束后，开始新的一局。
  - 拆自原`events.js`的`gameOverEvent() {}`。

#### `events/items/bedBug.js`

- 控制床虱的运行逻辑。
- 在任何模式下均可应用。
- `summonSilverfish(event) {}`：当床虱雪球砸到地面上后，生成床虱。
  - 拆自原`events.js`的`bedBugEvent(event) {}`。
- `silverfishCountdown() {}`：对队伍床虱进行存活倒计时。
  - 拆自原`events.js`的`bedbugFunction() {}`。

#### `events/items/bridgeEgg.js`

- 控制搭桥蛋的运行逻辑。
- 在任何模式下均可应用。
- `createBridge() {}`：在搭桥蛋经过的地方生成 3*3，85% 完整度的对应队伍羊毛。
  - 拆自原`events.js`的`bridgeEggFunction() {}`。

#### `events/items/dreamDefender.js`

- 控制铁傀儡的运行逻辑。
- 在任何模式下均可应用。
- `summonIronGolem(event) {}`：当玩家在方块上使用刷怪蛋后，生成铁傀儡。
  - 拆自原`events.js`的`dreamDefenderEvent(event) {}`。
- `ironGolemCountdown() {}`：对队伍铁傀儡进行存活倒计时。
  - 拆自原`events.js`的`dreamDefenderFunction() {}`。

#### `events/items/magicMilk.js`

- 控制魔法牛奶的运行逻辑。
- 在任何模式下均可应用。
- `playerDrinkMagicMilkTest(event) {}`：当玩家喝下魔法牛奶后，更新其状态。
  - 拆自原`events.js`的`playerUsePotionAndMagicMilkEvent(event) {}`。
- `magicMilkCountdown() {}`：当玩家处于魔法牛奶的状态时，进行倒计时。
  - 拆自原`events.js`的`magicMilkFunction() {}`。

#### `events/items/potions.js`

- 控制各种药水（隐身药水、跳跃 V 药水、速度药水）的运行逻辑。
- 在任何模式下均可应用。
- `playerDrinkPotionTest(event) {}`：当玩家喝下各种药水（隐身药水、跳跃 V 药水、速度药水）后，更新其状态。
  - 拆自原`events.js`的`playerUsePotionAndMagicMilkEvent(event) {}`。

#### `events/items/tnt.js`

- 控制 TNT 立刻点燃的运行逻辑。
- 在任何模式下均可应用。
- `igniteImmediately(event) {}`：在玩家放置 TNT 的地方立刻点燃 TNT 。
  - 拆自原`events.js`的`playerUseTNTEvent(event) {}`。

#### `events/items/waterBucket.js`

- 控制水桶收回桶的运行逻辑。
- 在任何模式下均可应用。
- `clearBucket(event) {}`：在玩家放置水桶后立刻清空玩家的桶 。
  - 拆自原`events.js`的`playerUseWaterBucketEvent(event) {}`。

#### `events/capture/combat.js`

- 在夺点模式时使用的独有战斗逻辑。
- 是基于经典模式的部分代码的情况下运行的。
- `playerDiedCapture(event) {}`：当玩家被淘汰后，额外在基于经典模式的基础上提醒该队伍可以通过放置新床来复活已淘汰的成员。
- `respawnEliminatedPlayers() {}`：当玩家被淘汰后，如果该队拥有新床则启用复活程序。
- `convertKillCount() {}`：将玩家的最终击杀数转化为普通击杀。

#### `events/capture/gameEvents.js`

- 在夺点模式时使用的独有游戏事件逻辑。
- 是基于经典模式的部分代码的情况下运行的。
- `gameEventsCapture() {}`：在夺点模式运行的游戏事件，区别于经典模式。其中常规事件移除了床自毁、绝杀模式和游戏结束，但增加了每秒减分的程序。
- `teamEliminateAndWinCapture() {}`：对队伍的输赢进行判定，区别于经典模式。
- `supplyDragonBuff() {}`：强制使所有队伍获得末影龙增益效果，防止有队伍花 5 颗钻石当大冤种。

#### `events/capture/infoBoard.js`

- 在夺点模式时使用的独有信息板逻辑。
- 是区别于经典模式的部分代码的情况下运行的。
- `CaptureInfoBoard() {}`：在夺点模式显示的信息板。区别于经典模式。
  - **已知问题**：函数名开头字母意外大写。

#### `events/capture/playerBreakBed.js`

- 在夺点模式时使用的独有破坏床逻辑。
- 是区别于经典模式的部分代码的情况下运行的。
- `playerBreakBedTestCapture(event) {}`：当玩家破坏床时，进行判定。区别于经典模式。

#### `events/capture/playerPlaceBed.js`

- 在夺点模式时使用的独有放置床逻辑。
- `playerPlaceBedTest(event) {}`：当玩家放置床时，进行判定。独立于经典模式。
