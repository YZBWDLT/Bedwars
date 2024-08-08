# ===== 数据重置 =====

# --- 记分板 ---

## 玩家个人数据
scoreboard objectives remove armorLevel
scoreboard objectives remove axeLevel
scoreboard objectives remove pickaxeLevel
scoreboard objectives remove deathType
scoreboard objectives remove damageType
scoreboard objectives remove damageTypeCooldown
scoreboard objectives remove killAmount
scoreboard objectives remove finalKillAmount
scoreboard objectives remove bedDestroyedAmount
scoreboard objectives remove health
scoreboard objectives remove winTimes
scoreboard objectives remove gameId
scoreboard objectives remove isOnline

scoreboard objectives add armorLevel dummy "盔甲等级数据"
scoreboard objectives add axeLevel dummy "斧子等级数据"
scoreboard objectives add pickaxeLevel dummy "镐子等级数据"
scoreboard objectives add deathType dummy "死亡类型数据"
scoreboard objectives add damageType dummy "死亡类型数据"
scoreboard objectives add damageTypeCooldown dummy "死亡类型冷却"
scoreboard objectives add killAmount dummy "击杀数"
scoreboard objectives add finalKillAmount dummy "最终击杀数"
scoreboard objectives add bedDestroyedAmount dummy "床破坏数"
scoreboard objectives add health dummy "§c❤"
scoreboard objectives add winTimes dummy "胜利次数"
scoreboard objectives add gameId dummy "游戏ID"
scoreboard objectives add isOnline dummy "在线数据"

scoreboard players set @a armorLevel 1
scoreboard players set @a axeLevel 0
scoreboard players set @a pickaxeLevel 0
scoreboard players set @a deathType 0
scoreboard players set @a damageType 0
scoreboard players set @a damageTypeCooldown -1
scoreboard players set @a deathType 0
scoreboard players set @a killAmount 0
scoreboard players set @a finalKillAmount 0
scoreboard players set @a bedDestroyedAmount 0
scoreboard players set @a gameId 0
scoreboard players set @a isOnline 1

tag @a add isAlive

## active
scoreboard objectives remove active
scoreboard objectives add active dummy "激活数据"

## data
scoreboard objectives remove data
scoreboard objectives add data dummy "基础数据"

## haveBed
scoreboard objectives remove haveBed
scoreboard objectives add haveBed dummy "床数据"

## settings
scoreboard objectives remove settings
scoreboard objectives add settings dummy "设置数据"

## team
scoreboard objectives remove team
scoreboard objectives add team dummy "队伍数据"

## teamUpgrade
scoreboard objectives remove teamUpgrade
scoreboard objectives add teamUpgrade dummy "团队升级数据"

## temp
scoreboard objectives remove temp
scoreboard objectives add temp dummy "临时数据"

## temp2
scoreboard objectives remove temp2
scoreboard objectives add temp2 dummy "临时数据2"

## temp3
scoreboard objectives remove temp3
scoreboard objectives add temp3 dummy "临时数据3"

## time
scoreboard objectives remove time
scoreboard objectives add time dummy "时间数据"

# --- 变量数据 ---

## active.randomMap & data.randomMap
scoreboard players set randomMap active 1
scoreboard players set randomMap data 0

## teamUpgrade.@s
scoreboard players set @a teamUpgrade 0

## data.~BedDirection
scoreboard players set redBedDirection data 0
scoreboard players set blueBedDirection data 0
scoreboard players set greenBedDirection data 0
scoreboard players set yellowBedDirection data 0
scoreboard players set whiteBedDirection data 0
scoreboard players set pinkBedDirection data 0
scoreboard players set grayBedDirection data 0
scoreboard players set cyanBedDirection data 0

## data.gameProgress
scoreboard players set gameProgress data 0

## haveBed.@s
scoreboard players set @a haveBed 1

## haveBed.team~
scoreboard players set @e[family=bed,family=team_red] haveBed 1
scoreboard players set @e[family=bed,family=team_blue] haveBed 1
scoreboard players set @e[family=bed,family=team_green] haveBed 1
scoreboard players set @e[family=bed,family=team_yellow] haveBed 1
scoreboard players set @e[family=bed,family=team_white] haveBed 1
scoreboard players set @e[family=bed,family=team_pink] haveBed 1
scoreboard players set @e[family=bed,family=team_gray] haveBed 1
scoreboard players set @e[family=bed,family=team_cyan] haveBed 1

## settings.developerMode
scoreboard players set developerMode settings 0
## settings.~Style
scoreboard players set messageStyle settings 0
scoreboard players set soundStyle settings 0
scoreboard players set titleStyle settings 0
scoreboard players set startCountdownNeedsPlayer settings 2

## team.@s
scoreboard players set @a team 0

## time.tick
scoreboard players set tick time 0

## time.@s
scoreboard players set @a time 0

## time.gameStartCountdown
scoreboard players set gameStartCountdown time -1

## gameId.thisGame
scoreboard players set thisGame gameId 0
