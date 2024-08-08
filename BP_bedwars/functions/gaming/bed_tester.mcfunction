# ===== 床相关检测器 =====

# --- 无敌方时 ---
# 触发恢复床的判定
execute at @e[family=bed,family=team_red,scores={haveBed=1}] unless block ~~~ bed unless entity @a[scores={team=!1},tag=isAlive,r=6] run function gaming/teams/red/replace_bed
execute at @e[family=bed,family=team_blue,scores={haveBed=1}] unless block ~~~ bed unless entity @a[scores={team=!2},tag=isAlive,r=6] run function gaming/teams/blue/replace_bed
execute at @e[family=bed,family=team_green,scores={haveBed=1}] unless block ~~~ bed unless entity @a[scores={team=!3},tag=isAlive,r=6] run function gaming/teams/green/replace_bed
execute at @e[family=bed,family=team_yellow,scores={haveBed=1}] unless block ~~~ bed unless entity @a[scores={team=!4},tag=isAlive,r=6] run function gaming/teams/yellow/replace_bed
execute at @e[family=bed,family=team_white,scores={haveBed=1}] unless block ~~~ bed unless entity @a[scores={team=!5},tag=isAlive,r=6] run function gaming/teams/white/replace_bed
execute at @e[family=bed,family=team_pink,scores={haveBed=1}] unless block ~~~ bed unless entity @a[scores={team=!6},tag=isAlive,r=6] run function gaming/teams/pink/replace_bed
execute at @e[family=bed,family=team_gray,scores={haveBed=1}] unless block ~~~ bed unless entity @a[scores={team=!7},tag=isAlive,r=6] run function gaming/teams/gray/replace_bed
execute at @e[family=bed,family=team_cyan,scores={haveBed=1}] unless block ~~~ bed unless entity @a[scores={team=!8},tag=isAlive,r=6] run function gaming/teams/cyan/replace_bed

# --- 有敌方时 ---
# 有敌方的检测是距床6格内有敌人
execute at @e[family=bed,family=team_red,scores={haveBed=1}] unless block ~~~ bed if entity @a[scores={team=!1},tag=isAlive,r=6] run function gaming/teams/red/bed_destroyed
execute at @e[family=bed,family=team_blue,scores={haveBed=1}] unless block ~~~ bed if entity @a[scores={team=!2},tag=isAlive,r=6] run function gaming/teams/blue/bed_destroyed
execute at @e[family=bed,family=team_green,scores={haveBed=1}] unless block ~~~ bed if entity @a[scores={team=!3},tag=isAlive,r=6] run function gaming/teams/green/bed_destroyed
execute at @e[family=bed,family=team_yellow,scores={haveBed=1}] unless block ~~~ bed if entity @a[scores={team=!4},tag=isAlive,r=6] run function gaming/teams/yellow/bed_destroyed
execute at @e[family=bed,family=team_white,scores={haveBed=1}] unless block ~~~ bed if entity @a[scores={team=!5},tag=isAlive,r=6] run function gaming/teams/white/bed_destroyed
execute at @e[family=bed,family=team_pink,scores={haveBed=1}] unless block ~~~ bed if entity @a[scores={team=!6},tag=isAlive,r=6] run function gaming/teams/pink/bed_destroyed
execute at @e[family=bed,family=team_gray,scores={haveBed=1}] unless block ~~~ bed if entity @a[scores={team=!7},tag=isAlive,r=6] run function gaming/teams/gray/bed_destroyed
execute at @e[family=bed,family=team_cyan,scores={haveBed=1}] unless block ~~~ bed if entity @a[scores={team=!8},tag=isAlive,r=6] run function gaming/teams/cyan/bed_destroyed

# --- 当该队伍已被淘汰后，还有床的则清除 ---
execute at @e[family=bed,family=team_red,tag=eliminated] if block ~~~ bed run setblock ~~~ air
execute at @e[family=bed,family=team_blue,tag=eliminated] if block ~~~ bed run setblock ~~~ air
execute at @e[family=bed,family=team_green,tag=eliminated] if block ~~~ bed run setblock ~~~ air
execute at @e[family=bed,family=team_yellow,tag=eliminated] if block ~~~ bed run setblock ~~~ air
execute at @e[family=bed,family=team_white,tag=eliminated] if block ~~~ bed run setblock ~~~ air
execute at @e[family=bed,family=team_pink,tag=eliminated] if block ~~~ bed run setblock ~~~ air
execute at @e[family=bed,family=team_gray,tag=eliminated] if block ~~~ bed run setblock ~~~ air
execute at @e[family=bed,family=team_cyan,tag=eliminated] if block ~~~ bed run setblock ~~~ air
