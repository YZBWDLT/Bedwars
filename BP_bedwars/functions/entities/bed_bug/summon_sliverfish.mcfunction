# ===== 床虱击中后生成蠹虫 =====

# --- 召唤蠹虫 ---
execute if entity @s[family=team_red] run summon silverfish ~~0.5~ team_red "§c红队§f的蠹虫"
execute if entity @s[family=team_blue] run summon silverfish ~~0.5~ team_blue "§9蓝队§f的蠹虫"
execute if entity @s[family=team_green] run summon silverfish ~~0.5~ team_green "§a绿队§f的蠹虫"
execute if entity @s[family=team_yellow] run summon silverfish ~~0.5~ team_yellow "§e黄队§f的蠹虫"
execute if entity @s[family=team_white] run summon silverfish ~~0.5~ team_white "§f白队§f的蠹虫"
execute if entity @s[family=team_pink] run summon silverfish ~~0.5~ team_pink "§d粉队§f的蠹虫"
execute if entity @s[family=team_gray] run summon silverfish ~~0.5~ team_gray "§8灰队§f的蠹虫"
execute if entity @s[family=team_cyan] run summon silverfish ~~0.5~ team_cyan "§b青队§f的蠹虫"

# --- 清除自身 ---
kill @s