

import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import ButtonGroup, { ButtonGroupContext } from './shared/ButtonGroup'
import { update_settings } from '../../store/ui'
import { useAppSelector } from '../../store/store_hooks'


function Button({attr_name, icon_name, tooltip=""} : {attr_name: string, icon_name: string, tooltip?: string}) {

    ////////////////////////
    // Hooks
    //
    const attr_value = useAppSelector(state => state.ui.settings[attr_name])
    const dispatch = useDispatch()
    const disabled = attr_value ? "" : "disabled"
    const group_context = useContext(ButtonGroupContext)


    function onClick() {
        const new_value = !attr_value

        dispatch(update_settings({
            [attr_name]: new_value
        }))

        if (new_value && group_context.setter) {
            group_context.setter({active: new_value, source: "child"})
        }
    }

    // see SpellButton,jsx
    useEffect(() => {
        if (group_context.source !== "group") { return}
        dispatch(update_settings({
            [attr_name]: group_context.active
        }))
    }, [group_context.active])

    ////////////////////////
    // Render
    //
    return (
        <div data-tooltip={tooltip}>
            <div
                className={`button icon-s rounded border-white ${icon_name} ${disabled}`}
                onClick={onClick}
            />
        </div>
    )
}


export default function DisplaySettings() {

    return (
        <>
            <ButtonGroup name="Display" side="left">
                <Button attr_name="show_casticon" icon_name="fas fa-image" tooltip="spell icon" />
                <Button attr_name="show_casttime" icon_name="fas fa-clock" tooltip="cast time" />
                <Button attr_name="show_duration" icon_name="fas fa-stream" tooltip="duration" />
                <Button attr_name="show_cooldown" icon_name="fas fa-hourglass" tooltip="cooldown" />
            </ButtonGroup>
        </>
    )
}