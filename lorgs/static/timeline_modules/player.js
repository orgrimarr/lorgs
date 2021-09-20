

class Player {

    constructor(player_data) {

        this.casts_group = new Konva.Group()
        this.casts_group.transformsEnabled("position")

        // load casts
        this.casts = player_data.casts.map(cast_data => new Cast(cast_data))
    }

    create() {
        this.casts.forEach(cast => { cast.create() })
        this.casts = this.casts.filter(cast => cast.spell)
    }

    update() {

        this.casts.forEach(cast => {

            if (cast.spell.show) {

                cast.update()

                if (cast.getParent() == undefined) {
                    this.casts_group.add(cast)
                }

                // move one after the other to the top/
                // assuming they are sorted by time.. this should fix overlaps
                cast.moveToTop()

            } else {
                if (cast.getParent() != undefined) {
                    cast.remove()
                }
            }
        })

        this.casts_group.clearCache()
        if (this.casts_group.hasChildren()) {
            this.casts_group.cache()
        }
    }
}