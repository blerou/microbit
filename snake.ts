namespace snake {

    // POINTS ================================================
    type point = number
    // type point = number[]
    function point(_x: number, _y: number): point {
        return ((_x << 3) & 0b00111000) | (_y & 0b00000111)
        // return [_x, _y, 0]
    }
    function x(p: point): number {
        return ((p & 0b00111000) >> 3)
        // return p[0]
    }
    function y(p: point): number {
        return (p & 0b00000111)
        // return p[1]
    }
    let _coord_mask = 0b00111000 | 0b00000111
    function eq(p1: point, p2: point): boolean {
        return (p1 & _coord_mask) == (p2 & _coord_mask)
        // return p1[0] == p2[0] && p1[1] == p2[1]
    }
    // END POINTS ============================================

    // FLAGS =================================================
    const enum flag {
        HIDE = 0b01000000,
        COLLECT = 0b10000000,
    }
    function on(p: point, f: flag) {
        p |= f
        // p[2] |= f
        return p
    }
    function off(p: point, f: flag) {
        p &= ~f
        // p[2] &= ~f
        return p
    }
    function is_on(p: point, f: flag): boolean {
        return (p & f) > 0
        // return (p[2] & f) > 0
    }
    // END FLAGS =============================================

    // DIRECTION =============================================
    enum direction {
        UP = 0,
        LEFT = 1,
        DOWN = 2,
        RIGHT = 3,
    }
    function dx(d: direction): number {
        switch (d) {
        case direction.UP:
        case direction.DOWN: return 0
        case direction.LEFT: return -1
        case direction.RIGHT: return 1
        }
    }
    function dy(d: direction): number {
        switch (d) {
        case direction.UP: return -1
        case direction.DOWN: return 1
        case direction.LEFT:
        case direction.RIGHT: return 0
        }
    }

    let dir: direction, next_dir: direction

    export function turn_left() {
        next_dir = (dir + 1) % 4
    }

    export function turn_right() {
        next_dir = (dir - 1 + 4) % 4
    }
    // END DIRECTION =========================================

    // GAME STATE ============================================
    const enum GameState {
        Paused,
        Running,
        Win,
        Lost,
        Halt,
    }
    let game_on = GameState.Paused

    export function pause_resume_game() {
        game_on = game_on == GameState.Running ? GameState.Paused : GameState.Running
    }
    // END GAME STATE ========================================

    // EGG ===================================================
    type egg = point
    let egg: egg
    function gen_egg() {
        let _x: number, _y: number
        do {
            _x = Math.floor(Math.random() * 5)
            _y = Math.floor(Math.random() * 5)
            egg = point(_x, _y)
        } while (snake.filter(p => eq(p, egg)).length > 0)
    }
    // END EGG ===============================================

    // LEVELS ================================================
    let speed = 0
    let speed_levels: number[] = []
    let game_won_at: number[] = []

    function nextLevel() {
        return (speed + 1) % speed_levels.length
    }

    export function move_to_next_level() {
        speed = nextLevel()
    }
    // END LEVELS ============================================

    // SNAKE =================================================
    let snake: point[] = []
    function next_snake() {
        snake = snake.filter(el => !is_on(el, flag.HIDE))

        let head = 0
        let _x = (x(snake[head]) + dx(dir) + 5) % 5
        let _y = (y(snake[head]) + dy(dir) + 5) % 5
        let next_head = point(_x, _y)
        snake.unshift(next_head)

        if (eq(snake[head], egg)) {
            egg = on(egg, flag.COLLECT)
        }

        let tail = snake.length - 1
        if (eq(snake[tail], egg)) {
            gen_egg()
        } else {
            snake[tail] = on(snake[tail], flag.HIDE)
        }
    }
    // END SNAKE =============================================

    // GAME ==================================================
    let tick: number

    export function init(init_level: number) {
        game_on = GameState.Running
        snake = [point(2, 3), point(2, 4)]
        dir = direction.RIGHT
        next_dir = dir
        speed_levels = [5, 3, 2]
        speed = init_level
        game_won_at = [9, 8, 7]
        // game_won_at = [5, 5, 5] // testing
        gen_egg()
        tick = 0
    }

    function render() {
        if (game_on == GameState.Running) {
            let _x: number, _y: number
            // snake
            for (let i = 0; i < snake.length; i++) {
                _x = x(snake[i])
                _y = y(snake[i])
                if (is_on(snake[i], flag.HIDE)) {
                    led.unplot(_x, _y)
                } else {
                    led.plotBrightness(_x, _y, 31-i*5)
                }
            }
            // egg
            let brightness = is_on(egg, flag.COLLECT) || tick % 2 == 0 ? 31 : 63
            led.plotBrightness(x(egg), y(egg), brightness)
        } else if (game_on == GameState.Win) {
            // TODO winning animation
            let message = "level" + (speed+1) + "done"
            basic.showString(message)
            if (nextLevel() == 0) {
                basic.showLeds(`
                    # . # . #
                    # # . # #
                    . # # # .
                    . . # . .
                    . # # # .
                `)
            }
        } else if (game_on == GameState.Lost) {
            // TODO losing animation
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                . # # # .
                # . . . #
            `)
        }
    }

    // TODO(IDEA) replay back (A) and forth (B) ?

    export function game_step() {
        render()

        basic.pause(100)

        if (game_on == GameState.Win) {
            let next = nextLevel()
            if (next == 0) {
                game_on = GameState.Halt
            } else {
                init(next)
            }
        }
        if (game_on == GameState.Lost) {
            game_on = GameState.Halt
        }
        if (game_on == GameState.Running && (tick % speed_levels[speed]) == 0) {
            dir = next_dir

            if (snake.length == game_won_at[speed]) {
                game_on = GameState.Win
            } else if (snake.slice(1).filter(p => eq(p, snake[0])).length > 0) {
                game_on = GameState.Lost
            } else {
                next_snake()
            }
        }
        tick += 1
    }
}
snake.init(0)
input.onPinPressed(TouchPin.P0, snake.pause_resume_game)
input.onButtonPressed(Button.A, snake.turn_left)
input.onButtonPressed(Button.B, snake.turn_right)
input.onPinPressed(TouchPin.P1, snake.move_to_next_level)
basic.forever(snake.game_step)
