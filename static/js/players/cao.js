import { Player } from '/拳皇/static/js/players/player.js';
import { GIF } from '/拳皇/static/js/utils/gif.js';

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);
        this.init_animations();

    }

    init_animations() {
        for (let i = 0; i < 7; i++) {
            let outer = this;
            let gif = GIF();
            gif.load(`/拳皇/static/images/players/kyo/${i}.gif`);

            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,
                frame_rate: 5,
                offset_y: 0,
                loaded: false,
                scale: 2,
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
                if (i === 3) {
                    obj.frame_rate = 4;
                }
            }

        }
    }

}