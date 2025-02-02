/**
 * ===== 调试方法 =====
 * 用于调试的方法。
 */

import { world } from "@minecraft/server"
import { eachPlayer } from "./playerManager"

/** 打印对象键值对
 * @param {Object} obj 输入对象
 */
export function objectPrint(obj) {
    if (obj == undefined) return world.sendMessage(`<§6Undefined§r>`) // 如果输入的内容是Undefined，则整体输出Undefined
    let str_l_1 = []
    try { str_l_1.push(`<§6Object ${obj.constructor.name}`) }
    catch { str_l_1.push(`<§6Object Module`) } // str_l_1现在输出对象的构造函数名，并会尝试检查错误
    let str_l_2 = []
    for (let key in obj) {  // 对象中的每个元素遍历
        let a = `    §a${key} : ` ; let b = ``
        try {obj[key]} catch {continue} // 忽略obj[key]可能造成的错误
        if (obj[key] instanceof Function) { // 如果得到的obj[key]是一个对象中的方法，则输出为`${key}: <Bound Method>`
            b = `§e<Bound Method>`
            str_l_2.push(a + b)
        }
        else {  // 其他情况（即obj[key]不是一个方法）下
            let obj_name = ""
            try {obj_name = obj[key].constructor.name} catch {obj_name = obj[key]}  // 尝试输出构造函数名，如果输出不了一点则直接输出obj[key]本身
            if (!["String","Number","Boolean"].includes(obj_name) &&  obj_name != undefined && obj_name != null) b = `§b<Object ${obj_name}>`
                    // 字符串、数值、布尔值，undefined和null都是直接输出的
            else b = `§b${obj[key]}`    // 如果满足上面的几种情况，直接输出该键对应的值本身
            str_l_1.push(a + b) // 将上面所输出的值添加，以保证非Function是输出在上面的
        }
        
    }
    str_l_2.push("§r>") // 结尾
    world.sendMessage(str_l_1.join('\n') + "\n" + str_l_2.join('\n'));
}

/** 打印无方法的对象键值对
 * @param {Object} obj 输入对象
 */
export function objectPrintNoMethod(obj) {
    if (obj == undefined) return world.sendMessage(`<§6Undefined§r>`) // 如果输入的内容是Undefined，则整体输出Undefined
    let str_l_1 = []
    try { str_l_1.push(`<§6Object ${obj.constructor.name}`) }
    catch { str_l_1.push(`<§6Object Module`) } // str_l_1现在输出对象的构造函数名，并会尝试检查错误
    let str_l_2 = []
    for (let key in obj) {  // 对象中的每个元素遍历
        let a = `    §a${key} : ` ; let b = ``
        try {obj[key]} catch {continue} // 忽略obj[key]可能造成的错误
        if (obj[key] instanceof Function) { // 如果得到的obj[key]是一个对象中的方法，则输出为`${key}: <Bound Method>`
        }
        else {  // 其他情况（即obj[key]不是一个方法）下
            let obj_name = ""
            try {obj_name = obj[key].constructor.name} catch {obj_name = obj[key]}  // 尝试输出构造函数名，如果输出不了一点则直接输出obj[key]本身
            if (!["String","Number","Boolean"].includes(obj_name) &&  obj_name != undefined && obj_name != null) b = `§b<Object ${obj_name}>`
                    // 字符串、数值、布尔值，undefined和null都是直接输出的
            else b = `§b${obj[key]}`    // 如果满足上面的几种情况，直接输出该键对应的值本身
            str_l_1.push(a + b) // 将上面所输出的值添加，以保证非Function是输出在上面的
        }
        
    }
    str_l_2.push("§r>") // 结尾
    world.sendMessage(str_l_1.join('\n') + "\n" + str_l_2.join('\n'));
}

/** 在快捷栏标题打印对象键值对
 * @param {Object} obj 输入对象
 */
export function objectPrintActionbar(obj) {
    if (obj == undefined) return eachPlayer( player => { player.onScreenDisplay.setActionBar(`<§6Undefined§r>`) } )// 如果输入的内容是Undefined，则整体输出Undefined
    let str_l_1 = []
    try { str_l_1.push(`<§6Object ${obj.constructor.name}`) }
    catch { str_l_1.push(`<§6Object Module`) } // str_l_1现在输出对象的构造函数名，并会尝试检查错误
    let str_l_2 = []
    for (let key in obj) {  // 对象中的每个元素遍历
        let a = `    §a${key} : ` ; let b = ``
        try {obj[key]} catch {continue} // 忽略obj[key]可能造成的错误
        if (obj[key] instanceof Function) { // 如果得到的obj[key]是一个对象中的方法，则输出为`${key}: <Bound Method>`
            b = `§e<Bound Method>`
            str_l_2.push(a + b)
        }
        else {  // 其他情况（即obj[key]不是一个方法）下
            let obj_name = ""
            try {obj_name = obj[key].constructor.name} catch {obj_name = obj[key]}  // 尝试输出构造函数名，如果输出不了一点则直接输出obj[key]本身
            if (!["String","Number","Boolean"].includes(obj_name) &&  obj_name != undefined && obj_name != null) b = `§b<Object ${obj_name}>`
                    // 字符串、数值、布尔值，undefined和null都是直接输出的
            else b = `§b${obj[key]}`    // 如果满足上面的几种情况，直接输出该键对应的值本身
            str_l_1.push(a + b) // 将上面所输出的值添加，以保证非Function是输出在上面的
        }
        
    }
    str_l_2.push("§r>") // 结尾
    eachPlayer( player => { player.onScreenDisplay.setActionBar(str_l_1.join('\n') + "\n" + str_l_2.join('\n')) } );
}

/** 在快捷栏标题打印无方法的对象键值对
 * @param {Object} obj 输入对象
 */
export function objectPrintActionbarNoMethod(obj) {
    if (obj == undefined) return eachPlayer( player => { player.onScreenDisplay.setActionBar(`<§6Undefined§r>`) } )// 如果输入的内容是Undefined，则整体输出Undefined
    let str_l_1 = []
    try { str_l_1.push(`<§6Object ${obj.constructor.name}`) }
    catch { str_l_1.push(`<§6Object Module`) } // str_l_1现在输出对象的构造函数名，并会尝试检查错误
    let str_l_2 = []
    for (let key in obj) {  // 对象中的每个元素遍历
        let a = `    §a${key} : ` ; let b = ``
        try {obj[key]} catch {continue} // 忽略obj[key]可能造成的错误
        if (obj[key] instanceof Function) { // 如果得到的obj[key]是一个对象中的方法，则输出为`${key}: <Bound Method>`
        }
        else {  // 其他情况（即obj[key]不是一个方法）下
            let obj_name = ""
            try {obj_name = obj[key].constructor.name} catch {obj_name = obj[key]}  // 尝试输出构造函数名，如果输出不了一点则直接输出obj[key]本身
            if (!["String","Number","Boolean"].includes(obj_name) &&  obj_name != undefined && obj_name != null) b = `§b<Object ${obj_name}>`
                    // 字符串、数值、布尔值，undefined和null都是直接输出的
            else b = `§b${obj[key]}`    // 如果满足上面的几种情况，直接输出该键对应的值本身
            str_l_1.push(a + b) // 将上面所输出的值添加，以保证非Function是输出在上面的
        }
        
    }
    str_l_2.push("§r>") // 结尾
    eachPlayer( player => { player.onScreenDisplay.setActionBar(str_l_1.join('\n') + "\n" + str_l_2.join('\n')) } );
}

/** 打印变量
 * @param message 输入的对象
 */
export function sendMessage( message ) {
    world.sendMessage( `${message}` )
}
