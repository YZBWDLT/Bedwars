/**
 * ===== 位置方法 =====
 * 处理位置数据。
 */

import { world } from "@minecraft/server"

/** 主世界 */
export let overworld = world.getDimension( "overworld" );

/**
 * 创建一个新的方向向量，返回 Vector2 或 Vector 3 类型
 */
export class Vector {

    x = 0;
    y = 0;
    z = 0;

    /**
     * @param {Number} x
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor( x, y, z ) {
        if ( z !== undefined ) { return { x, y, z }; } else { return { x, y }; };
    };

}

export const positionManager = {

    /** 将 Vector 实例化的坐标复制
     * @param {Vector} vector 
     */
    copy( vector ) {
        return new Vector( vector.x, vector.y, vector.z );
    },

    /** 将某个轴的坐标添加某个特定的值
     * @param {Vector} vector 输入的方向向量
     * @param {Number} xAdder x添加值
     * @param {Number} yAdder y添加值
     * @param {Number} zAdder z添加值
     */
    add( vector, xAdder = 0, yAdder = 0, zAdder = 0 ) {
        return new Vector( vector.x + xAdder, vector.y + yAdder, vector.z + zAdder );
    },

    /** 返回将输入坐标中心化（x + 0.5，z + 0.5）的坐标
     * @param {Vector} pos 待中心化的坐标
     */
    center( pos ) {
        return new Vector( pos.x + 0.5, pos.y, pos.z + 0.5 );
    },

    /** 返回两个坐标是否相同
     * @param {Vector} pos1 坐标1
     * @param {Vector} pos2 坐标2
     */
    isEqual( pos1, pos2 ) {
        const keys = Object.keys( pos1 );
        return pos1.length === pos2.length && keys.every( key => pos1[key] === pos2[key] );
    },

    /** 检查在多个坐标下是否存在特定的坐标
     * @param {Vector[]} positions 
     * @param {Vector} testPos 
     */
    hasPosition( positions, testPos ) {
        return positions.some( position => this.isEqual( testPos, position ) );
    },

    /** 返回两个坐标之间的距离
     * @param {Vector} pos1 坐标1（必须是x,y,z坐标）
     * @param {Vector} pos2 坐标2（必须是x,y,z坐标）
     */
    distance( pos1, pos2 ) {
        const { x: x1, y: y1, z: z1 } = pos1;
        const { x: x2, y: y2, z: z2 } = pos2;
        return Math.sqrt( (x2-x1)**2+(y2-y1)**2+(z2-z1)**2 );
    }

}
