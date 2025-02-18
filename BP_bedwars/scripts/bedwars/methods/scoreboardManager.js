/**
 * ===== 记分板管理器 =====
 * 基于原版 SAPI 扩展的记分板功能。
 */

import { Entity, ScoreboardIdentity, ScoreboardObjective, world } from "@minecraft/server";

/** ===== 记分项操作 ===== */

/** 尝试创建一个记分板，并获取该记分板的数据。如果记分板已存在，则直接返回其数据。
 * @description 等同于/scoreboard objectives add (id) dummy (displayName)
 * @param {String} id 记分板的 ID 。
 * @param {String} displayName 记分板的显示名称。
 */
export function tryAddScoreboard( id, displayName ) {
    try {
        let objective = world.scoreboard.addObjective( id, displayName );
        return objective;
    }
    catch ( error ) {
        return getScoreboard( id );
    }
}

/** 获取记分板数据
 * @param {String} id 记分板的 ID 。
 */
export function getScoreboard( id ) {
    return world.scoreboard.getObjective( id );
}

/** 尝试移除一个记分板，并返回是否成功执行。
 * @description 等同于/scoreboard objectives remove (id)
 * @param { ScoreboardObjective | String } id 记分板的 ID 。
 */
export function removeScoreboard( id ) {
    try {
        world.scoreboard.removeObjective( id );
        return true;
    }
    catch {
        return false;
    }
}

/** 尝试在特定位置显示记分板，并返回上一个在该位置显示的记分板数据
 * @description 等同于 /scoreboard objectives setdisplay (display) (id) (ascending|descending)
 * @param {"BelowName"|"List"|"Sidebar"} display 显示的位置。
 * @param {String} id 显示的记分板 ID 。如果为""，则清除该位置显示的记分板。
 * @param {"ascending"|"descending"} order 排列顺序。
 */
export function displayScoreboard( display, id, order = "descending" ) {
    const orderInt = ( order === "ascending" ? 0 : 1 );
    const objective = getScoreboard( id );
    try {
        if ( id === "" ) { return world.scoreboard.clearObjectiveAtDisplaySlot( display ); }
        else { return world.scoreboard.setObjectiveAtDisplaySlot( display, { objective: objective, sortOrder: orderInt } ); }
    }
    catch {
        const displayInfo = world.scoreboard.getObjectiveAtDisplaySlot( display );
        if ( displayInfo ) { return displayInfo.objective; } else { return undefined; }
    }
}

/**
 * 尝试创建记分板并直接在特定位置显示，返回创建的记分板和上一个在同样位置显示的记分板。
 * @param {String} id 记分板 ID 。
 * @param {String} displayName 记分板的显示名称。
 * @param {"BelowName"|"List"|"Sidebar"} display 显示的位置.
 * @param {"ascending"|"descending"} order 排列顺序。
 */
export function tryAddAndDisplayScoreboard( id, displayName, display, order ) {
    let newScoreboard = tryAddScoreboard( id, displayName );
    let lastDisplayed = displayScoreboard( display, id, order );
    return { newScoreboard, lastDisplayed };
}

/** 令所有记分板执行一个函数
 * @param {function(ScoreboardObjective)} func 要执行的函数
 * @param {Boolean|function(ScoreboardObjective): Boolean} condition 执行条件
 */
export function eachScoreboard( func, condition = true ) {
    world.scoreboard.getObjectives().forEach( obj => {
        if ( ( typeof condition === "function" && condition( obj ) ) || ( typeof condition === "boolean" && condition ) ) { func( obj ); }
    } );
}

/** 移除所有记分板
 * @param {Boolean|function(ScoreboardObjective): Boolean} condition 移除条件。必须返回一个布尔值。
 */
export function removeAllScoreboards( condition = true ) {
    eachScoreboard( obj => world.scoreboard.removeObjective( obj ), condition );
}

/** ===== 追踪对象操作 ===== */

/** 添加分数
 * @description 等同于/scoreboard players add (objective) (participant) (score)
 * @param {String} objective 记分项 ID
 * @param {Entity | ScoreboardIdentity | String} participant 追踪对象
 * @param {Number} score 添加的分数
 */
export function addScore( objective, participant, score ) {
    return getScoreboard( objective ).addScore( participant, score );
}

/** 设置分数
 * @description 等同于/scoreboard players set (objective) (participant) (score)
 * @param {String} objective 记分项 ID
 * @param {Entity | ScoreboardIdentity | String} participant 追踪对象
 * @param {Number} score 添加的分数
 */
export function setScore( objective, participant, score ) {
    return getScoreboard( objective ).setScore( participant, score );
}

/** 获取分数
 * @param {String} objective 记分项 ID
 * @param {Entity | ScoreboardIdentity | String} participant 追踪对象
 */
export function getScore( objective, participant ) {
    try {
        return getScoreboard( objective ).getScore( participant );
    }
    catch {
        return void 0;
    }
}

/** 获取被追踪对象的全部记分项数据
 * @description 等同于/scoreboard players list (participantName)
 * @param {String} participantName 追踪对象的名称
 */
export function getObjectiveFromParticipant( participantName ) {
    /** @type {ScoreboardObjective[]} */ let scoreboards = [];
    eachScoreboard( obj => {
        if ( obj.getScores().find( info => info.participant.displayName === participantName ) ) { scoreboards.push( obj ); }
    } )
    return scoreboards;
}
