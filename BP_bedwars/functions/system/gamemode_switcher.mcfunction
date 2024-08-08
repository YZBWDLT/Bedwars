# ===== 游戏模式切换器 =====
# 仅供开发者模式下使用

# --- 给予末影珍珠和下界砖 ---
replaceitem entity @a[hasitem={item=netherbrick,quantity=0}] slot.inventory 1 minecraft:netherbrick
replaceitem entity @a[hasitem={item=ender_pearl,quantity=0}] slot.inventory 0 minecraft:ender_pearl

# --- 切换模式 ---
## 生存模式
tellraw @a[m=!survival,hasitem={item=netherbrick,location=slot.weapon.mainhand}] {"rawtext":[{"translate":"system.gamemode_switcher.turn_to_creative"}]}
gamemode survival @a[m=!survival,hasitem={item=netherbrick,location=slot.weapon.mainhand}]
replaceitem entity @a[hasitem={item=netherbrick,location=slot.weapon.mainhand}] slot.weapon.mainhand 0 air

## 旁观模式
tellraw @a[m=!spectator,hasitem={item=ender_pearl,location=slot.weapon.mainhand}] {"rawtext":[{"translate":"system.gamemode_switcher.turn_to_creative"}]}
gamemode spectator @a[m=!spectator,hasitem={item=ender_pearl,location=slot.weapon.mainhand}]
replaceitem entity @a[hasitem={item=ender_pearl,location=slot.weapon.mainhand}] slot.weapon.mainhand 0 air

## 创造模式
gamemode creative @a[m=spectator,rx=-85,rxm=-90]