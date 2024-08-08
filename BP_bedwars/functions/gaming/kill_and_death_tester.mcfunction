# ===== 玩家击杀死亡检测器 =====
# 该函数用于检测玩家的击杀和死亡

# === 重生点判定 ===

# --- 将玩家的重生点设置到respawner上 ---
execute as @e[family=respawner] at @s run spawnpoint @a ~~~
execute as @e[family=respawner] at @s run fill ~-1~-1~-1~1~2~1 barrier[] hollow


# === 击杀检测 ===

# --- 伤害者的伤害判定 ---
# 和lastHitByPlayer一样，持续20秒
scoreboard players add @a[scores={damageTypeCooldown=0..400}] damageTypeCooldown 1
scoreboard players set @a[scores={damageTypeCooldown=401..}] damageType 0
scoreboard players set @a[scores={damageTypeCooldown=401..}] damageTypeCooldown -1

# --- 判断玩家的死亡类型 ---
# 玩家上一次被其他玩家攻击后会获得lastHitByPlayer标签。

## 如果上一次的攻击不是由玩家造成的，且玩家不在虚空死亡，则触发第0类死亡类型：xxx死了
execute as @a[tag=!lastHitByPlayer] at @s unless entity @s[x=~,y=0,z=~,dx=0,dy=-64,dz=0,m=!creative] run scoreboard players set @s[scores={deathType=!1}] deathType 0
## 如果上一次的攻击不是由玩家造成的，且玩家在虚空死亡，则触发第1类死亡类型：xxx失足跌入虚空
execute as @a[tag=!lastHitByPlayer] at @s if entity @s[x=~,y=0,z=~,dx=0,dy=-64,dz=0,m=!creative] run scoreboard players set @s deathType 1
## 如果上一次的攻击由玩家造成，且玩家在虚空死亡，则触发第4类死亡类型：xxx被xxx扔下虚空，同时获取击杀者
execute as @a[tag=lastHitByPlayer] at @s if entity @s[x=~,y=0,z=~,dx=0,dy=-64,dz=0,m=!creative] run scoreboard players set @s deathType 4
execute as @a[tag=lastHitByPlayer] at @s if entity @s[x=~,y=0,z=~,dx=0,dy=-64,dz=0,m=!creative] run function lib/get_data/get_void_killer
## 如果上一次的攻击由玩家造成，且玩家被正常杀死，则还需额外判断死亡类型
## 近战，类型2，xxx被xxx击杀；远程，类型3，xxx被xxx射杀；摔伤，类型5，xxx被xxx扔下悬崖
## 获取killer的攻击类型，赋值到自己身上
execute as @a[tag=lastHitByPlayer] at @s unless entity @s[x=~,y=0,z=~,dx=0,dy=-64,dz=0,m=!creative] run scoreboard players operation @s[scores={deathType=!4}] deathType = @a[c=1,tag=killer] damageType

# --- 当玩家跌入虚空后，杀死玩家 ---
execute as @a at @s if entity @s[x=~,y=0,z=~,dx=0,dy=-64,dz=0,m=!creative] run kill @s

# --- 播报死亡消息 ---
execute if score messageStyle settings matches 0 as @a[tag=isAlive] at @s if entity @e[family=respawner,r=1] run function style/hypixel/death_message

# --- 当玩家死亡后，为击杀者添加1分并播放音效 ---
## 为killer播放音效
execute as @a[tag=isAlive] at @s if entity @e[family=respawner,r=1] as @a[tag=killer] at @s run playsound random.orb @s
## 当killer杀死了有床玩家时
execute as @a[tag=isAlive,scores={haveBed=1}] at @s if entity @e[family=respawner,r=1] run scoreboard players add @a[tag=killer] killAmount 1
## 当killer杀死了无床玩家时
execute as @a[tag=isAlive,scores={haveBed=0}] at @s if entity @e[family=respawner,r=1] run scoreboard players add @a[tag=killer] finalKillAmount 1
## 移除killer标签
execute as @a[tag=isAlive] at @s if entity @e[family=respawner,r=1] run tag @a remove killer

# --- 重置死亡玩家的死亡类型 ---
execute as @a[tag=isAlive] at @s if entity @e[family=respawner,r=1] run scoreboard players set @s deathType 0



# === 重生检测 ===
# 玩家的重生点会被设定到一个家族为respawner的标记实体上
# 当玩家有床的时候，启用5秒的倒计时，改玩家为旁观模式，并在倒计时结束之后传送到自己队伍的重生点上；给予一把木剑并进行工具降级
# 当玩家无床的时候，不启用倒计时
# 玩家死亡的时候，清除自己所有的物品

# --- 玩家死亡后的判定 ---
## 先为有床的玩家加入复活倒计时，无床玩家移除倒计时
execute as @a[scores={haveBed=0},tag=isAlive] at @s if entity @e[family=respawner,r=1] run scoreboard players set @s[scores={time=!1..6}] time -1
execute as @a[scores={haveBed=1},tag=isAlive] at @s if entity @e[family=respawner,r=1] run scoreboard players set @s time 6
## 提醒无床的死亡玩家已被淘汰
execute if score messageStyle settings matches 0 as @a[scores={haveBed=0},tag=isAlive] at @s if entity @e[family=respawner,r=1] run function style/hypixel/player_eliminated
## 切换为死亡状态
execute as @a at @s if entity @e[family=respawner,r=1] run tag @s remove isAlive
## 更改游戏模式，清除死亡玩家的物品，并更改玩家的游戏模式
clear @a[tag=!isAlive,m=survival]
gamemode spectator @a[tag=!isAlive,m=survival]
## 为倒计时是正数的玩家提供倒计时，并显示倒计时标题
execute as @a[tag=!isAlive,scores={time=1..}] if score tick time matches 0 run scoreboard players remove @s time 1
execute if score tick time matches 0 as @a[tag=!isAlive] run function style/hypixel/player_died_title

# --- 当玩家倒计时归零后，令其重生 ---

## 当玩家满足以下条件后重生：
## · 倒计时归零
## · 不是正在存活的玩家
## · 不是旁观者

execute as @a[scores={time=0,team=!0},tag=!isAlive] at @s run function lib/programs/player_respawn

