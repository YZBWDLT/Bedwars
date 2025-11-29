/** 所有设置 */

import { ItemUseAfterEvent, Player, system, world } from "@minecraft/server"
import { createAndShowActionUi } from "./uiManager"
import { warnPlayer } from "./bedwarsPlayer"
import { map } from "./bedwarsMaps"
import { getParticipantWithScore, getQuitPlayers, getScore, getScoreboard, getScores, resetScore, setScore } from "./scoreboardManager"
import { getPlayerAmount } from "./playerManager"
import { countSameNumbers } from "./number"
import { uiManager } from "@minecraft/server-ui"

// ===== 游玩设置 =====

/** 玩家选队功能
 * @param {ItemUseAfterEvent} event 
 */
export function selectTeamSettings(event) {

    /** 玩家自主选队设置 */ const selectTeam = settings.beforeGaming.teamAssign.playerSelectEnabled;

    /** 使用菜单后的主页面 @param {Player} player 对何玩家启用此页面 */
    function showMainPage(player) {

        // 移除记分板中的玩家下线
        getQuitPlayers("selectTeam").forEach(quitPlayer => resetScore("selectTeam", quitPlayer));
        // 令玩家添加一个正在界面中的tag
        system.runTimeout(() => { player.runCommand("tag @s add selectingTeam"); }, 10);

        // ===== 基本信息 =====
        /** 所有队伍 */
        const teams = map().teamList;
        /** 总玩家人数 */
        // 例：如果总玩家为15，但最多只有8人能参与游戏，则总玩家人数仅设置为8
        const playerAmount = getPlayerAmount() < settings.beforeGaming.waiting.maxPlayerCount ? getPlayerAmount() : settings.beforeGaming.waiting.maxPlayerCount;
        /** 一队所能分配到最少玩家的数目 */
        // 例：11人4队，一队最少分配11/4=2（向下取整）名玩家；13人8队，一队最少分配13/8=1（向下取整）名玩家
        const minPlayerPerTeam = Math.floor(playerAmount / teams.length);
        /** 一队所能分配到最多玩家的数目 */
        // 例：11人4队，一队最多分配11/4=3（向上取整）名玩家；13人8队，一队最多分配13/8=2（向上取整）名玩家
        const maxPlayerPerTeam = Math.ceil(playerAmount / teams.length);
        /** 有多少队伍能够拥有最多玩家 */
        // 例：11人4队，有11%4=3个队伍可以分配到最多玩家；13人8队，有13%8=5个队伍可以分配到最多玩家
        // 如果所有队伍都允许拥有最大玩家数目，则返回队伍数。
        // 例：特殊地，16人4队，不应计算为16%4=0，而应计算为4队。
        const teamAmountWithMaxPlayers = playerAmount % teams.length === 0 ? teams.length : playerAmount % teams.length;

        // ===== 记分板信息 =====
        /** 当前队伍的选择信息，分数为该team在teams中的index */
        // 例：该数组将记录为[0,0,1,1,1,2,3]，代表2人选择了第一个队伍（一般是红队），3人选择了第二个队伍（一般是蓝队），以此类推。
        const currentInfo = getScores("selectTeam");
        /** 队伍信息 */
        const teamsInfo = teams.map((team, index) => ({
            /** 队伍 */
            team: team,
            /** 选择了该队伍的玩家的名字  */
            // 例：该数组将记录为["a","b","c",...]等选择了该队伍的玩家ID
            players: getParticipantWithScore("selectTeam", index).map(participant => participant.displayName),
            /** 选择了该队伍的玩家的数量 */
            get playerAmount() { return this.players.length },
            /** 本队允许的最大玩家数量 */
            // 正常情况下应当为每队可分配的玩家的最大值maxPlayerPerTeam。
            // 但如果满足以下两个条件，则该队允许的最大玩家数量则为minPlayerPerTeam：
            // 1. 有teamAmountWithMaxPlayers个队伍分配到了最大玩家数量maxPlayerPerTeam
            // 2. 该队伍自身并没有达到最大玩家数量maxPlayerPerTeam
            get maxPlayerAmount() {
                if (
                    countSameNumbers(currentInfo, maxPlayerPerTeam) === teamAmountWithMaxPlayers // 条件 1 的判断
                    && this.playerAmount !== maxPlayerPerTeam // 条件 2 的判断
                ) return minPlayerPerTeam;
                else return maxPlayerPerTeam;
            },
            /** 本队人数是否已达到最大人数 */
            // 只要本队总人数达到甚至大于本队允许的最大玩家数量，则本队人数就已已达到最大人数
            get isFull() {
                return this.playerAmount >= this.maxPlayerAmount;
            },
        }))

        /** 按钮设置面板 @type {import("./uiManager").actionUiButtonInfo[]} */
        const buttonInfo = teamsInfo.map((info, index) => ({
            text: `${info.team.id === "gray" ? "§8灰" : info.team.getTeamNameWithColor()}队 §0[${info.playerAmount}/${info.maxPlayerAmount}]${info.isFull ? "§c(队伍已满！)" : ""}`,
            iconPath: `textures/items/bed_${info.team.id === "green" ? "lime" : info.team.id}`,
            funcWhenSelected: () => {
                applySettings(index); // 自己进行选队判断
                player.runCommand("tag @s remove selectingTeam"); // 移除正在选队的标签
                world.getPlayers().filter(otherPlayer => otherPlayer.hasTag("selectingTeam")).forEach(otherPlayer => {
                    uiManager.closeAllForms(otherPlayer);
                    showMainPage(otherPlayer); // 关闭其他玩家的UI，然后重新打开一个新的
                });
            },
        }));
        // 加入一个随机分队的设定
        buttonInfo.push({
            text: "随机分队", iconPath: "textures/blocks/barrier", funcWhenSelected: () => {
                applySettings(-1);  // 自己进行选队判断
                player.runCommand("tag @s remove selectingTeam"); // 移除正在选队的标签
                world.getPlayers().filter(otherPlayer => otherPlayer.hasTag("selectingTeam")).forEach(otherPlayer => {
                    uiManager.closeAllForms(otherPlayer);
                    showMainPage(otherPlayer); // 关闭其他玩家的UI，然后重新打开一个新的
                });
            }
        });

        /** 队伍选择状态的列表 */
        const bodyText = teamsInfo.map(info => `${info.team.getTeamNameWithColor()}队§f：${info.players.join(", ")}`).join("\n")

        actionSettings(
            player,
            "选择队伍",
            buttonInfo,
            () => { player.runCommand("tag @s remove selectingTeam"); },
            `§l选择你想要加入的队伍吧！\n§r当前的队伍选择状态：\n${bodyText}`
        );

        /** 应用设置
         * @param {number} teamIndex 选择的队伍索引
         */
        function applySettings(teamIndex) {
            // 如果返回的索引为 -1，则移除玩家的选队信息
            if (teamIndex === -1) {
                resetScore("selectTeam", player);
                player.sendMessage({ translate: "message.selectTeam.successClearTeam" });
                player.playSound("note.pling", { pitch: 2, location: player.location });
            }
            else {
                /** 所选择的队伍信息 */
                const teamInfo = teamsInfo[teamIndex]
                /** 玩家当前的索引，如果玩家未选队则返回 -1 @type {number} */
                const currentIndex = getScore("selectTeam", player, -1);
                /** 玩家当前的队伍信息 */
                const currentInfo = teamsInfo[currentIndex]
                // 如果所选择的队伍未满，则直接选中
                if (!teamInfo.isFull) {
                    setScore("selectTeam", player, teamIndex);
                    player.sendMessage({ translate: "message.selectTeam.success", with: [`${teamInfo.team.getTeamNameWithColor()}`] });
                    player.playSound("note.pling", { pitch: 2, location: player.location });
                }
                // 如果所选择的队伍已满
                else {
                    // 例：如果此时为3/3 3/3 2/2 2/2的全满状态，此时一个3人队伍中的一名玩家选择了一个2人的队伍，则此时也允许选队
                    // 因此如果满足以下几个条件，则在满员状态也可以换队伍：
                    // 1. 获取得到玩家目前的选队信息，如果玩家未选队则这个索引会返回-1，代表玩家无法选择队伍
                    // 2. 玩家当前的队伍是满员状态；
                    // 3. 玩家选择的队伍是满员状态；
                    // 4. 玩家当前的队伍的人数要大于选择的队伍，例如2人换3人是不允许的；
                    if (
                        currentIndex !== -1 // 条件 1 判断
                        && teamInfo.isFull // 条件 2 判断
                        && currentInfo.isFull // 条件 3 判断
                        && teamInfo.maxPlayerAmount < currentInfo.maxPlayerAmount // 条件 4 判断
                    ) {
                        setScore("selectTeam", player, teamIndex);
                        player.sendMessage({ translate: "message.selectTeam.success", with: [`${teams[teamIndex].getTeamNameWithColor()}`] });
                        player.playSound("note.pling", { pitch: 2, location: player.location });
                    }
                    // 如果上述条件不满足，禁止玩家选择该队伍
                    else {
                        warnPlayer(player, { translate: "message.selectTeam.teamIsFull", with: [`${teams[teamIndex].getTeamNameWithColor()}`] });
                        showMainPage(player);
                    }
                }
            }
        }
    }

    if (event.itemStack.typeId === "bedwars:select_team" && selectTeam && getScoreboard("selectTeam") !== undefined) {
        if (getScoreboard("selectTeam") === undefined) {
            event.source.sendMessage({ translate: `message.selectTeam.scoreboardLost` });
        }
        else {
            showMainPage(event.source);
        }
    }

}

// ===== 方法 =====

/** 显示Action类型的设置
 * @param {Player} player 显示 UI 的玩家
 * @param {string} titleText 标题名称
 * @param {import("./uiManager").actionUiButtonInfo[]} buttonInfo 所有的按钮信息
 * @param {function()} lastPage 上一页的函数
 * @param {import("@minecraft/server").RawMessage|string} bodyText UI 中的文字描述
 */
function actionSettings(player, titleText, buttonInfo, lastPage, bodyText = "") {
    createAndShowActionUi(
        player,
        buttonInfo,
        () => { lastPage(); },
        bodyText,
        titleText
    )
}
