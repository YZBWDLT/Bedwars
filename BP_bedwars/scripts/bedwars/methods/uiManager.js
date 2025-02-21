/**
 * ===== UI 管理器 =====
 * 基于原版 SAPI 扩展的 Server UI 功能。
 */

import { Player } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

/** ===== 面板创建 ===== */

/** 创建一个行为型UI（ActionForm）面板。
 * @description 该面板允许玩家从多个选项中选择一个。选项可以附带有贴图。
 * @param { { text: import("@minecraft/server").RawMessage | string, iconPath?: string }[] } buttonInfo 按钮的文字和贴图描述。贴图应当是从资源包的textures/文件夹开始的，不带后缀的路径。
 * @param { import("@minecraft/server").RawMessage | string } bodyText UI 中的文字描述。
 * @param { import("@minecraft/server").RawMessage | string } titleText 标题中的文字描述。
 */
export function createActionUi( buttonInfo, bodyText = "", titleText = "" ) {
    let result = new ActionFormData().body( bodyText ).title( titleText );
    buttonInfo.forEach( button => { result = result.button( button.text, button.iconPath ) } );
    return result;
};

/** 创建一个消息型UI（MessageForm）面板。
 * @description 该面板允许玩家从是或否的两个选项中选择一个。
 * @param { import("@minecraft/server").RawMessage | string } button1Text 按钮1的文字描述。注意：按钮1是下面的按钮。
 * @param { import("@minecraft/server").RawMessage | string } button2Text 按钮2的文字描述。注意：按钮2是上面的按钮。
 * @param { import("@minecraft/server").RawMessage | string } bodyText UI 中的文字描述。
 * @param { import("@minecraft/server").RawMessage | string } titleText 标题中的文字描述。
 */
export function createMessageUi( button1Text, button2Text, bodyText = "", titleText = "" ) {
    return new MessageFormData().button1( button1Text ).button2( button2Text ).body( bodyText ).title( titleText );
};

/**
 * @typedef modalFormOptions 模式型UI选项
 * @property { "dropdown" | "slider" | "textField" | "toggle" } type 按钮类型
 * @property { import("@minecraft/server").RawMessage | string } label 按钮功能描述
 * @property { string | number | Boolean } defaultValue 默认值，其中：dropdown为number类型，为默认索引；slider为number类型，textField为string类型，toggle为boolean类型
 * @property { (import("@minecraft/server").RawMessage | string)[] } dropdownOptions 【dropdown类型】【必选】：下拉选项
 * @property { number } sliderMinValue 【slider类型】【必选】：最小值
 * @property { number } sliderMaxValue 【slider类型】【必选】：最大值
 * @property { number } sliderStepValue 【slider类型】【必选】：步长，每次滑动的变化值
 * @property { import("@minecraft/server").RawMessage | string } textFieldDescription 【textField类型】【必选】：文本框内的描述
 */

/** 创建一个模式型UI（ModalForm）面板。
 * @description 该面板允许玩家从多个不同类型的选项中分别选择。
 * @param { modalFormOptions[] } buttonInfo
 * @param { import("@minecraft/server").RawMessage | string } bodyText UI 中的文字描述。
 * @param { import("@minecraft/server").RawMessage | string } titleText 标题中的文字描述。
 * @param { import("@minecraft/server").RawMessage | string } submitText 提交按钮的文字描述。
 */
export function createModalUi( buttonInfo, titleText = "", submitText = "提交" ) {
    let result = new ModalFormData().title( titleText ).submitButton( submitText );
    buttonInfo.forEach( button => {
        if ( button.type === "dropdown" ) { result = result.dropdown( button.label, button.dropdownOptions, button.defaultValue ); }
        else if ( button.type === "slider" ) { result = result.slider( button.label, button.sliderMinValue, button.sliderMaxValue, button.sliderStepValue, button.defaultValue ); }
        else if ( button.type === "textField" ) { result = result.textField( button.label, button.textFieldDescription, button.defaultValue ); }
        else if ( button.type === "toggle" ) { result = result.toggle( button.label, button.defaultValue ); }
    } );
    return result;
};

/** ===== 显示与选择追踪 ===== */

/** 向玩家显示行为型UI或消息型UI，并追踪玩家的选择。返回是否成功地执行了表单。
 * @param {ActionFormData|MessageFormData} ui 要显示的行为型UI
 * @param {Player} showPlayer 要向何玩家显示
 * @param {function(number):void} playerSelectedFunc 当玩家选择了特定选项后，执行的内容。返回玩家选择的第n个按钮（n从0开始）。
 * @param {function("UserBusy" | "UserClosed" | undefined):void} playerCanceledFunc 当玩家取消后执行的内容。
 */
export function showActionOrMessageUi( ui, showPlayer, playerSelectedFunc, playerCanceledFunc ) {
    let executed = true
    ui.show( showPlayer ).then( response => {
        if ( response.canceled ) {
            playerCanceledFunc( response.cancelationReason );
        }
        else {
            playerSelectedFunc( response.selection );
        }
    } ).catch( () => {
        executed = false;
    } );
    return executed;
}

/** 向玩家显示模式型UI，并追踪玩家的选择。返回是否成功地执行了表单。
 * @param {ModalFormData} ui 要显示的模式型UI
 * @param {Player} showPlayer 要向何玩家显示
 * @param {function( (number | string | boolean)[] ):void} submittedFunc 当玩家提交了特定选项后，执行的内容。参数1：返回的内容。
 * @param {function("UserBusy" | "UserClosed" | undefined):void} playerCanceledFunc 当玩家取消后执行的内容。
 */
export function showModalUi( ui, showPlayer, submittedFunc, playerCanceledFunc ) {
    let executed = true
    ui.show( showPlayer ).then( response => {
        if ( response.canceled ) {
            playerCanceledFunc( response.cancelationReason );
        }
        else {
            submittedFunc( response.formValues );
        }
    } ).catch( () => {
        executed = false;
    } );
    return executed;
}
