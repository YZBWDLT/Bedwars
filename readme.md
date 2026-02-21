# 量筒的起床战争

嗨！欢迎你来到本仓库！本仓库储存了在 Bilibili 上的极筑工坊的视频「[【Minecraft】Hypixel起床战争，但是MC基岩版地图！](https://www.bilibili.com/video/BV1Jv421C7ev/)」和我的（一只卑微的量筒）视频「[我在基岩版还原了Hypixel起床战争！ | 量筒的起床战争 宣传片](https://www.bilibili.com/video/BV14CA5eDEDF)」中所提到的起床战争的源代码。

我清楚可能有很多人对我们这个项目很感兴趣。我们非常感谢大家对我们的支持！我们选择将这个项目完全公开到 GitHub 上，供大家学习、参考与游玩！

## 如何使用？

如果稍微「懂行」的同志可能已经看出，我们所提供的是行为包与资源包，并不是地图文件。您可以在右侧的「Releases」中找到我们已经发布的版本，并且下载。

为方便导入，您可以下载我们所给出的「`Bedwars_(版本号).mcaddon`」文件。

如果不出意外，您的 Minecraft 国际版只要是高于 1.21.100 的版本，就都能正确安装两包。为正常使用该包，您需要：

1. 进入新建地图的界面，使用生存模式，启用作弊；
2. 将刚安装成功的包（「量筒的起床战争 行为包」和「量筒的起床战争 资源包」）导入进去，然后创建世界；
3. 世界创建后，即可直接进行游玩！

## 注意事项

1. 禁止转载！您下载本包后，就代表着**本包仅允许您内部的使用**，严禁分发、二次或多次修改后分发。
2. 如果有问题欢迎直接在本 GitHub 仓库的 issues 里面提交您遇到的问题，也可以加入 QQ 群：673941729 。非诚勿扰！

---

## 更新日志

> 版本： Beta 1.1_01

### 旁观模式

- #7 新增主动旁观模式！
- 可以在「设置 - 旁观模式设置」中启用，以允许主动旁观
- 在开启了旁观模式的情况下，玩家可以使用一个新物品以打开主动旁观的设置 UI，在此 UI 中玩家可以选择不旁观、仅下局旁观、或之后的所有游戏都旁观
- 选择了*仅下局旁观*或*之后的所有游戏都旁观*的玩家，会在开始游戏后自动归为旁观模式
- 开启主动旁观后不能选队，已选队伍的信息会消失

### 漏洞修复

- #80 修复了无法破坏蕨的问题
- #84 修复了每当玩家变化且人数不足时就会警告人数不足的问题
- #85 修复了使用铁傀儡右键箱子会放置铁傀儡的问题
- #86 修复了床自毁会提示所有玩家的问题，现在不再对旁观玩家提示床自毁
- #87 修复了在手机端可以先将商店物品放到空栏位再直接拿出的问题

### 技术性

#### 概述

- 更新了资源包的 UUID，请所有使用此资源包的玩家注意重新安装包，**我们建议所有玩家彻底删除旧版包并使用新版的包**
- 将资源包的版本切换为`1.1.5`
- 现在使用标签分辨不同旁观模式设置的玩家：
  - `spectatorMode:none`或无`spectatorMode:`前缀标签的玩家：不旁观
  - `spectatorMode:nextGame`：仅下局旁观，当游戏开始后将自动移除此标签
  - `spectatorMode:always`：之后的所有游戏都旁观

#### 库文件

- **新增** `lib.FormButtonComponent.visible: boolean | undefined`属性，以便控制显示的按钮是否需要显示出来，默认值为`true`

#### 起床战争主文件

- **更名** `BedwarsMap.getBedwarsPlayer()` → `BedwarsMap.getPlayerData()`
- **新增** `BedwarsMap.getAllPlayerData(options: PlayerDataOptions | undefined): BedwarsPlayer[]`方法，用于获取所有起床战争玩家的信息
  - `options: PlayerDataOptions | undefined`：用于筛选特定的玩家信息，可用条件包括：
    - 处于特定队伍内（`includeTeams: data.BedwarsTeamType[] | undefined`），指定后将会额外筛选队伍，否则不筛选
    - 不处于特定队伍内（`excludeTeams: data.BedwarsTeamType[] | undefined`），指定后将会额外筛选队伍，否则不筛选
    - 包含死亡玩家（`includeDeadPlayer: boolean | undefined`），默认值为`true`
    - 包含淘汰玩家（`includeEliminated: boolean | undefined`），默认值为`true`
    - 包含旁观玩家（`includeSpectator: boolean | undefined`），默认值为`true`，需注意另外四项不筛选旁观玩家，如果不选定旁观玩家需单独指定此项
- **新增** `BedwarsSystem.isReleaseVersion: boolean`，用于指定此版本是否为稳定版本，这会影响某些设置的显示
- **新增** `BedwarsSystem.informAllPlayers(message: string | minecraft.RawMessage | (string | minecraft): void`静态方法，用于对所有玩家播放通知类消息
- **新增** `BedwarsSystem.getPlayerAmount(): number`静态方法，用于获取非主动旁观的玩家人数
- **新增** `BedwarsSettings.spectatorMode.enabled: boolean`属性，用于标记主动旁观是否启用
- **新增** `BedwarsSettings.BedwarsSettings.showSpectatorModeSettingsUI(player: minecraft.Player, system: BedwarsSystem): void`静态方法，用于显示旁观模式的 UI
- **新增** `BedwarsMode.removeSelectedTeam(player: minecraft.Player, resetNpcItems?: boolean): void`方法，用于移除玩家的选队信息，并可选是否重置 NPC 的物品
- **新增** `BedwarsMap.addSpectator(player: minecraft.Player): void`方法，用于新增旁观玩家
