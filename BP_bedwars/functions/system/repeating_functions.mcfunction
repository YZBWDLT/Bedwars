# ===== 循环函数控制器 =====

# --- 系统函数 ---

## 时间记录器
function system/time_recorder

## 快捷栏标题控制器（伪记分板）
function system/scoreboard_controller

## 防合成系统
execute if score gameProgress data matches 0..2 run function system/anticrafting_system

## 防退出重进系统
function system/antileave_system

# --- 等待时函数 ---

## 检测玩家人数并进行倒计时，开始初始化
execute if score gameProgress data matches 0 run function waiting/hall

# --- 游戏时函数 ---

## 床检测
execute if score gameProgress data matches 1 run function gaming/bed_tester
## 死亡检测
execute if score gameProgress data matches 1 run function gaming/kill_and_death_tester
## 资源生成
execute if score gameProgress data matches 1 run function gaming/resource_spawner_controller
## 玩家交易
execute if score gameProgress data matches 1 run function gaming/trading
## 装备升级检测
execute if score gameProgress data matches 1 run function gaming/equipment_tester
## 状态效果控制器
execute if score gameProgress data matches 1 run function gaming/effect_controller
## 陷阱检测
execute if score gameProgress data matches 1 run function gaming/trap_tester
## 事件控制器
execute if score gameProgress data matches 1 run function gaming/event_controller
## 队伍相关判定
execute if score gameProgress data matches 1 run function gaming/team_tester

# --- 游戏结束函数 ---
execute if score gameProgress data matches 2 run function waiting/victory

# --- 开发者函数 ---

## 游戏模式切换器
execute if score developerMode settings matches 1 run function system/gamemode_switcher