# ===== 游戏开始 =====

# --- 初始化地图 ---
execute if score randomMap data matches 1 run function maps/boletum/start_game
execute if score randomMap data matches 2 run function maps/carapace/start_game
execute if score randomMap data matches 3 run function maps/picnic/start_game

# --- 游戏开始的消息提醒 ---
execute if score messageStyle settings matches 0 run tellraw @a {"rawtext":[{"translate":"%%s\n%%s\n\n%%s\n\n%%s","with":{"rawtext":[{"translate":"style.hypixel.green_line"},{"translate":"style.hypixel.classic.game_start_introduce.line_1"},{"translate":"style.hypixel.classic.game_start_introduce.line_2"},{"translate":"style.hypixel.green_line"}]}}]}

# --- 分配队伍 ---
## 如果是2队模式，按2队分
execute if score maxTeamAmount data matches 2 run function lib/assign_teams/2_teams
## 如果是4队模式，按4队分
execute if score maxTeamAmount data matches 4 run function lib/assign_teams/4_teams
## 如果是8队模式，按8队分
execute if score maxTeamAmount data matches 8 run function lib/assign_teams/8_teams

# --- 设置所有队伍都是有床的 ---
scoreboard players set @e[family=bed,tag=!eliminated] haveBed 1
scoreboard players set @e[family=bed,tag=eliminated] haveBed 0

scoreboard players set @a haveBed 1
scoreboard players set @a time 0
tag @a add isAlive

# --- 设置玩家的初始商店记分板 ---
scoreboard players set @a armorLevel 1
scoreboard players set @a axeLevel 0
scoreboard players set @a pickaxeLevel 0
tag @a remove shearsUnlocked
## 魔法牛奶
scoreboard players set @a teamUpgrade 0

# --- 设置玩家初始击杀 ---
scoreboard players set @a killAmount 0
scoreboard players set @a finalKillAmount 0
scoreboard players set @a bedDestroyedAmount 0
scoreboard players set @a deathType 0

scoreboard players set @a damageType 0
scoreboard players set @a damageTypeCooldown 0

# --- 设置队伍初始升级 ---
function init/team_upgrade

# --- 为部分实体设置队伍ID和family ---
scoreboard players set @e[family=bed,family=team_red] team 1
scoreboard players set @e[family=bed,family=team_blue] team 2
scoreboard players set @e[family=bed,family=team_green] team 3
scoreboard players set @e[family=bed,family=team_yellow] team 4
scoreboard players set @e[family=bed,family=team_white] team 5
scoreboard players set @e[family=bed,family=team_pink] team 6
scoreboard players set @e[family=bed,family=team_gray] team 7
scoreboard players set @e[family=bed,family=team_cyan] team 8

# --- 设置事件倒计时 ---
scoreboard players set eventId data 0
scoreboard players set eventMinute time 6
scoreboard players set eventSecond time 0

# --- 设置所有生成点均为1级 ---
event entity @e[family=resource_spawner] spawn_as_tier_1

# --- 清除掉落物 ---
kill @e[type=item]

# --- 为商人随机分配皮肤 ---
execute as @e[family=trader] run event entity @s assign_skin_randomly

# --- 清除玩家的物品并传送玩家 ---
clear @a
execute as @a run function lib/programs/tp_players_to_respawner
give @a wooden_sword 1 0 {"item_lock": { "mode": "lock_in_inventory" }}

# --- 设置所有玩家的模式为生存模式 ---
gamemode survival @a

# --- 设置游戏进程 ---
scoreboard players set gameProgress data 1

gamerule pvp true
gamerule falldamage true

# --- 显示玩家血量 ---
scoreboard objectives setdisplay belowname health
effect @a instant_health 1 100 true

# --- 清除等待大厅 ---
fill -12 115 -12 12 126 12 air

# --- 限制游戏高度 ---
# 限制到respawner高度下方1格
execute at @e[family=respawner] positioned ~~-1~ run fill 99 ~ 99 0 ~ 0 barrier
execute at @e[family=respawner] positioned ~~-1~ run fill -99 ~ 99 0 ~ 0 barrier
execute at @e[family=respawner] positioned ~~-1~ run fill 99 ~ -99 0 ~ 0 barrier
execute at @e[family=respawner] positioned ~~-1~ run fill -99 ~ -99 0 ~ 0 barrier

# --- 将游戏结束倒计时初始化 ---
scoreboard players set resetGameCountdown time 10

# --- 设置本局游戏ID，并将所有玩家的游戏ID设置为该值 ---
scoreboard players random thisGame gameId 1 10000
execute as @a run scoreboard players operation @s gameId = thisGame gameId