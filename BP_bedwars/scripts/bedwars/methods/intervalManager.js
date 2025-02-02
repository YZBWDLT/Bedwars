/** 循环执行函数管理器 */

import { system } from "@minecraft/server";

/** 全部的循环函数列表 @type { { [id:String]:{numberId: Number,tags: String[]} } } */
let intervals = {};

/** 创建新的循环函数
 * @param {String} id 循环函数 ID
 * @param {function()} func 要执行的函数
 * @param {String[]} tags 循环函数的标签
 * @param {Number} tick 执行间隔
 */
export function createInterval( id, func, tags=[], tick=1 ) {

    /** 如果循环函数在所有列表中已经存在，则阻止之 */
    if ( intervals[id] ) { return; }

    /** 新增循环函数执行任务 */
    let numberId = system.runInterval( () => func(), tick );

    /** 使循环函数的标签默认添加 ID */
    tags.push( id );

    /** 新增新的循环函数 */
    intervals[id] = { numberId, tags }

}

/** 删除特定 ID 的循环函数
 * @param {...String} ids 要移除的循环函数的 ID
 */
export function deleteIntervals( ...ids ) {

    /** 对所有输入的 ID 执行： */
    ids.forEach( id => {

        /** 如果 ID 不存在，则跳过此 ID */
        if ( !intervals[id] ) { return; }

        /** 移除此循环函数 */
        system.clearRun( intervals[id].numberId );

        /** 在循环函数列表中移除此索引 */
        delete intervals[id];

    } )

}

/** 删除特定标签的所有循环函数
 * @param {...String} tags 
 */
export function deleteIntervalsWithTag( ...tags ) {

    /** 遍历所有 intervals 对象，查找有这些标签的索引 */
    Object.entries( intervals ).forEach( ( [ id, value ] ) => {

        if ( tags.filter( tag => value.tags.includes( tag ) ).length > 0 ) {

            /** 移除此循环函数 */
            system.clearRun( intervals[id].numberId );

            /** 在循环函数列表中移除此索引 */
            delete intervals[id];

        }

    } )

}
