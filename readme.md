# 量筒的起床战争

嗨！欢迎你来到本仓库！本仓库储存了在极筑工坊的视频「[【Minecraft】Hypixel起床战争，但是MC基岩版地图！](https://www.bilibili.com/video/BV1Jv421C7ev/)」中所提到的起床战争的源代码。

我清楚可能有很多人对我们这个项目很感兴趣，因此我们在原来的简介中所留的群号已经差点就“被挤爆”了。我们非常感谢大家对我们的支持！虽然还处于实验性阶段，但是我们现在就正式将这个项目完全公开到GitHub上，供大家学习、参考与游玩！

**请注意！该包仍然处于很前期的开发阶段！！所以如果包有问题，请谅解！**

## 如何使用？

如果稍微「懂行」的同志可能已经看出，我们所提供的是行为包与资源包，并不是地图文件。您可以在右侧的「Releases」中找到我们已经发布的版本，并且下载。

为方便导入，您可以下载我们所给出的「`Bedwars_(版本号).mcaddon`」文件。

如果不出意外，您的 Minecraft 国际版只要是高于 1.21.0 的版本，就都能正确安装两包。为正常使用该包，您需要：

1. 进入新建地图的界面，使用生存模式，启用作弊；
2. 将刚安装成功的包（「量筒的起床战争 行为包」和「量筒的起床战争 资源包」）导入进去，然后创建世界；
3. 世界创建后，即可直接进行游玩！

## 注意事项

1. 禁止转载！您下载本包后，就代表着本包仅允许您内部的使用，严禁分发、二次或多次修改后分发。
2. 如果有问题欢迎直接在本 GitHub 仓库的 issues 里面提交您遇到的问题，也可以加入 QQ 群： 673941729 。为便于我们的测试群的管理秩序，请在加入 QQ 群时的入群申请填写 **「GitHub起床战争」** ，否则我们的管理会拒绝您的申请的哦！

---

## 可用设置命令

> 本部分所介绍的内容基于最新版的 Alpha 1.0_01 版本。您必须使用 Alpha 1.0_01 版本才能够使用下面的内容。

我们在包中添加了一些您可以用于执行的命令，这些命令将允许你对包进行设置和调整！命令格式为

`/scriptevent <命令>`

- 每个`<命令>`都有可接受的参数，如果您不填写这些参数，那么您将获得该命令的帮助信息和当前的默认值。
- 如果填写了无效的`<命令>`，那么会报错并返回所有可用的命令。

所有`<命令>`列表如下。

#### `bs:minWaitingPlayers <等待人数>`

控制至少需要多少玩家方可开始游戏。

- `<等待人数>`：整数，默认值为`2`。不允许小于`2`的值。

**例** `/scriptevent bs:minWaitingPlayers 5`：当玩家达到5人后开始倒计时。

#### `bs:gameStartWaitingTime <时间>`

控制玩家达到规定人数后，多久后开始游戏。

- `<时间>`：整数，默认值为`400`。单位：游戏刻。

**例** `/scriptevent bs:gameStartWaitingTime 1200`：当玩家达到规定人数后，开始60秒的倒计时。

#### `bs:resourceMaxSpawnTimes <资源类型> <最大生成数>`

控制各类资源的最大生成数。

- `<资源类型>`：仅允许`iron`、`gold`、`diamond`、`emerald`。
- `<最大生成数>`：整数，不同资源的默认值分别为`72`、`7`、`8`、`4`。

**例** `/scriptevent bs:resourceMaxSpawnTimes gold 10`：将金锭的最大生成数改为10个。

#### `bs:respawnTime <玩家类型> <重生时长>`

控制玩家（包括普通玩家或退出重进的玩家）的重生时间。

- `<玩家>`：仅允许`normalPlayers`（普通玩家）、`rejoinedPlayers`（重进玩家）
- `<重生时长>`：整数，默认值为：普通玩家`110`、重进玩家`200`。单位：游戏刻。

**例** `/scriptevent bs:respawnTime rejoinedPlayers 1000`：退出重进的玩家需要在50秒后方可重生。

#### `bs:invalidTeamCouldSpawnResources <可生成资源>`

控制无效队伍是否允许生成资源。无效队伍是指在开始游戏后，没有分配到队员的队伍。

- `<可生成资源>`：布尔值，默认值为`true`。

**例** `/scriptevent bs:invalidTeamCouldSpawnResources false`：禁止无效队伍生成资源。

#### `bs:randomMap <地图类型> <允许生成>`

控制特定队伍数的地图是否允许生成。

- `<地图类型>`：仅允许`allow2Teams`、`allow4Teams`、`allow8Teams`
- `<允许生成>`：布尔值，默认值均为`true`。

**例** `/scriptevent bs:randomMap allow4Teams false`：禁止4队地图生成。

#### `bs:regenerateMap <生成地图>`

立即生成地图。

- `<生成地图>`：仅允许`true`或`(地图ID)`。如果填为`true`，将随机生成一张地图；如果填为`(地图ID)`，将生成特定地图ID的地图。不允许生成在`bs:randomMap`命令中被禁用的地图。

**例** `/scriptevent bs:regenerateMap true`：立即生成一张随机地图。
`/scriptevent bs:regenerateMap lion_temple`：立即生成地图狮庙（必须在2队地图启用情况下才能生成）。

#### `bs:creativePlayerCanBreakBlocks <可破坏方块>`

控制原版玩家是否可以破坏原版方块。

- `<可破坏方块>`：布尔值，默认值为`false`。

**例** `/scriptevent bs:creativePlayerCanBreakBlocks false`：禁止创造模式玩家破坏方块。

