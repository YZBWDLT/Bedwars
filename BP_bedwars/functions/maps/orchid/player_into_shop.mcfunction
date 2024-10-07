# ===== 当玩家进入到商人区域后，则将玩家传送出去 =====

execute if entity @s[x=-59,y=71,z=-45.5,dx=2,dy=2,dz=1] run function lib/modify_data/warn_player
execute if entity @s[x=-59,y=71,z=-45.5,dx=2,dy=2,dz=1] run tp @s -58 71 -48 facing -58 71 -44

execute if entity @s[x=-59,y=71,z=44.5,dx=2,dy=2,dz=1] run function lib/modify_data/warn_player
execute if entity @s[x=-59,y=71,z=44.5,dx=2,dy=2,dz=1] run tp @s -58 71 48 facing -58 71 44

execute if entity @s[x=57,y=71,z=44.5,dx=2,dy=2,dz=1] run function lib/modify_data/warn_player
execute if entity @s[x=57,y=71,z=44.5,dx=2,dy=2,dz=1] run tp @s 58 71 48 facing 58 71 44

execute if entity @s[x=57,y=71,z=-45.5,dx=2,dy=2,dz=1] run function lib/modify_data/warn_player
execute if entity @s[x=57,y=71,z=-45.5,dx=2,dy=2,dz=1] run tp @s 58 71 -48 facing 58 71 -44

execute if entity @s[x=-55.5,y=71,z=-55,dx=1,dy=2,dz=2] run function lib/modify_data/warn_player
execute if entity @s[x=-55.5,y=71,z=-55,dx=1,dy=2,dz=2] run tp @s -58 71 -54 facing -55 71 -54

execute if entity @s[x=-55.5,y=71,z=53,dx=1,dy=2,dz=2] run function lib/modify_data/warn_player
execute if entity @s[x=-55.5,y=71,z=53,dx=1,dy=2,dz=2] run tp @s -58 71 54 facing -55 71 54

execute if entity @s[x=54.5,y=71,z=53,dx=1,dy=2,dz=2] run function lib/modify_data/warn_player
execute if entity @s[x=54.5,y=71,z=53,dx=1,dy=2,dz=2] run tp @s 58 71 54 facing 55 71 54

execute if entity @s[x=54.5,y=71,z=-55,dx=1,dy=2,dz=2] run function lib/modify_data/warn_player
execute if entity @s[x=54.5,y=71,z=-55,dx=1,dy=2,dz=2] run tp @s 58 71 -54 facing 55 71 -54

