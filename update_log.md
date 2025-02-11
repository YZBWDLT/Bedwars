# 1.0 - RC 1 更新日志

## 更改与漏洞修复

- 修复了第二次进入地图存档，或重新加载服务器后，会有部分实体残留的问题。现在，在完成地图加载后会再次尝试清除一次实体。
- 修复了旁观者会阻止资源生成的问题。
- 现在正在掉落的玩家不再能扔出物品。
- 现在如果玩家在商人附近的 4 格范围内，将锁定物品（以前是 3.5 格）。
- 现在搭桥蛋最多只能搭到边界的 5 格以内。
- 现在末影珍珠不再能够出界。
- 现在重生点设置到最高高度的 7 格以上（以前是 5 格），并且检测卡在聊天栏的玩家的检测半径改为了 2 格（以前是 4 格）。因此，修复了玩家在(0, 最高高度, 0)附近会被错判为重生玩家的漏洞。
- 现在弓在命中后，会对射击者和被射击者播放经验球的音效。

## 底层更新

- **更改** 将`events/gaming/`文件夹重命名为`events/classic/`文件夹。
- **更改** 重命名`BedwarsMap`类方法`init() {}`→`gameReady() {}`，用于转换游戏状态并调用游戏前事件。
- **新增** `BedwarsMap`类方法`gameStart() {}`，用于转换游戏状态并调用游戏时事件。
- **新增** `BedwarsMap`类方法`removeEntityOutOfBorder(entityId,range) {}`，用于移除边界外的实体。
- **更改** 现在`BedwarsMap`类方法`gameOver() {}`，用于转换游戏状态并调用游戏后事件，同时杀龙。
- **移除** `BedwarsMap`类方法`generateMap() {}`，因为该方法在全局仅调用了 1 次。现在相关代码已直接写入`events/classic/beforeGaming.js`。
- **移除** `BedwarsMap`类方法`teamIslandInit() {}`，因为该方法在全局仅调用了 1 次。现在相关代码已直接写入`events/classic/beforeGaming.js`。
- **移除** `BedwarsMap`类方法`assignPlayersRandomly() {}`，因为该方法在全局仅调用了 1 次。现在相关代码已直接写入`gameStart() {}`方法。
- **移除** `BedwarsMap`类方法`setTrader() {}`，因为该方法在全局仅调用了 1 次。现在相关代码已直接写入`gameStart() {}`方法。
- **更改** 移动`playerItemLock() {}`函数，从`events/classic/trading.js`→`event/classic/itemLock.js`，该新文件用于控制物品的锁定。
- **新增** `removeEnderPearl() {}`函数，位于`events/items/enderPearl.js`，用于移除出界的末影珍珠。
- **新增** `removeBridgeEgg() {}`函数，位于`events/items/bridgeEgg.js`，用于移除出界的搭桥蛋。
- **新增** `playSoundWhenShot(event) {}`函数，位于`events/items/bow.js`，用于对射击者和被射击者播放经验球的音效。
