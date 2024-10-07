# ===== 警告玩家禁止进入商店区域 =====

playsound mob.shulker.teleport @s ~~~ 1 0.5
tellraw @s { "rawtext": [ { "translate": "message.areaNotAllowed" } ] }
