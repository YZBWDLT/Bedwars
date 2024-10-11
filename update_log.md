### 新地图

- Glacier 冰川，8队地图
  - 8队地图中的物价略有调整，详情请见Hypixel服务器内售价情况
- Rooftop 屋顶，8队地图

### 商品物价更改

- 物价更改表如下：

| 商品 | 以前的价格 | 现在的价格 |
| --- | --- | --- |
| 钻石剑 | 4绿宝石 | 3绿宝石 |
| 床虱 | 30铁锭 | 24铁锭 |
| 海绵 | 6金锭 | 3金锭 |
| 水桶 | 6金锭 | 3金锭 |

### 最低高度限制

- 现在所有地图都存在**最低高度限制**，玩家将不再允许在50格以下放置方块

### 漏洞修复

- 修复了喝下隐身药水过期后不能正确显示盔甲的问题

### 底层更新

- 更新了`manifest.json`使其显示更详细的描述

#### `methods.js`
- **拆分** 将本文件拆分为 `methods.js`、`maps.js`、`team.js`、`shopitem.js`
- **新增** `centerPosition(pos)`，用于将坐标中心化
  - `pos: Vector3`，接受一个位置，输出`x`和`z`加`0.5`的新坐标
  - 适用于生成实体时所接受的坐标
- **更改** `itemInfo(itemId,options)`现在是公开的

#### `events.js`
- **更改** 优化了`trapFunction()`的警报陷阱，使其更易读
- **更改** 合并了`waitingHallFunction()`、`resetMapFunction()`、`mapLoadFunction()`、`waitingFunction()` → `waitingFunction()`
- **更改** 现在`playerUseItemOnHeightLimitEvent(event)`提供了对最低高度的支持

#### `maps.js`
- 拆自`methods.js`和`constants.js`，保留以下内容：
  - `BedwarsMap`类
  - `shuffleArray(array)`
  - `regenerateMap(mapId)`
  - `createMap***()`
  - `validMapsFor2Teams`
  - `validMapsFor4Teams`
  - `validMapsFor8Teams`
- **新增** `map()`，获取当前地图信息
- **更改** 现在`createMapArchway()`内部使用的变量使用正确的名称`mapArchway`而非`mapCarapace`

#### `team.js`
- 拆自`methods.js`和`constants.js`，保留以下内容：
  - `validTeams`
  - `BedwarsTeam`类

#### `shopitem.js`
- 拆自`methods.js`和`constants.js`，保留以下内容：
  - `shopitemType`
  - `traderType`
  - `Shopitem`类
  - `blocksAndItemsShopitems`
  - `weaponAndArmorShopitems`
  - `teamUpgradeShopitems`

#### `BedwarsMap`类
- 现在将所需要的变量放到了类体中，而非构建器中，并添加了注释以标记变量用途
- **新增** `isSolo()`方法，用于判断地图是否为单挑模式
  - 当队伍数超过4队后，则认为是单挑模式的地图
- **新增** `loadInfo`对象
  - `isLoading`：地图是否处于加载状态
  - `clearingLayer`：正在清除的高度层
    - 因此，原有变量`resetMapCurrentHeight`被移除
  - `clearTimePerLayer`：清空地图时，间隔多长时间清除下一层，单位：游戏刻
  - `structureLoadTime`：加载结构所需的时间，单位：游戏刻
    - 因此，原有变量`structureLoadCountdown`被移除
  - `setTeamIslandTime`：设置队伍岛屿颜色和床所需的时间，单位：游戏刻
- **新增** `heightLimit`对象
  - `max`：地图最高高度限制，默认值为`110`
    - 因此，原有变量`highestBlockLimit`被移除
  - `min`：地图最低高度限制，默认值为`50`
- **更改** `addSpawner(resourceType,pos)`，现在接受`pos:Vector3`而非`x`、`y`、`z`的三个数
- **更改** 现在`gameStage`的标记为`0`：游戏前，`1`：游戏时，`2`：游戏后

#### `BedwarsTeam`类
- 现在将所需要的变量放到了类体中，而非构建器中，并添加了注释以标记变量用途
- **重命名** `trapCooldown` → `trapInfo`，记录该队陷阱信息
- **重命名** `trapCooldown.isEnabled` → `trapInfo.cooldownIsEnabled`，陷阱是否正处于冷却状态
- **重命名** `trapCooldown.value` → `trapInfo.cooldown`，陷阱的冷却倒计时（单位：游戏刻）
- **重命名** `alarming.isEnabled` → `trapInfo.isAlarming`，警报是否启用
- **重命名** `alarming.value` → `trapInfo.alarmedTimes`，警报的音效次数
- **重命名** `getForgeSpeedBonus()` → `getForgeBonus()`，因为锻炉不光对速度有所提升，还对容量有所提升
- **移除** `playerList`，因其未发挥实际作用，可由`getTeamMember()`代替
- **移除** `getRotation()`，将该方法整合到了`setBed()`的`rotation()`中

#### `BedwarsPlayer`类
- **更改** 现在`show8TeamsScoreboard()`拥有功能，显示8队起床战争信息

#### `Shopitem`类
- 现在将所需要的变量放到了类体中，而非构建器中，并添加了注释以标记变量用途
- 新增`costResourceAmountInSolo: Number`，记录在单挑模式下消耗的资源数
  - 通过构建器的`options.costResourceAmountInSolo`传入
  - 默认值为`0`
  - 如果该值为`0`或更小的值，则在单挑模式下将使用正常模式下的消耗的资源数
  - 如果该值为`1`或更大的值，则在单挑模式下将使用该值作为消耗的资源数
- 新增`getCostResourceAmount(): Number`方法，用于输出该商品实际所需要的资源数

