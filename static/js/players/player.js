import { AcGameObject } from '/拳皇/static/js/ac-game-object.js';

export class Player extends AcGameObject {
    constructor(root, info) {
        super();
        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400; //水平速度
        this.speedy = 1300; //跳跃
        this.ctx = this.root.game_map.ctx;

        this.gravity = 50;
        this.pressed_keys = this.root.game_map.control.pressed_keys;

        this.status = 3;//0 不动 1前进 2 退后，3跳跃  4 攻击 5 被攻击 6 死去
        this.animations = new Map();
        this.frame_current_cnt = 0;

        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);

    }
    start() {

    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = -this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    move() {

        this.vy += this.gravity;

        //console.log(this.vy * this.timedelta / 1000);
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if (this.status === 3) {
                this.status = 0;
            }

        }
        if (this.x < 0) {
            this.x = 0;
            //console.log(this.x);
        } else if (this.x + this.width > this.ctx.canvas.width) {
            //console.log(this.x + " " + this.width);
            this.x = this.ctx.canvas.width - this.width;
        }


    }
    update_direction() {
        if (this.status === 6) return;

        let players = this.root.player;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    is_attack() {
        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - 50, 0);
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100,
        });


        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }

    }
    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 18) {
            let players = this.root.player;
            let me = this, you = players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 210,
                    y1: me.y + 40,
                    x2: me.x + 210 + 20,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 230,
                    y1: me.y + 40,
                    x2: me.x + me.width - 230 + 20,
                    y2: me.y + 40 + 20,
                };
            }
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };

            if (this.is_collision(r1, r2)) {
                //console.log(this.is_collision(r1, r2));
                you.is_attack();
                console.log(this.status);
            }
        }
    }



    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }


    update() {
        this.update_control();
        this.move();
        this.update_direction();
        this.update_attack();
        this.render();
    }
    render() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.direction > 0) {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.x + 210, this.y + 40, 20, 20);
        } else {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.x + this.width - 230, this.y + 40, 20, 20);
        }



        let status = this.status;

        if (this.status === 1 && this.direction * this.vx < 0) status = 2;


        let offset_y = [0, -22, -22, -100, 0, 0, 0];

        let obj = this.animations.get(status);
        obj.offset_y = offset_y[status];
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;//渲染到第几帧
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();

                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.ctx.canvas.width, 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;//渲染到第几帧
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.ctx.canvas.width - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
                //console.log(image.width);
                this.ctx.restore();
            }

            //if (status === 3) console.log(k);
        }

        if ((status === 4 || status === 5 || status === 6) && parseInt(this.frame_current_cnt / obj.frame_rate) === obj.frame_cnt - 1) {
            if (status === 6) {
                this.frame_current_cnt--;
            } else {
                this.status = 0;
            }

        }
        this.frame_current_cnt++;

    }

}