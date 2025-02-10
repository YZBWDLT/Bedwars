# 1.0 - Pre 2 更新日志

## 更改与漏洞修复

- 现在食用多个金苹果后，其伤害吸收效果最多维持 2 颗黄心，而不再是`2*食用个数`个黄心叠加。
- 现在队伍获胜后也能够正确地清除所有的末影龙。
- 修复了`bs:regenerateMap`命令仍错误地保持游戏状态的问题，现在该命令可以在游戏时和游戏后正常工作。
- 修复了自己被自己或队友的火球炸下虚空后，会错误地记录击杀者的问题。
- 修复了部分地图因为商人距离过近而导致生成的资源无法堆叠的问题。
- 修复了卡在聊天栏的玩家会出生在中岛的问题。
- 修复了卡在聊天栏的玩家在床被摧毁后可以无限卡下去，导致进度无法推进的问题。

## 底层更新

- 行为包的清单文件`manifest.json`现在更新到了`1.0.3`版本。
- 资源包的清单文件`manifest.json`现在更新到了`1.2.5`版本。
- **新增** `goldenAppleEffect(event) {}` 方法，位于`events/gaming/effects.js`。该方法控制金苹果的伤害吸收效果最多维持两颗黄心。
- **更改** 修复了`BedwarsMap`类中，`captureInfo.dominantTeam`可能为`"none"`或`"null"`的问题，现在不再会是`"null"`了。
- **重命名** `CaptureInfoBoard() {}`→`captureInfoBoard() {}`，位于`events/capture/infoBoard.js`。
- **重命名** `eventManager.createBeforeGamingEvents() {}`→`eventManager.classicBeforeEvents() {}`。
- **重命名** `eventManager.createGamingEvents() {}`→`eventManager.classicEvents() {}`。
- **重命名** `eventManager.createAfterGamingEvents() {}`→`eventManager.classicAfterEvents() {}`。
- **移除** `eventManager.deleteBeforeGamingEvents() {}`，现在`eventManager.classicEvents() {}`和`eventManager.classicAfterEvents() {}`将自动移除对应事件。
- **移除** `eventManager.deleteGamingEvents() {}`，现在`eventManager.classicBeforeEvents() {}`和`eventManager.classicAfterEvents() {}`将自动移除对应事件。
- **移除** `eventManager.deleteAfterGamingEvents() {}`，现在`eventManager.classicEvents() {}`和`eventManager.classicBeforeEvents() {}`将自动移除对应事件。
- **移除** `eventManager.deleteCaptureEvents() {}`。
- **重命名** `eventManager.captureGamingEvents() {}`→`eventManager.captureEvents() {}`。
- **重命名** `eventManager.createGeneralEvents() {}`→`eventManager.generalEvents() {}`。
- **重命名** `BedwarsTeam.captureModeInfo`→`BedwarsTeam.captureInfo`，与`BedwarsMap`类的命名保持一致。
- **新增** 为`BedwarsPlayer.deathState`新增属性`stayDeadTime`，用于判断玩家在无床状态下保持死亡状态的时间。
- **新增** 函数`lib/get_data/player_is_alive.mcfunction`，用于检测玩家是否处于存活状态。
- **更改** 现在`BedwarsMap`在初始构建地图时会将重生点设置在最高高度以上 5 格。
- **新增** `deadPlayer() {}`方法，位于`events/gaming/combat.js`，用于处理处于死亡状态的玩家。
