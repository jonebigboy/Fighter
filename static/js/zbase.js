import { GameMap } from '/拳皇/static/js/map.js';
import { Player } from '/拳皇/static/js/players/player.js';
import { Kyo } from '/拳皇/static/js/players/cao.js';

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.game_map = new GameMap(this);
        this.player = [
            new Kyo(this, {
                id: 0,
                x: 130,
                y: 0,
                width: 150,
                height: 200,
                color: 'blue',
            }),

            new Kyo(this, {
                id: 1,
                x: 1000,
                y: 0,
                width: 150,
                height: 200,
                color: 'red',
            }),

        ]




        //console.log(this.$kof);

    }

}




export {
    KOF
}