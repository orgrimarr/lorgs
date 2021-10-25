import FILTERS from "../../filter_logic";
import type Actor from "../../types/actor"
import type Fight from "../../types/fight"
import { MODES } from "../../store/ui";
import { WCL_URL } from "../../constants"
import { get_boss } from "../../store/bosses";
import { get_role } from "../../store/roles";
import { get_spec } from "../../store/specs";
import { kFormatter } from "../../utils"
import { useAppSelector } from "../../store/store_hooks";

// @ts-ignore
import styles from "./PlayerName.scss"


function spec_ranking_color(i = 0) {
    if (i == -1) { return "" } else
    if (i == 1) { return "wow-artifact" } else
    if (i <= 25) { return "wow-astounding" } else
    if (i <= 100) { return "wow-legendary" } else
    { return "wow-epic" }
}


export function BossName({fight, boss} : {fight: Fight, boss: Actor}) {

    ///////////////////
    // hooks
    const filters = useAppSelector(state => state.ui.filters)
    const boss_type = useAppSelector(state => get_boss(state, boss.name))

    ///////////////////
    // apply filters
    if (!boss) { return null}
    if (!boss_type) { return null}
    if (!FILTERS.is_player_visible(boss, filters)) { return null}

    ///////////////////
    // Render
    return (
        <div className={styles.boss_name}>
            <a target="_blank" href={fight.report_url}>
                <img className={styles.boss_name__spec_icon} src={boss_type.icon_path}></img>
                <span className={styles.boss_name__name}>{boss_type.name}</span>
            </a>
        </div>
    )
}


export function PlayerName({fight, player} : {fight: Fight, player: Actor}) {

    ///////////////////
    // hooks
    const mode = useAppSelector(state => state.ui.mode)
    const filters = useAppSelector(state => state.ui.filters)
    const spec = useAppSelector(state => get_spec(state, player.spec))
    const role = useAppSelector(state => get_role(state, player.role))
    const mode_spec = mode == MODES.SPEC_RANKING
    const mode_comp = mode == MODES.COMP_RANKING

    ///////////////////
    // apply filters
    if (!player) { return null}
    if (!FILTERS.is_player_visible(player, filters)) { return null}

    ///////////////////
    // vars
    const report_url = `${WCL_URL}/reports/${fight.report_id}#fight=${fight.fight_id}`

    ///////////////////
    // render
    return (
        <div className={`${styles.player_name} ${spec_ranking_color(player.rank)}`}>

            <a target="_blank" href={report_url}>
                {mode_comp && <img className={styles.player_name__role_icon} src={role.icon_path}></img>}
                <img className={styles.player_name__spec_icon} src={spec.icon_path}></img>

                <span className={`${styles.player_name__name} wow-${player.class}`}>{player.name}</span>
                {mode_spec && player.rank && <span className={styles.player_name__rank}>#{player.rank}</span>}
                {mode_spec && player.rank && player.total && <span className={styles.player_name__total}>{kFormatter(player.total)}</span>}
            </a>
        </div>
    )
}
