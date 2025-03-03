/**
 * ===== 游戏前逻辑 =====
 * 【经典模式】
 * 本函数主要用于：
 * · 在开始游戏前，清除并重新加载地图；
 * · 等待玩家，在玩家人数足够后进行倒计时，倒计时结束后开启游戏；
 * · 调整玩家的状态。
 */

import { map } from "../../methods/bedwarsMaps";
import { settings, settingsRecover } from "../../methods/bedwarsSettings";
import { tickToSecond } from "../../methods/time";
import { getPlayerAmount, showTitle, eachPlayer, setPlayerGamemode } from "../../methods/playerManager";
import { overworld, Vector } from "../../methods/positionManager";
import { eachTeam } from "../../methods/bedwarsTeam";
import { giveItem, hasItem } from "../../methods/itemManager";

/** 在玩家集体在大厅等待时所执行的事件
 * @description 非创造或冒险模式的玩家，需要调整游戏模式。禁止玩家跑出去。
 * @description 在等待过程中，首先需要重置地图，这需要先清空地图，再加载，再给各个队伍岛屿上色。然后进入等待状态。
 * @description 当玩家人数达到所设定的人数后（默认为 2），则启动倒计时。如果有玩家退出导致等待人数不足，则停止倒计时。
 */
export function waiting() {

    if ( map() ) {

        /** 地图加载信息 */
        let loadInfo = map().loadInfo;

        eachPlayer( player => {

            // 将出界的非创造模式玩家传送回来
            if ( player.getGameMode() !== "creative" && player.runCommand( `execute if entity @s[x=-12,y=119,z=-12,dx=25,dy=10,dz=25]` ).successCount === 0 ) {
                player.teleport( new Vector( 0, 121, 0 ) );
            }

            // 将非创造模式的玩家改为冒险模式
            setPlayerGamemode( player, "adventure" );

            // 给予创造模式玩家一个设置（当该玩家没有设置的时候）
            if ( player.getGameMode() === "creative" && !hasItem( player, "bedwars:map_settings" ) ) {
                giveItem( player, "bedwars:map_settings" );
            }
            // 若自主选队启用，则给予所有玩家该设置
            if ( settings.beforeGaming.teamAssign.playerSelectEnabled && !hasItem( player, "bedwars:select_team" ) ) {
                giveItem( player, "bedwars:select_team", { itemLock: "inventory" } );
            }
            // 若击杀样式启用，则给予所有玩家该设置
            if ( settings.gaming.killStyle.isEnabled && !settings.gaming.killStyle.randomKillStyle && !hasItem( player, "bedwars:kill_style" ) ) {
                giveItem( player, "bedwars:kill_style", { itemLock: "inventory" } );
            }

        } )

        // 加载阶段下，重新加载地图
        if ( loadInfo.isLoading ) {

            /** 下一个阶段的加载逻辑 @param {Boolean} condition 加载条件 @param {function()} func 执行的函数 */
            let nextStage = ( condition, func ) => { if ( condition ) { loadInfo.loadStage++; func(); } }

            /** 清除前的准备工作 */
            if ( loadInfo.loadStage === 0 ) {
                settingsRecover();
                if ( settings.beforeGaming.reload.clearSpeed === 0 ) { loadInfo.mapClear.timeCostPerLayer *= 1.75; }
                else if ( settings.beforeGaming.reload.clearSpeed === 1 ) { loadInfo.mapClear.timeCostPerLayer *= 1.50; }
                else if ( settings.beforeGaming.reload.clearSpeed === 2 ) { loadInfo.mapClear.timeCostPerLayer *= 1.25; }
                else if ( settings.beforeGaming.reload.clearSpeed === 4 ) { loadInfo.mapClear.timeCostPerLayer *= 0.75; }
                else if ( settings.beforeGaming.reload.clearSpeed === 5 ) { loadInfo.mapClear.timeCostPerLayer *= 0.50; }
                else if ( settings.beforeGaming.reload.clearSpeed === 6 ) { loadInfo.mapClear.timeCostPerLayer *= 0.25; }
                loadInfo.mapClear.timeCostPerLayer = Math.ceil( loadInfo.mapClear.timeCostPerLayer );
                loadInfo.mapClear.countdown = loadInfo.mapClear.timeCostPerLayer * loadInfo.mapClear.currentLayer;
                nextStage( true, () => { } );
            }

            /** 清除原场景 */
            else if ( loadInfo.loadStage === 1 ) {
                loadInfo.mapClear.countdown--;
                if ( loadInfo.mapClear.countdown % loadInfo.mapClear.timeCostPerLayer === 0 ) {
                    loadInfo.mapClear.clear();
                }
                nextStage(
                    loadInfo.mapClear.countdown <= 0,
                    () => {
                        if ( settings.beforeGaming.reload.loadSpeed === 0 ) { loadInfo.mapReload.totalTime *= 1.75; }
                        else if ( settings.beforeGaming.reload.loadSpeed === 1 ) { loadInfo.mapReload.totalTime *= 1.50; }
                        else if ( settings.beforeGaming.reload.loadSpeed === 2 ) { loadInfo.mapReload.totalTime *= 1.25; }
                        else if ( settings.beforeGaming.reload.loadSpeed === 4 ) { loadInfo.mapReload.totalTime *= 0.75; }
                        else if ( settings.beforeGaming.reload.loadSpeed === 5 ) { loadInfo.mapReload.totalTime *= 0.50; }
                        else if ( settings.beforeGaming.reload.loadSpeed === 6 ) { loadInfo.mapReload.totalTime *= 0.25; }
                        loadInfo.mapReload.countdown = loadInfo.mapReload.totalTime;
                        loadInfo.mapReload.loadBorder();
                        loadInfo.mapReload.loadStructure();
                    }
                );
            }

            /** 加载结构时 */
            else if ( loadInfo.loadStage === 2 ) {
                loadInfo.mapReload.countdown--;
                nextStage(
                    loadInfo.mapReload.countdown === 0,
                    () => {
                        if ( loadInfo.teamIslandColor.isEnabled ) { loadInfo.teamIslandColor.load(); };
                        eachTeam( team => { team.setBed() } );
                        overworld.getEntities().filter( entity => { return entity.typeId !== "minecraft:player" } ).forEach( entity => { entity.remove() } );
                    }
                );
            }

            /** 设置队伍岛屿颜色与床等待时 */
            else if ( loadInfo.loadStage === 3 ) {
                loadInfo.teamIslandColor.countdown--;
                nextStage(
                    loadInfo.teamIslandColor.countdown === 0,
                    () => {
                        loadInfo.isLoading = false;
                        map().gameStartCountdown = settings.beforeGaming.waiting.gameStartWaitingTime;
                    }
                )
            }


        }

        // 加载地图结束后，等待时
        else {

            // 大于规定的人数时，开始倒计时
            if ( getPlayerAmount() >= settings.beforeGaming.waiting.minPlayerCount ) {

                // 倒计时
                map().gameStartCountdown--;

                // 提醒玩家还有多长时间开始游戏
                eachPlayer( player => {

                    if ( map().gameStartCountdown === 399 ) {
                        player.sendMessage( { translate: "message.gameStart", with: [ `20` ] } );
                        player.playSound( "note.hat", { location: player.location } );
                    }
                    else if ( map().gameStartCountdown === 199 ) {
                        player.sendMessage( { translate: "message.gameStart", with: [ `§610` ] } );
                        showTitle( player, `§a10`, "", { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 } );
                        player.playSound( "note.hat", { location: player.location } );
                    }
                    else if ( map().gameStartCountdown < 100 && map().gameStartCountdown % 20 === 19 ) {
                        player.sendMessage( { translate: "message.gameStart", with: [ `§c${tickToSecond( map().gameStartCountdown )}` ] } );
                        showTitle( player, `§c${tickToSecond( map().gameStartCountdown )}`, "", { fadeInDuration: 0, stayDuration: 20, fadeOutDuration: 0 } );
                        player.playSound( "note.hat", { location: player.location } );
                    }

                } );

                // 倒计时结束后，开始游戏
                if ( map().gameStartCountdown <= 0 ) {
                    map().gameStart();
                };

            }

            // 人数不足时，且已经开始倒计时，则取消倒计时
            else if ( map().gameStartCountdown < settings.beforeGaming.waiting.gameStartWaitingTime ) {

                // 重置倒计时
                map().gameStartCountdown = settings.beforeGaming.waiting.gameStartWaitingTime;

                // 提醒玩家倒计时已取消
                eachPlayer( player => {
                    player.sendMessage( { translate: "message.needsMorePlayer" } );
                    showTitle( player, { translate: "title.needsMorePlayer" }, "", { fadeInDuration: 0, stayDuration: 40, fadeOutDuration: 0 } );
                    player.playSound( "note.hat", { location: player.location } );
                } );

            }

        }

    }

}
