# ===== 团队升级查询函数 =====
# 调用此函数以查询所有团队升级的值 | 仅限开发者模式下启用

## --- 未开启开发者模式时 ---
execute if score developerMode settings matches 0 run tellraw @s {"rawtext":[{"translate":"§c该功能仅限在开发者模式下使用"}]}

## --- 开启开发者模式时 ---

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l===== 团队升级查询函数 ====="}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l--- 锋利附魔 ---"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.sharpenedSwordsBlue = §a%%s §7# 蓝队锋利附魔团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"sharpenedSwordsBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.sharpenedSwordsCyan = §a%%s §7# 青队锋利附魔团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"sharpenedSwordsCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.sharpenedSwordsGray = §a%%s §7# 灰队锋利附魔团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"sharpenedSwordsGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.sharpenedSwordsGreen = §a%%s §7# 绿队锋利附魔团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"sharpenedSwordsGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.sharpenedSwordsPink = §a%%s §7# 粉队锋利附魔团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"sharpenedSwordsPink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.sharpenedSwordsRed = §a%%s §7# 红队锋利附魔团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"sharpenedSwordsRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.sharpenedSwordsWhite = §a%%s §7# 白队锋利附魔团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"sharpenedSwordsWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.sharpenedSwordsYellow = §a%%s §7# 黄队锋利附魔团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"sharpenedSwordsYellow"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l--- 装备强化 ---"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.reinforcedArmorBlue = §a%%s §7# 蓝队装备强化团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"reinforcedArmorBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.reinforcedArmorCyan = §a%%s §7# 青队装备强化团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"reinforcedArmorCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.reinforcedArmorGray = §a%%s §7# 灰队装备强化团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"reinforcedArmorGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.reinforcedArmorGreen = §a%%s §7# 绿队装备强化团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"reinforcedArmorGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.reinforcedArmorPink = §a%%s §7# 粉队装备强化团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"reinforcedArmorPink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.reinforcedArmorRed = §a%%s §7# 红队装备强化团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"reinforcedArmorRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.reinforcedArmorWhite = §a%%s §7# 白队装备强化团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"reinforcedArmorWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.reinforcedArmorYellow = §a%%s §7# 黄队装备强化团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"reinforcedArmorYellow"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l--- 疯狂矿工 ---"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.maniacMinerBlue = §a%%s §7# 蓝队疯狂矿工团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"maniacMinerBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.maniacMinerCyan = §a%%s §7# 青队疯狂矿工团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"maniacMinerCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.maniacMinerGray = §a%%s §7# 灰队疯狂矿工团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"maniacMinerGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.maniacMinerGreen = §a%%s §7# 绿队疯狂矿工团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"maniacMinerGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.maniacMinerPink = §a%%s §7# 粉队疯狂矿工团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"maniacMinerPink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.maniacMinerRed = §a%%s §7# 红队疯狂矿工团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"maniacMinerRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.maniacMinerWhite = §a%%s §7# 白队疯狂矿工团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"maniacMinerWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.maniacMinerYellow = §a%%s §7# 黄队疯狂矿工团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"maniacMinerYellow"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l--- 锻炉 ---"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.forgeBlue = §a%%s §7# 蓝队锻炉团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"forgeBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.forgeCyan = §a%%s §7# 青队锻炉团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"forgeCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.forgeGray = §a%%s §7# 灰队锻炉团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"forgeGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.forgeGreen = §a%%s §7# 绿队锻炉团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"forgeGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.forgePink = §a%%s §7# 粉队锻炉团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"forgePink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.forgeRed = §a%%s §7# 红队锻炉团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"forgeRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.forgeWhite = §a%%s §7# 白队锻炉团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"forgeWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.forgeYellow = §a%%s §7# 黄队锻炉团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"forgeYellow"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l--- 治愈池 ---"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.healPoolBlue = §a%%s §7# 蓝队治愈池团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"healPoolBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.healPoolCyan = §a%%s §7# 青队治愈池团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"healPoolCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.healPoolGray = §a%%s §7# 灰队治愈池团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"healPoolGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.healPoolGreen = §a%%s §7# 绿队治愈池团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"healPoolGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.healPoolPink = §a%%s §7# 粉队治愈池团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"healPoolPink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.healPoolRed = §a%%s §7# 红队治愈池团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"healPoolRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.healPoolWhite = §a%%s §7# 白队治愈池团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"healPoolWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.healPoolYellow = §a%%s §7# 黄队治愈池团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"healPoolYellow"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l--- 末影龙增益 ---"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.dragonBuffBlue = §a%%s §7# 蓝队末影龙增益团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"dragonBuffBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.dragonBuffCyan = §a%%s §7# 青队末影龙增益团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"dragonBuffCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.dragonBuffGray = §a%%s §7# 灰队末影龙增益团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"dragonBuffGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.dragonBuffGreen = §a%%s §7# 绿队末影龙增益团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"dragonBuffGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.dragonBuffPink = §a%%s §7# 粉队末影龙增益团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"dragonBuffPink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.dragonBuffRed = §a%%s §7# 红队末影龙增益团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"dragonBuffRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.dragonBuffWhite = §a%%s §7# 白队末影龙增益团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"dragonBuffWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.dragonBuffYellow = §a%%s §7# 黄队末影龙增益团队升级等级","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"dragonBuffYellow"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"§l--- 陷阱 ---"}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.firstTrapBlue = §a%%s §7# 蓝队第一个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"firstTrapBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.firstTrapCyan = §a%%s §7# 青队第一个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"firstTrapCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.firstTrapGray = §a%%s §7# 灰队第一个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"firstTrapGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.firstTrapGreen = §a%%s §7# 绿队第一个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"firstTrapGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.firstTrapPink = §a%%s §7# 粉队第一个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"firstTrapPink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.firstTrapRed = §a%%s §7# 红队第一个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"firstTrapRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.firstTrapWhite = §a%%s §7# 白队第一个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"firstTrapWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.firstTrapYellow = §a%%s §7# 黄队第一个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"firstTrapYellow"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.secondTrapBlue = §a%%s §7# 蓝队第二个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"secondTrapBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.secondTrapCyan = §a%%s §7# 青队第二个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"secondTrapCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.secondTrapGray = §a%%s §7# 灰队第二个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"secondTrapGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.secondTrapGreen = §a%%s §7# 绿队第二个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"secondTrapGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.secondTrapPink = §a%%s §7# 粉队第二个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"secondTrapPink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.secondTrapRed = §a%%s §7# 红队第二个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"secondTrapRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.secondTrapWhite = §a%%s §7# 白队第二个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"secondTrapWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.secondTrapYellow = §a%%s §7# 黄队第二个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"secondTrapYellow"}}]}}]}

execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.thirdTrapBlue = §a%%s §7# 蓝队第三个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"thirdTrapBlue"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.thirdTrapCyan = §a%%s §7# 青队第三个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"thirdTrapCyan"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.thirdTrapGray = §a%%s §7# 灰队第三个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"thirdTrapGray"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.thirdTrapGreen = §a%%s §7# 绿队第三个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"thirdTrapGreen"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.thirdTrapPink = §a%%s §7# 粉队第三个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"thirdTrapPink"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.thirdTrapRed = §a%%s §7# 红队第三个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"thirdTrapRed"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.thirdTrapWhite = §a%%s §7# 白队第三个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"thirdTrapWhite"}}]}}]}
execute if score developerMode settings matches 1 run tellraw @s {"rawtext":[{"translate":"teamUpgrade.thirdTrapYellow = §a%%s §7# 黄队第三个陷阱 | 0=无陷阱，1=这是个陷阱，2=反击陷阱，3=报警陷阱，4=挖掘疲劳陷阱","with":{"rawtext":[{"score":{"objective":"teamUpgrade","name":"thirdTrapYellow"}}]}}]}
