/**
 * ===== 数字处理方法 =====
 * 用于处理数字。
 */

/** 在a~b之间取随机整数，输出的值可能包含最小值和最大值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 */
export function randomInt(min, max) {
    /** 确保 min <= max */
    if (min > max) { [min, max] = [max, min]; }
    return Math.floor(Math.random() * (max - min + 1)) + min;    // 生成 [min, max] 之间的随机整数
}

/** 将数字转换为罗马数字的字符串
 * @param {Number} num 待转换数字
 */
export function intToRoman( num ) {
    if ( num <= 0 ) { return ""; }

    const romanNumerals = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];

    let result = '';

    for (const { value, symbol } of romanNumerals) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }

    return result;
}

/** 在输入的对象中，输出值所对应的键
 * @remark 如果对象所有的值中有重复的，那么会返回第一个对应的键
 * @param {object} obj 输入的对象
 * @param {*} value 待寻找的对应值
 */
export function getKeyByValue( obj, value ) {
    for (const [key, val] of Object.entries(obj)) {
        if (val === value) {
            return key;
        }
    }
    return void 0;
}

/** 打乱一个数组
 * @param {Array} array
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        /** 生成一个随机索引 j */ const j = Math.floor(Math.random() * (i + 1));
        /** 交换元素 array[i] 和 array[j] */ [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/** 判断传入的对象是否为空对象
 * @param {object} obj
 */
export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/** 删除数组的特定元素
 * @param {Array} array 待删除元素的数组
 * @param {*} element 待删除的元素
 */
export function removeElementOfArray( array, element ) {
    // 使用循环和splice方法删除所有匹配的元素
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === element) {
            array.splice(i, 1);
        }
    }
}

/** 判断由对象组成的数组中是否含有某个对象
 * @param {object[]} array 待检测数组
 * @param {object} object 是否含有的对象
 */
export function objectInArray(array, object) {
    // 遍历数组中的每个元素
    return array.some(item => {
        // 检查对象的所有属性是否匹配
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                // 如果属性不匹配，返回 false
                if (!item.hasOwnProperty(key) || item[key] !== object[key]) {
                    return false;
                }
            }
        }
        // 检查数组中的对象是否有多余的属性
        for (let key in item) {
            if (item.hasOwnProperty(key) && !object.hasOwnProperty(key)) {
                return false;
            }
        }
        // 如果所有属性都匹配，返回 true
        return true;
    });
}