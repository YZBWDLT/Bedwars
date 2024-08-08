# ===== 检测游戏开始 =====

# --- 确定等待大厅位置 ---
execute unless entity @e[name=waitingHall] run summon bedwars:marker "waitingHall" 0 120 0
execute as @e[name=waitingHall,tag=!waitingHallGenerated] at @s run structure load hypixel_waiting_hall ~-12~-3~-12
execute as @e[name=waitingHall,tag=!waitingHallGenerated] at @s run tag @s add waitingHallGenerated
execute as @e[name=waitingHall] at @s run spawnpoint @a ~~~

# --- 生成随机地图 ---
scoreboard players add randomMap data 0
execute if entity @e[type=player] if score randomMap data matches 0 run scoreboard players set randomMap time 0
execute if entity @e[type=player] if score randomMap data matches 0 run scoreboard players set randomMap active 1
execute if entity @e[type=player] if score randomMap active matches !0 run function waiting/generating_map

# --- 将玩家调整为冒险模式，并将不在大厅的玩家传送回来 ---
execute if score developerMode settings matches !1 as @a at @e[name=waitingHall,family=marker] unless entity @s[x=~-12,y=~-1,z=~-12,dx=25,dy=10,dz=25] run tp @s ~~1~
execute if score developerMode settings matches !1 run gamemode adventure @a

# --- 检测玩家人数 ---
scoreboard players set playerAmount data 0
## 当生成地图结束后，开始游戏
execute if score randomMap active matches 0 as @a run scoreboard players add playerAmount data 1

# --- 防止玩家受到伤害 ---
gamerule pvp false
gamerule falldamage false
execute if score tick time matches 0 run effect @a saturation 1 10 true

# --- 当玩家人数足够后，开启倒计时 ---
## 人数不足时，停止倒计时
execute if score playerAmount data < startCountdownNeedsPlayer settings if score gameStartCountdown time matches 0.. run tellraw @a {"rawtext":[{"translate":"style.hypixel.waiting_for_more_players.message"}]}
execute if score playerAmount data < startCountdownNeedsPlayer settings if score gameStartCountdown time matches 0.. run titleraw @a title {"rawtext":[{"translate":"style.hypixel.waiting_for_more_players.title"}]}
execute if score playerAmount data < startCountdownNeedsPlayer settings if score gameStartCountdown time matches 0.. as @a at @s run playsound note.hat @s ~~~ 1 1

execute if score playerAmount data < startCountdownNeedsPlayer settings run scoreboard players set gameStartCountdown time -1

## 人数足够时，开始倒计时
execute if score playerAmount data >= startCountdownNeedsPlayer settings if score gameStartCountdown time matches -1 run scoreboard players set gameStartCountdown time 20
## 倒计时结束后，开始游戏
execute if score playerAmount data >= startCountdownNeedsPlayer settings if score tick time matches 0 if score messageStyle settings matches 0 run function style/hypixel/waiting/message
execute if score playerAmount data >= startCountdownNeedsPlayer settings if score tick time matches 0 if score titleStyle settings matches 0 run function style/hypixel/waiting/title
execute if score playerAmount data >= startCountdownNeedsPlayer settings if score tick time matches 0 if score soundStyle settings matches 0 run function style/hypixel/waiting/sound
execute if score playerAmount data >= startCountdownNeedsPlayer settings if score tick time matches 0 if score gameStartCountdown time matches 0 run function waiting/game_start

execute if score playerAmount data >= startCountdownNeedsPlayer settings if score gameStartCountdown time matches 1.. if score tick time matches 0 run scoreboard players remove gameStartCountdown time 1

