# XXX被XXX射杀。最终击杀！
execute if entity @a[c=1,tag=killer,family=team_red] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.final_kill.be_shot","with":{"rawtext":[{"translate":"§d%%s","with":{"rawtext":[{"selector":"@s"}]}},{"translate":"§c%%s","with":{"rawtext":[{"selector":"@a[c=1,tag=killer,family=team_red]"}]}}]}}]}
execute if entity @a[c=1,tag=killer,family=team_blue] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.final_kill.be_shot","with":{"rawtext":[{"translate":"§d%%s","with":{"rawtext":[{"selector":"@s"}]}},{"translate":"§9%%s","with":{"rawtext":[{"selector":"@a[c=1,tag=killer,family=team_blue]"}]}}]}}]}
execute if entity @a[c=1,tag=killer,family=team_green] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.final_kill.be_shot","with":{"rawtext":[{"translate":"§d%%s","with":{"rawtext":[{"selector":"@s"}]}},{"translate":"§a%%s","with":{"rawtext":[{"selector":"@a[c=1,tag=killer,family=team_green]"}]}}]}}]}
execute if entity @a[c=1,tag=killer,family=team_yellow] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.final_kill.be_shot","with":{"rawtext":[{"translate":"§d%%s","with":{"rawtext":[{"selector":"@s"}]}},{"translate":"§e%%s","with":{"rawtext":[{"selector":"@a[c=1,tag=killer,family=team_yellow]"}]}}]}}]}
execute if entity @a[c=1,tag=killer,family=team_white] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.final_kill.be_shot","with":{"rawtext":[{"translate":"§d%%s","with":{"rawtext":[{"selector":"@s"}]}},{"translate":"§f%%s","with":{"rawtext":[{"selector":"@a[c=1,tag=killer,family=team_white]"}]}}]}}]}
execute if entity @a[c=1,tag=killer,family=team_gray] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.final_kill.be_shot","with":{"rawtext":[{"translate":"§d%%s","with":{"rawtext":[{"selector":"@s"}]}},{"translate":"§8%%s","with":{"rawtext":[{"selector":"@a[c=1,tag=killer,family=team_gray]"}]}}]}}]}
execute if entity @a[c=1,tag=killer,family=team_cyan] run tellraw @a {"rawtext":[{"translate":"style.hypixel.player_died_broadcast.final_kill.be_shot","with":{"rawtext":[{"translate":"§d%%s","with":{"rawtext":[{"selector":"@s"}]}},{"translate":"§b%%s","with":{"rawtext":[{"selector":"@a[c=1,tag=killer,family=team_cyan]"}]}}]}}]}
