# ===== 地图初始化 =====

# --- 地图队伍数目分配 ---
scoreboard players set maxTeamAmount data 4
scoreboard players set gameOverCondition data 3

# --- 每队的床位置与朝向、以及队员的重生位置 ---

kill @e[type=bedwars:marker]

## 总重生点
summon bedwars:marker 0 100 0 respawner

summon bedwars:marker 48 66 0 team_red
summon bedwars:marker 0 66 48 team_blue
summon bedwars:marker -48 66 0 team_green
summon bedwars:marker 0 66 -48 team_yellow

scoreboard players set redBedDirection data 0
scoreboard players set blueBedDirection data 1
scoreboard players set greenBedDirection data 2
scoreboard players set yellowBedDirection data 3

summon bedwars:marker 58 66 0 team_respawn_marker "redTeamRespawn"
summon bedwars:marker 0 66 58 team_respawn_marker "blueTeamRespawn"
summon bedwars:marker -58 66 0 team_respawn_marker "greenTeamRespawn"
summon bedwars:marker 0 66 -58 team_respawn_marker "yellowTeamRespawn"

# --- 地图资源点信息 ---
kill @e[family=resource_spawner]

summon bedwars:emerald_spawner 0 66 0
summon bedwars:emerald_spawner 0 74 0
summon bedwars:diamond_spawner -30 66 -31
summon bedwars:diamond_spawner 31 66 -30
summon bedwars:diamond_spawner 30 66 31
summon bedwars:diamond_spawner -31 66 30
summon bedwars:iron_spawner 0 66 64
summon bedwars:iron_spawner 0 66 -64
summon bedwars:iron_spawner 64 66 0
summon bedwars:iron_spawner -64 66 0
summon bedwars:gold_spawner 0 66 64
summon bedwars:gold_spawner 0 66 -64
summon bedwars:gold_spawner 64 66 0
summon bedwars:gold_spawner -64 66 0
event entity @e[family=resource_spawner] spawn_as_tier_1

# --- 商人信息 ---
kill @e[type=bedwars:trader]
summon bedwars:trader -59 66 -5 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader -57 66 -5 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader -58 66 5 team_upgrade_trader "§l§b团队升级"

summon bedwars:trader -5 66 59 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader -5 66 57 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader 5 66 58 team_upgrade_trader "§l§b团队升级"

summon bedwars:trader 59 66 5 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader 57 66 5 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader 58 66 -5 team_upgrade_trader "§l§b团队升级"

summon bedwars:trader 5 66 -59 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader 5 66 -57 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader -5 66 -58 team_upgrade_trader "§l§b团队升级"

