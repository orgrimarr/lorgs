import type Cast from "./cast";


export default interface Actor {

    class: string

    covenant?: string

    name: string

    role: string

    source_id?: number

    /** spec_slug */
    spec: string

    total: number

    pinned?: boolean

    // spec ranking
    rank?: number

    casts: Cast[]
}