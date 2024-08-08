# ===== 地图初始化 =====

# --- 地图队伍数目分配 ---
scoreboard players set maxTeamAmount data 2
scoreboard players set gameOverCondition data 1

# --- 每队的床位置与朝向、以及队员的重生位置 ---

kill @e[type=bedwars:marker]

## 总重生点
summon bedwars:marker 0 110 0 respawner

summon bedwars:marker 0 65 61 team_red
summon bedwars:marker 0 65 -62 team_blue

scoreboard players set redBedDirection data 1
scoreboard players set blueBedDirection data 3

summon bedwars:marker 0 64 73 team_respawn_marker "redTeamRespawn"
summon bedwars:marker 0 64 -74 team_respawn_marker "blueTeamRespawn"

# --- 地图资源点信息 ---
kill @e[family=resource_spawner]

summon bedwars:emerald_spawner 8 69 12
summon bedwars:emerald_spawner -7 69 -11
summon bedwars:diamond_spawner 48 64 10
summon bedwars:diamond_spawner -48 64 -11
summon bedwars:iron_spawner 0 64 77
summon bedwars:iron_spawner 0 64 -78
summon bedwars:gold_spawner 0 64 77
summon bedwars:gold_spawner 0 64 -78
event entity @e[family=resource_spawner] spawn_as_tier_1

# --- 商人信息 ---
kill @e[type=bedwars:trader]
summon bedwars:trader -6 64 75 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader -6 64 74 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader  6 64 75.0 team_upgrade_trader "§l§b团队升级"

summon bedwars:trader 6 64 -76 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader 6 64 -75 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader -6 64 -75.0 team_upgrade_trader "§l§b团队升级"

