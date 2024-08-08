# ===== 记分板查询函数 =====
# 调用此函数以查询所有记分板的值 | 仅限开发者模式下启用

## --- 未开启开发者模式时 ---
execute if score developerMode settings matches 0 run tellraw @s {"rawtext":[{"translate":"§c该功能仅限在开发者模式下使用"}]}

## --- 开启开发者模式时 ---
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"text":"下文反馈格式: (记分项).(标记名) = (值)，并反馈注释\n§b*蓝色：玩家个人数据"}]}

## === 激活数据 active ===

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== 玩家个人数据记分项 ====="}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"道具等级类"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§barmorLevel.@s = §a%%s §7# 玩家装备等级 | 0=无盔甲，1=皮革，2=锁链，3=铁套，4=钻石套","with":{"rawtext":[{"score":{"objective":"armorLevel","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§baxeLevel.@s = §a%%s §7# 玩家斧头等级 | 0=无斧头，1=木制，2=石制，3=铁制，4=钻石制","with":{"rawtext":[{"score":{"objective":"axeLevel","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bpickaxeLevel.@s = §a%%s §7# 玩家镐子等级 | 0=无盔甲，1=木制，2=铁制，3=金制，4=钻石制","with":{"rawtext":[{"score":{"objective":"pickaxeLevel","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"击杀判定类"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bdamageType.@s = §a%%s §7# 玩家的伤害类型 | 0=无攻击，2=近战攻击，3=远程攻击，5=使受到摔落伤害","with":{"rawtext":[{"score":{"objective":"damageType","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bdamageTypeCooldown.@s = §a%%s §7# 玩家的伤害冷却，当玩家在20秒后仍没有攻击其他玩家，则将伤害类型恢复为无攻击，新的攻击会重新计时，单位秒，-1=无攻击时的等待状态，0~400=在20秒内有过攻击其他玩家的行为","with":{"rawtext":[{"score":{"objective":"damageTypeCooldown","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bdeathType.@s = §a%%s §7# 玩家的死亡类型，玩家存活时该值可能也存在，值上等于攻击了自己的玩家的伤害类型 | 0=未知原因的死亡，1=自己跌入虚空，2=被击杀，3=被射杀，4=被扔下虚空，5=被扔下悬崖","with":{"rawtext":[{"score":{"objective":"deathType","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bbedDestroyedAmount.@s = §a%%s §7# 玩家的破坏床数","with":{"rawtext":[{"score":{"objective":"bedDestroyedAmount","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bfinalKillAmount.@s = §a%%s §7# 玩家的最终击杀数","with":{"rawtext":[{"score":{"objective":"finalKillAmount","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bkillAmount.@s = §a%%s §7# 玩家的击杀数","with":{"rawtext":[{"score":{"objective":"killAmount","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"生命值"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bhealth.@s = §a%%s §7# 玩家的生命值","with":{"rawtext":[{"score":{"objective":"health","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"其它数据"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bgameId.@s = §a%%s §7# 玩家当前游戏ID。用于判断是否和本局对应。","with":{"rawtext":[{"score":{"objective":"gameId","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bhaveBed.@s = §a%%s §7# 玩家是否有床 | -1=准备播放无床标题，0=无床，1=有床","with":{"rawtext":[{"score":{"objective":"haveBed","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bisOnline.@s = §a%%s §7# 玩家是否在线","with":{"rawtext":[{"score":{"objective":"isOnline","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bteam.@s = §a%%s §7# 玩家队伍数据 | 0=无队伍，1=红队，2=蓝队，3=绿队，4=黄队，5=白队，6=粉队，7=灰队，8=青队","with":{"rawtext":[{"score":{"objective":"team","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§btime.@s = §a%%s §7# 玩家重生倒计时，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"@s"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§bteamUpgrade.@s = §a%%s §7# 玩家魔法牛奶计时，单位刻","with":{"rawtext":[{"score":{"objective":"team","name":"@s"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== active记分项 ====="}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"active.randomMap = §a%%s §7# 随机地图生成是否启用，0=未启用，1=决定生成何种地图，2=确定常加载区域，3=清除原地图，4=生成新地图，5=确定队伍颜色","with":{"rawtext":[{"score":{"objective":"active","name":"randomMap"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== data记分项 ====="}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.eventId = §a%%s §7# 事件类型","with":{"rawtext":[{"score":{"objective":"data","name":"eventId"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.blueBedDirection = §a%%s §7# 蓝队床方向","with":{"rawtext":[{"score":{"objective":"data","name":"blueBedDirection"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.cyanBedDirection = §a%%s §7# 青队床方向","with":{"rawtext":[{"score":{"objective":"data","name":"cyanBedDirection"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.eliminatedTeams = §a%%s §7# 判断被淘汰的队伍数目","with":{"rawtext":[{"score":{"objective":"data","name":"eliminatedTeams"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.gameOverCondition = §a%%s §7# 游戏结束条件，当队伍淘汰数目等于此值时，游戏结束","with":{"rawtext":[{"score":{"objective":"data","name":"gameOverCondition"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.gameProgress = §a%%s §7# 游戏运行进程，0=等待中，1=选队，2=游戏中，3=游戏结束","with":{"rawtext":[{"score":{"objective":"data","name":"gameProgress"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.grayBedDirection = §a%%s §7# 灰队床方向","with":{"rawtext":[{"score":{"objective":"data","name":"grayBedDirection"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.greenBedDirection = §a%%s §7# 绿队床方向","with":{"rawtext":[{"score":{"objective":"data","name":"greenBedDirection"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.maxTeamAmount = §a%%s §7# 队伍最大数量","with":{"rawtext":[{"score":{"objective":"data","name":"maxTeamAmount"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.pinkBedDirection = §a%%s §7# 粉队床方向","with":{"rawtext":[{"score":{"objective":"data","name":"pinkBedDirection"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.playerAmount = §a%%s §7# 总玩家数","with":{"rawtext":[{"score":{"objective":"data","name":"playerAmount"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.randomMap = §a%%s §7# 随机地图ID","with":{"rawtext":[{"score":{"objective":"data","name":"randomMap"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.redBedDirection = §a%%s §7# 红队床方向","with":{"rawtext":[{"score":{"objective":"data","name":"redBedDirection"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.whiteBedDirection = §a%%s §7# 白队床方向","with":{"rawtext":[{"score":{"objective":"data","name":"whiteBedDirection"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.yellowBedDirection = §a%%s §7# 黄队床方向","with":{"rawtext":[{"score":{"objective":"data","name":"yellowBedDirection"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.teamBluePlayers = §a%%s §7# 蓝队剩余玩家","with":{"rawtext":[{"score":{"objective":"data","name":"teamBluePlayers"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.teamCyanPlayers = §a%%s §7# 青队剩余玩家","with":{"rawtext":[{"score":{"objective":"data","name":"teamCyanPlayers"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.teamGrayPlayers = §a%%s §7# 灰队剩余玩家","with":{"rawtext":[{"score":{"objective":"data","name":"teamGrayPlayers"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.teamGreenPlayers = §a%%s §7# 绿队剩余玩家","with":{"rawtext":[{"score":{"objective":"data","name":"teamGreenPlayers"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.teamPinkPlayers = §a%%s §7# 粉队剩余玩家","with":{"rawtext":[{"score":{"objective":"data","name":"teamPinkPlayers"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.teamRedPlayers = §a%%s §7# 红队剩余玩家","with":{"rawtext":[{"score":{"objective":"data","name":"teamRedPlayers"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.teamWhitePlayers = §a%%s §7# 白队剩余玩家","with":{"rawtext":[{"score":{"objective":"data","name":"teamWhitePlayers"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"data.teamYellowPlayers = §a%%s §7# 黄队剩余玩家","with":{"rawtext":[{"score":{"objective":"data","name":"teamYellowPlayers"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== gameId记分项 ====="}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"gameId.thisGame = §a%%s §7# 本局游戏ID","with":{"rawtext":[{"score":{"objective":"gameId","name":"thisGame"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== haveBed记分项 ====="}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"haveBed.@e[family=bed,family=team_blue] = §a%%s §7# 蓝队是否有床 | -1=准备播放无床标题，0=无床，1=有床","with":{"rawtext":[{"score":{"objective":"haveBed","name":"@e[family=bed,family=team_blue]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"haveBed.@e[family=bed,family=team_cyan] = §a%%s §7# 青队是否有床 | -1=准备播放无床标题，0=无床，1=有床","with":{"rawtext":[{"score":{"objective":"haveBed","name":"@e[family=bed,family=team_cyan]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"haveBed.@e[family=bed,family=team_gray] = §a%%s §7# 灰队是否有床 | -1=准备播放无床标题，0=无床，1=有床","with":{"rawtext":[{"score":{"objective":"haveBed","name":"@e[family=bed,family=team_gray]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"haveBed.@e[family=bed,family=team_green] = §a%%s §7# 绿队是否有床 | -1=准备播放无床标题，0=无床，1=有床","with":{"rawtext":[{"score":{"objective":"haveBed","name":"@e[family=bed,family=team_green]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"haveBed.@e[family=bed,family=team_pink] = §a%%s §7# 粉队是否有床 | -1=准备播放无床标题，0=无床，1=有床","with":{"rawtext":[{"score":{"objective":"haveBed","name":"@e[family=bed,family=team_pink]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"haveBed.@e[family=bed,family=team_red] = §a%%s §7# 红队是否有床 | -1=准备播放无床标题，0=无床，1=有床","with":{"rawtext":[{"score":{"objective":"haveBed","name":"@e[family=bed,family=team_red]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"haveBed.@e[family=bed,family=team_white] = §a%%s §7# 白队是否有床 | -1=准备播放无床标题，0=无床，1=有床","with":{"rawtext":[{"score":{"objective":"haveBed","name":"@e[family=bed,family=team_white]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"haveBed.@e[family=bed,family=team_yellow] = §a%%s §7# 黄队是否有床 | -1=准备播放无床标题，0=无床，1=有床","with":{"rawtext":[{"score":{"objective":"haveBed","name":"@e[family=bed,family=team_yellow]"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== settings记分项 ====="}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"settings.developerMode = §a%%s §7# 开发者模式启用情况 | 0=未启用，1=已启用","with":{"rawtext":[{"score":{"objective":"settings","name":"developerMode"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"settings.messageStyle = §a%%s §7# 床被破坏后的消息样式 | 0=Hypixel样式，1=花雨庭样式","with":{"rawtext":[{"score":{"objective":"settings","name":"messageStyle"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"settings.soundStyle = §a%%s §7# 床被破坏后的音效样式 | 0=Hypixel样式，1=花雨庭样式","with":{"rawtext":[{"score":{"objective":"settings","name":"soundStyle"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"settings.startCountdownNeedsPlayer = §a%%s §7# 开始倒计时需要的玩家数目，小于此数目时不开始游戏","with":{"rawtext":[{"score":{"objective":"settings","name":"startCountdownNeedsPlayer"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"settings.titleStyle = §a%%s §7# 床被破坏后的标题样式 | 0=Hypixel样式，1=花雨庭样式","with":{"rawtext":[{"score":{"objective":"settings","name":"titleStyle"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== teamUpgrade记分项 ====="}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§7因此处变量过多，请使用/function developer/query/team_upgrades命令查询。"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.@e[family=bed] = §a%%s §7# 对应队伍的第一个陷阱ID","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"@e[family=bed]"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== time记分项 ====="}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.@e[family=diamond_spawner] = §a%%s §7# 钻石生成点倒计时","with":{"rawtext":[{"score":{"objective":"time","name":"@e[family=diamond_spawner]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.@e[family=emerald_spawner] = §a%%s §7# 绿宝石生成点倒计时","with":{"rawtext":[{"score":{"objective":"time","name":"@e[family=emerald_spawner]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.@e[family=bed] = §a%%s §7# 对应队伍的陷阱冷却","with":{"rawtext":[{"score":{"objective":"time","name":"@e[family=bed]"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.eventMinute = §a%%s §7# 事件倒计时，单位分钟","with":{"rawtext":[{"score":{"objective":"time","name":"eventMinute"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.eventSecond = §a%%s §7# 事件倒计时，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"eventSecond"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.gameStartCountdown = §a%%s §7# 游戏开始倒计时，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"gameStartCountdown"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.randomMap = §a%%s §7# 各个阶段的计时器","with":{"rawtext":[{"score":{"objective":"time","name":"randomMap"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.resetGameCountdown = §a%%s §7# 游戏结束后，重置游戏倒计时","with":{"rawtext":[{"score":{"objective":"time","name":"resetGameCountdown"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.tick = §a%%s §7# 每20刻循环一次，用于计时，单位刻","with":{"rawtext":[{"score":{"objective":"time","name":"tick"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.trapCooldownBlue = §a%%s §7# 蓝队陷阱冷却，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"trapCooldownBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.trapCooldownCyan = §a%%s §7# 青队陷阱冷却，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"trapCooldownCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.trapCooldownGray = §a%%s §7# 灰队陷阱冷却，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"trapCooldownGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.trapCooldownGreen = §a%%s §7# 绿队陷阱冷却，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"trapCooldownGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.trapCooldownPink = §a%%s §7# 粉队陷阱冷却，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"trapCooldownPink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.trapCooldownRed = §a%%s §7# 红队陷阱冷却，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"trapCooldownRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.trapCooldownWhite = §a%%s §7# 白队陷阱冷却，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"trapCooldownWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"time.trapCooldownYellow = §a%%s §7# 黄队陷阱冷却，单位秒","with":{"rawtext":[{"score":{"objective":"time","name":"trapCooldownYellow"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== 标签类型（tag）项 ====="}]}

execute if score developerMode settings matches 1 run tellraw @s[tag=!isAlive] {"rawtext":[{"translate":"§eisAlive = §afalse §7# 玩家是否处于存活状态 | true=是，false=否"}]}
execute if score developerMode settings matches 1 run tellraw @s[tag=isAlive] {"rawtext":[{"translate":"§eisAlive = §atrue §7# 玩家是否处于存活状态 | true=是，false=否"}]}

execute if score developerMode settings matches 1 run tellraw @s[tag=!isHoldingDreamDefender] {"rawtext":[{"translate":"§eisHoldingDreamDefender = §afalse §7# 玩家是否手持梦境守护者刷怪蛋，停止手持0.5s后自动清除标签 | true=是，false=否"}]}
execute if score developerMode settings matches 1 run tellraw @s[tag=isHoldingDreamDefender] {"rawtext":[{"translate":"§eisHoldingDreamDefender = §atrue §7# 玩家是否手持梦境守护者刷怪蛋，停止手持0.5s后自动清除标签 | true=是，false=否"}]}

execute if score developerMode settings matches 1 run tellraw @s[tag=!killer] {"rawtext":[{"translate":"§ekiller = §afalse §7# 玩家是否杀死了另一位玩家 | true=是，false=否"}]}
execute if score developerMode settings matches 1 run tellraw @s[tag=killer] {"rawtext":[{"translate":"§ekiller = §atrue §7# 玩家是否杀死了另一位玩家 | true=是，false=否"}]}

execute if score developerMode settings matches 1 run tellraw @s[tag=!lastHitByPlayer] {"rawtext":[{"translate":"§elastHitByPlayer = §afalse §7# 玩家是否在20秒前受到另一个玩家的伤害 | true=是，false=否"}]}
execute if score developerMode settings matches 1 run tellraw @s[tag=lastHitByPlayer] {"rawtext":[{"translate":"§elastHitByPlayer = §atrue §7# 玩家是否在20秒前受到另一个玩家的伤害 | true=是，false=否"}]}

execute if score developerMode settings matches 1 run tellraw @s[tag=!shearsUnlocked] {"rawtext":[{"translate":"§eshearsUnlocked = §afalse §7# 玩家是否解锁了剪刀 | true=已解锁，false=未解锁"}]}
execute if score developerMode settings matches 1 run tellraw @s[tag=shearsUnlocked] {"rawtext":[{"translate":"§eshearsUnlocked = §atrue §7# 玩家是否解锁了剪刀 | true=已解锁，false=未解锁"}]}
