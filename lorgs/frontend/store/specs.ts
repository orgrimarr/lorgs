
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type Spec from "../types/spec"
import type { RootState, AppDispatch } from './store'
import { fetch_data } from '../api'
import { group_spells_by_type } from './spells'


////////////////////////////////////////////////////////////////////////////////
// Actions
//

export function get_specs(state : RootState ) {
    return Object.values(state.specs)
}

export function get_spec(state: RootState, spec_slug?: string) {
    spec_slug = spec_slug || state.ui.spec_slug // input or current spec
    return state.specs[spec_slug] || null
}

/** Find the first spec that can use a given spell
 * @param {object} state current state
 * @param {number} spell_id id of the spell to find
 * @returns {object} the matched spell
*/
export function get_spec_for_spell_id(state: RootState, spell_id : number) {
    return Object.values(state.specs || {}).find(spec => {
        return Object.values(spec.spells_by_type || {}).some(spell_group => {
            return spell_group.includes(spell_id)
        }) // spell group
    }) // specs
}


////////////////////////////////////////////////////////////////////////////////
// Slice
//

function _process_spec(spec: Spec) {
    spec.loaded = false
    spec.icon_path = `/static/images/specs/${spec.full_name_slug}.jpg`
    return spec
}


const SLICE = createSlice({
    name: "specs",

    initialState: {} as { [ key: string ] : Spec },

    reducers: {

        set_specs: (state, action: PayloadAction<Spec[]>) => {

            action.payload.forEach(spec => {
                state[spec.full_name_slug] = _process_spec(spec)
            })
            return state
        },

        set_spec_spells: (state, action) => {
            const {spec_slug, spells} = action.payload
            const spec = state[spec_slug]
            if (!spec) { return state}

            spec.spells_by_type =  group_spells_by_type(spells)
            spec.loaded = true
            return state
        },

    }, // reducers
})

export default SLICE.reducer


////////////////////////////////////////////////////////////////////////////////
// Extra Actions


export function load_specs() {

    return async (dispatch: AppDispatch) => {
        dispatch({type: "ui/set_loading", payload: {key: "specs", value: true}})

        // Request
        const specs_dict = await fetch_data("/api/specs");
        const specs = specs_dict.specs || []

        dispatch(SLICE.actions.set_specs(specs))
        dispatch({type: "ui/set_loading", payload: {key: "specs", value: false}})
    }
}


export function load_spec_spells(spec_slug: string) {

    return async (dispatch: AppDispatch) => {
        const load_key = `specs/${spec_slug}`
        dispatch({type: "ui/set_loading", payload: {key: load_key, value: true}})

        // Request
        const spells = await fetch_data(`/api/specs/${spec_slug}/spells`);

        dispatch(SLICE.actions.set_spec_spells({spec_slug, spells}))
        dispatch({type: "ui/set_loading", payload: {key: load_key, value: false}})
    }
}