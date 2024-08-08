# ===== 地图初始化 =====

# --- 地图队伍数目分配 ---
scoreboard players set maxTeamAmount data 4
scoreboard players set gameOverCondition data 3

# --- 每队的床位置与朝向、以及队员的重生位置 ---

kill @e[type=bedwars:marker]

## 总重生点
summon bedwars:marker 0 115 0 respawner

summon bedwars:marker 66 59 -2 team_red
summon bedwars:marker 0 59 66 team_blue
summon bedwars:marker -68 59 0 team_green
summon bedwars:marker -2 59 -68 team_yellow

scoreboard players set redBedDirection data 0
scoreboard players set blueBedDirection data 1
scoreboard players set greenBedDirection data 2
scoreboard players set yellowBedDirection data 3

summon bedwars:marker 78 58 -2 team_respawn_marker "redTeamRespawn"
summon bedwars:marker 0 58 78 team_respawn_marker "blueTeamRespawn"
summon bedwars:marker -80 58 0 team_respawn_marker "greenTeamRespawn"
summon bedwars:marker -2 58 -80 team_respawn_marker "yellowTeamRespawn"

# --- 地图资源点信息 ---
kill @e[family=resource_spawner]

summon bedwars:emerald_spawner 9 63 12
summon bedwars:emerald_spawner -11 63 -12
summon bedwars:diamond_spawner -43 59 -43
summon bedwars:diamond_spawner 43 59 -43
summon bedwars:diamond_spawner 43 59 43
summon bedwars:diamond_spawner -43 59 43
summon bedwars:iron_spawner 0 58 82
summon bedwars:iron_spawner -2 58 -84
summon bedwars:iron_spawner 82 58 -2
summon bedwars:iron_spawner -84 58 0
summon bedwars:gold_spawner 0 58 82
summon bedwars:gold_spawner -2 58 -84
summon bedwars:gold_spawner 82 58 -2
summon bedwars:gold_spawner -84 58 0
event entity @e[family=resource_spawner] spawn_as_tier_1

# --- 商人信息 ---
kill @e[type=bedwars:trader]
summon bedwars:trader -82 58 -5 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader -81 58 -5 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader -81.0 58 6 team_upgrade_trader "§l§b团队升级"

summon bedwars:trader -5 58 79 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader -5 58 80 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader 6 58 80.0 team_upgrade_trader "§l§b团队升级"

summon bedwars:trader 79 58 3 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader 80 58 3 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader 80.0 58 -8 team_upgrade_trader "§l§b团队升级"

summon bedwars:trader 3 58 -81 blocks_and_items_trader "§l§a方块与道具商店"
summon bedwars:trader 3 58 -82 weapon_and_armor_trader "§l§c武器与盔甲商店"
summon bedwars:trader -8 58 -81.0 team_upgrade_trader "§l§b团队升级"

