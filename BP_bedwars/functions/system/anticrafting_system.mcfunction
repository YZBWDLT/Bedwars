# ===== 防合成系统 =====

execute as @a[hasitem={item=crafting_table}] run function lib/anticrafting/crafting_table
execute as @a[hasitem={item=stick}] run function lib/anticrafting/stick
execute as @a[hasitem={item=wooden_pressure_plate}] run function lib/anticrafting/wooden_pressure_plate
execute as @a[hasitem={item=wooden_button}] run function lib/anticrafting/wooden_button
execute as @a[hasitem={item=end_bricks}] run function lib/anticrafting/end_bricks
execute as @a[hasitem={item=carpet}] run function lib/anticrafting/carpet
function lib/anticrafting/carpet_new

execute if score tick time matches 15 as @a at @s run fill ~-5~-5~-5~5~5~5 air [] replace crafting_table
