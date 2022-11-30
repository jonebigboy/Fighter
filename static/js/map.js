import { AcGameObject } from '/拳皇/static/js/ac-game-object.js';
import { Control } from '/拳皇/static/js/control.js';

export class GameMap extends AcGameObject {
    constructor(root) {
        super();
        this.root = root;
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();
        this.control = new Control(this.$canvas);

        this.$time = this.root.$kof.find(`.kof-head-hp-timer`);
        this.time_left = 60000;
    }

    start() {

    }
    update() {
        this.time_left -= this.timedelta;
        if (this.time_left <= 0) {
            this.time_left = 0;

            let [a, b] = this.root.player;
            if (a.status !== 6 && b.status !== 6) {
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx = 0;
            }
        }
        this.$time.text(parseInt(this.time_left / 1000));

        this.render();

    }
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //console.log(this.ctx.canvas.width, this.ctx.canvas.height);
        //this.ctx.fillStyle = 'green';
        //this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}