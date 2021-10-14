
import ButtonGroup from './../shared/ButtonGroup'
import SpellButton from './SpellButton'
import { get_boss } from '../../../store/bosses'
import type Boss from '../../../types/boss'
import { useAppSelector } from '../../../store/store_hooks'

// TODO: is this even used anymore?

function _create_spell_buttons(spec: Boss, spell_ids: number[]) {
    if ( !spell_ids ) { return }
    return spell_ids.map(spell_id => <SpellButton key={`${spec.full_name_slug}/${spell_id}`} spec={spec} spell_id={spell_id} />)
}


///////////////////////////////////////
// BOSS
//

export function BossSpellsGroup() {

    // Get current Boss + Spells
    const boss = useAppSelector(state => get_boss(state))
    if (!boss) { return null }
    const spells = boss.spells_by_type?.boss
    if (!spells) { return null }

    // Render
    return (
        <ButtonGroup key="boss" name={boss.name} side="left" extra_class="wow-boss">
            {_create_spell_buttons(boss, spells) }
        </ButtonGroup>
    )
}