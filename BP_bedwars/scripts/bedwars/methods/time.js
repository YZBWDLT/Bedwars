/**
 * ===== 时间方法 =====
 * 用于处理时间数据的方法。
 */

/** 将单位为游戏刻的时间转换为以秒为单位的时间
 * @param {Number} tickTime 游戏刻时间
 */
export function tickToSecond( tickTime ) {
    return Math.floor( tickTime / 20 ) + 1;
}

/** 将单位为秒的时间转换为以分钟和秒钟为单位的时间
 * @param {Number} secondTime 秒数时间
 */
export function secondToMinute(secondTime) {
    return { 
        minute: Math.floor(secondTime / 60), 
        second: secondTime % 60
    };
}

/** 按照给定的时间值输出合适格式的时间字符串（例如 15:34.75）
 * @param {"st"|"ms"|"mst"} mode 输出模式，st：输出秒钟和毫秒，ms：输出分钟和秒钟，mst：三者输出
 * @param {{minute:Number,second:Number,tick:Number}} time 输入的时间数值
 */
export function timeString( mode, time = { minute, second, tick } ) {

    /** 默认值设定 */
    let defaultTime = { minute: 0, second: 0, tick: 0 };
    let realTime = { ...defaultTime, ...time }

    /** 按输出方式决定输出内容 */
    if ( mode === "st" ) {
        return `${realTime.second}.${realTime.tick*5}`
    }
    else if (mode === "ms") {
        let secondStr = realTime.second < 10 ? `0${realTime.second}` : realTime.second;
        return `${realTime.minute}:${secondStr}`;
    }
    else {
        let secondStr = realTime.second < 10 ? `0${realTime.second}` : realTime.second;
        return `${realTime.minute}:${secondStr}.${realTime.tick*5}`;
    }
}