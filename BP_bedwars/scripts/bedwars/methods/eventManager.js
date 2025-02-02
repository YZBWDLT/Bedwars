/** 事件管理器 */

import { isEmptyObject } from "./number";

/** 全部的监听事件列表 @type { { [id:String]:{event, tags: String[], eventId} } } */
let events = {};

/** 创建新的监听事件
 * @param {String} id 监听事件 ID
 * @param eventId 监听的事件类型
 * @param {function(event)} func 要执行的函数
 * @param {String[]} tags 监听事件的标签
 * @param {{}} options 事件的可选参数
 */
export function createEvent( id, eventId, func, tags=[], options={} ) {

    /** 如果监听事件在所有列表中已经存在，则阻止之 */
    if ( events[id] ) { return; }

    /** 新增监听事件执行任务 */
    let event = isEmptyObject( options ) ? eventId.subscribe( e => func( e ) ) : eventId.subscribe( e => func( e ), options )

    /** 使监听事件的标签默认添加 ID */
    tags.push( id );

    /** 新增新的监听事件 */
    events[id] = { event, tags, eventId }

}

/** 删除特定 ID 的监听事件
 * @param  {...String} ids - 待删除的监听事件的 ID
 */
export function deleteEvents( ...ids ) {

    /** 对所有输入的 ID 执行： */
    ids.forEach( id => {

        /** 如果 ID 不存在，则跳过此 ID */
        if ( !events[id] ) { return; }

        /** 移除此监听事件 */
        events[id].eventId.unsubscribe( events[id].event )

        /** 在监听事件列表中移除此索引 */
        delete events[id];

    } )

}

/** 删除特定标签的监听事件
 * @param  {...any} tags - 待删除的监听事件的标签
 */
export function deleteEventsWithTag( ...tags ) {

    /** 遍历所有 events 对象，查找有这些标签的索引 */
    Object.entries( events ).forEach( ( [ id, value ] ) => {

        if ( tags.filter( tag => value.tags.includes( tag ) ).length > 0 ) {

            /** 移除此监听事件 */
            events[id].eventId.unsubscribe( events[id].event )

            /** 在监听事件列表中移除此索引 */
            delete events[id];
            
        }

    } )

}
