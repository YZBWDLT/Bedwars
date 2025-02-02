/** 所有设置 */

import { ScriptEventCommandMessageAfterEvent } from "@minecraft/server"
import { regenerateMap, validMapsFor2Teams, validMapsFor4Teams, validMapsFor8Teams, validMapsForCaptureMode } from "./bedwarsMaps"
import { map } from "./bedwarsMaps"

/** 可用设置列表 */
export const settings = {
    minWaitingPlayers: 2,
    gameStartWaitingTime: 400,
    resourceMaxSpawnTimes: { iron: 72, gold: 7, diamond: 8, emerald: 4 },
    respawnTime: { normalPlayers: 110, rejoinedPlayers: 200 },
    invalidTeamCouldSpawnResources: true,
    randomMap:{ allow2Teams: true, allow4Teams: true, allow8Teams: true },
    creativePlayerCanBreakBlocks: false,
    /** 地图范围（正方形的半长边） */ mapRange: 105
}

/**
 * 【事件类】游戏手动设置功能 <lang>
 * @param {ScriptEventCommandMessageAfterEvent} event
 */
export function settingsEvent( event ) {

    let acceptableIds = [
        "bs:minWaitingPlayers",
        "bs:gameStartWaitingTime",
        "bs:resourceMaxSpawnTimes",
        "bs:respawnTime",
        "bs:invalidTeamCouldSpawnResources",
        "bs:randomMap",
        "bs:regenerateMap",
        "bs:creativePlayerCanBreakBlocks"
    ]

    /**
     * 判断执行命令的执行者是否为玩家，并发送给执行者执行消息
     * @param { String | import("@minecraft/server").RawMessage } message
     */
    let sendFeedback = ( message ) => {
        if ( event.sourceType === "Entity" && event.sourceEntity.typeId === "minecraft:player" ) { event.sourceEntity.sendMessage( message ) }
    }

    /**
     * 当命令的参数未给定时，按照特定的格式返回帮助信息和当前值
     * @param {{name:String,typeName:String}[]} pars 参数信息
     * @param {String} description 本命令的描述
     * @param {String|Number|Boolean} currentValue 显示的返回值
     */
    let cmdDescription = (pars, description, currentValue) => {
        const parStrings = pars.map(par => `<${par.name}：${par.typeName}>`).join(' ');
        return `§e${event.id} ${parStrings}§f\n${description}\n§7当前值： ${currentValue}`;
    };

    /**
     * 判断输入的参数是否为布尔值，如果是则执行func函数，否则报错
     * @param {String} par 输入的参数
     * @param {String} parName 输入的参数名称
     * @param {function(Boolean):void} func 执行的回调函数，参数1：输入的布尔值对应的布尔值
     */
    let booleanPar = ( par, parName, func ) => {
        if ( par !== "true" && par !== "false" ) { sendFeedback( `§c解析 <${parName}> 参数时出现了问题，该参数只接受布尔值true或false。` ); }
        else if ( par === "true" ) { func( true ) }
        else { func( false ) }
    }

    /**
     * 判断输入的参数是否为整数，如果是则执行func函数，否则报错
     * @param {Number} par 输入的参数，需转换为数字
     * @param {String} parName 输入的参数名称
     * @param {function(Number):void} func 执行的回调函数，参数1：输入的参数
     */
    let intPar = ( par, parName, func, min = 1 ) => {
        if ( !Number.isInteger( par ) ) { sendFeedback( `§c解析 <${parName}> 参数时出现了问题，该参数只接受整数。` ); }
        else if ( par < min ) { sendFeedback( `§c解析 <${parName}> 参数时出现了问题，该参数不允许小于 ${min} 的值。` ); }
        else ( func( par ) )
    }

    /**
     * 判断输入的参数是否在所给列表之中，如果是则执行func函数，否则报错
     * @param {String} par 输入的参数
     * @param {String} parName 输入的参数名称
     * @param {String[]} enumArray 允许的参数
     * @param {function(String):void} func 执行的回调函数，参数1：输入的参数
     */
    let enumPar = ( par, parName, enumArray, func ) => {
        if ( !enumArray.includes(par) ) { sendFeedback( `§c解析 <${parName}> 参数时出现了问题，该参数只接受以下值：${enumArray.join(",")}。` ); }
        else ( func( par ) )
    }

    /**
     * 判断输入的参数是否在所给列表之中，如果是则执行func函数，否则报错
     * @param {function():void} emptyParLogic 当输入参数为空时，执行的回调函数
     * @param {function():void} logic 当输入参数不为空时，执行的回调函数
     */
    let commandLogic = ( emptyParLogic, logic ) => {
        if ( event.message === "" ) {
            emptyParLogic();
        }
        else {
            logic();
        }
    }

    /** 仅限玩家手动执行命令时执行 */
    if ( acceptableIds.includes( event.id ) ) {
        let par1Name = ""; let par2Name = "";
        let enum1Array = [];
        switch ( event.id ) {
            case "bs:minWaitingPlayers":
                par1Name = "玩家人数";
                commandLogic(
                    () => sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: "整数" } ],
                        "该值用于控制至少需要多少玩家才可开始游戏。",
                        `§a${settings.minWaitingPlayers}`
                    ) ),
                    () => intPar( Number( event.message ), par1Name, par1 => {
                        sendFeedback( `开始游戏需求的玩家人数已更改为${par1}` );
                        settings.minWaitingPlayers = par1;
                    }, 2 )
                );
                break;
            case "bs:gameStartWaitingTime":
                par1Name = "时间";
                commandLogic(
                    () => sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: "整数" } ],
                        "该值用于控制玩家达到规定数目后，多久后开始游戏。单位：游戏刻。",
                        `§a${settings.gameStartWaitingTime}`
                    ) ),
                    () => intPar( Number( event.message ), par1Name, par1 => {
                        sendFeedback( `开始游戏的等待时间已更改为${par1}` );
                        settings.gameStartWaitingTime = par1;
                        map().gameStartCountdown = par1;
                    } )
                );
                break;
            case "bs:resourceMaxSpawnTimes":
                par1Name = "资源类型"; enum1Array = [ "iron", "gold", "diamond", "emerald" ];
                par2Name = "最大生成数";
                commandLogic(
                    () => sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: enum1Array.join( " | " ) }, { name: par2Name, typeName: "整数" } ],
                        "该值用于控制游戏中的资源点最多允许生成的数目。",
                        `\n§7iron = §a${settings.resourceMaxSpawnTimes.iron}\n§7gold = §a${settings.resourceMaxSpawnTimes.gold}\n§7diamond = §a${settings.resourceMaxSpawnTimes.diamond}\n§7emerald = §a${settings.resourceMaxSpawnTimes.emerald}`
                    ) ),
                    () => enumPar( event.message.split(" ")[0], par1Name, enum1Array, par1 => {
                        intPar( Number(event.message.split(" ")[1]), par2Name, par2 => {
                            sendFeedback( `${par1}的最大生成数已更改为${par2}` );
                            settings.resourceMaxSpawnTimes[par1] = par2;
                        } )
                    } )
                );
                break;
            case "bs:respawnTime":
                par1Name = "玩家类型"; enum1Array = [ "normalPlayers", "rejoinedPlayers" ];
                par2Name = "重生时长"
                commandLogic(
                    () => sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: enum1Array.join( " | " ) }, { name: par2Name, typeName: "整数" } ],
                        "该值用于控制游戏中的玩家重生所需要的时长。单位：游戏刻。",
                        `\n§7normalPlayers = §a${settings.respawnTime.normalPlayers}\n§7rejoinedPlayers = §a${settings.respawnTime.rejoinedPlayers}`
                    ) ),
                    () => enumPar( event.message.split(" ")[0], par1Name, enum1Array, par1 => {
                        intPar( Number(event.message.split(" ")[1]), "重生时长", par2 => {
                            sendFeedback( `${par1}类型玩家的重生时长已更改为${par2}游戏刻` );
                            settings.respawnTime[par1] = par2;
                        } )
                    } )
                );
                break;
            case "bs:invalidTeamCouldSpawnResources":
                par1Name = "可生成资源"
                commandLogic(
                    () => sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: "布尔值" } ],
                        "该值用于控制游戏中没有分配到玩家的无效队伍是否能够生成资源。",
                        `§a${settings.invalidTeamCouldSpawnResources}`
                    ) ),
                    () => booleanPar( event.message, "可生成资源", par1 => {
                        sendFeedback( `无效队伍生成资源的权限已更改为${par1}` );
                        settings.invalidTeamCouldSpawnResources = par1
                    } )
                );
                break;
            case "bs:randomMap":
                par1Name = "地图类型", enum1Array = [ "allow2Teams", "allow4Teams", "allow8Teams" ]
                par2Name = "允许生成"
                commandLogic(
                    () => sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: enum1Array.join( " | " ) }, { name: par2Name, typeName: "布尔值" } ],
                        "控制游戏中何种类型的地图允许生成。",
                        `\n§7allow2Teams = §a${settings.randomMap.allow2Teams}\n§7allow4Teams = §a${settings.randomMap.allow4Teams}\n§7allow8Teams = §a${settings.randomMap.allow8Teams}`
                    ) ),
                    () => enumPar( event.message.split(" ")[0], par1Name, enum1Array, par1 => {
                        booleanPar( event.message.split(" ")[1], par2Name, par2 => {
                            sendFeedback( `${par1}的允许生成状态已更改为${par2}` );
                            settings.randomMap[par1] = par2;
                        } )
                    } )
                );
                break;
            case "bs:regenerateMap":
                let mapList = [];
                if ( settings.randomMap.allow2Teams === true ) { mapList = mapList.concat(validMapsFor2Teams).concat(validMapsForCaptureMode); }
                if ( settings.randomMap.allow4Teams === true ) { mapList = mapList.concat(validMapsFor4Teams); }
                if ( settings.randomMap.allow8Teams === true ) { mapList = mapList.concat(validMapsFor8Teams); }

                par1Name = "生成地图"; enum1Array = enum1Array.concat( "true", mapList )

                commandLogic(
                    () => sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: enum1Array.join( " | " ) } ],
                        "立即生成地图。如果填写为true，则生成一张随机地图。\n生成的地图必须满足地图的生成条件，例如当2队地图禁用时，将不允许生成2队地图。",
                        `---`
                    ) ),
                    () => enumPar( event.message, par1Name, enum1Array, par1 => {
                        if ( par1 === "true" ) {
                            regenerateMap();
                            sendFeedback( `即将生成一张随机地图。` );
                        }
                        else {
                            regenerateMap( par1 );
                            sendFeedback( `即将生成地图${par1}。` );
                        }
                    } )
                );
                break;
            case "bs:creativePlayerCanBreakBlocks":
                par1Name = "可破坏方块"
                commandLogic(
                    () => sendFeedback( cmdDescription(
                        [ { name: par1Name, typeName: "布尔值" } ],
                        "该值用于控制游戏中创造模式玩家是否能够破坏原版方块。",
                        `§a${settings.creativePlayerCanBreakBlocks}`
                    ) ),
                    () => booleanPar( event.message, "可生成资源", par1 => {
                        sendFeedback( `创造模式玩家破坏方块的权限已更改为${par1}` );
                        settings.creativePlayerCanBreakBlocks = par1
                    } )
                );
                break;
        }

    } else {
        sendFeedback( `§c检测到不允许的设置项。允许的设置项包括：\n${acceptableIds.join("\n")}` )
    }
}
