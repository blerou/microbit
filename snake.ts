namespace snake {

    const enum GameState {
        Paused,
        Running,
        Win,
        Lost,
        Halt,
    }

    interface point {
        readonly x: number;
        readonly y: number;
    }
    type egg = {
        readonly x: number;
        readonly y: number;
        show: boolean;
        collected: boolean;
    }

    let dir: point, newDir: point
    let speed = 0
    let speedLevels: number[] = []
    let gameWonAt: number[] = []
    let gameOn = GameState.Paused
    let snake: point[] = []
    let egg: egg

    export function pauseResumeGame() {
        gameOn = gameOn == GameState.Running ? GameState.Paused : GameState.Running
    }

    function nextLevel() {
        return (speed + 1) % speedLevels.length
    }

    export function moveToNextLevel() {
        speed = nextLevel()
    }

    export function turnLeft() {
        if (dir.x != 0) {
            newDir = { x: 0, y: dir.x * -1 }
        } else if (dir.y != 0) {
            newDir = { x: dir.y, y: 0 }
        }
    }

    export function turnRight() {
        if (dir.x != 0) {
            newDir = { x: 0, y: dir.x }
        } else if (dir.y != 0) {
            newDir = { x: dir.y * -1, y: 0 }
        }
    }

    function render() {
        if (gameOn == GameState.Running) {
            // snake
            for (let p of snake) {
                led.plot(p.x, p.y)
            }
            if (tail) {
                led.unplot(tail.x, tail.y)
                tail = null
            }
            // egg
            if (egg.collected || egg.show) {
                led.plot(egg.x, egg.y)
            } else {
                led.unplot(egg.x, egg.y)
            }
        } else if (gameOn == GameState.Win) {
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
        } else if (gameOn == GameState.Lost) {
            // TODO losing animation
            basic.showString(":(")
        }
    }

    function nextHead() {
        let head = snake[0]
        let x = ((head.x + dir.x) % 5 + 5) % 5
        let y = ((head.y + dir.y) % 5 + 5) % 5
        return { x: x, y: y }
    }

    function genEgg(): egg {
        let x: number, y: number
        do {
            x = Math.floor(Math.random() * 5)
            y = Math.floor(Math.random() * 5)
        } while (snake.filter(el => el.x == x && el.y == y).length > 0)
        return { x: x, y: y, show: true, collected: false }
    }

    let tick: number
    let tail: point = null

    export function init(initLevel: number) {
        gameOn = GameState.Running
        snake = [{ x: 2, y: 3 }, { x: 2, y: 4 }]
        dir = { x: 1, y: 0 }
        newDir = dir
        speedLevels = [5, 3, 1]
        speed = initLevel
        gameWonAt = [9, 8, 7]
        // gameWonAt = [5, 5, 5] // testing
        egg = genEgg()
        tick = 0
    }


    // TODO(IDEA) egg highlight while going through the snake body

    // TODO(IDEA) replay back (A) and forth (B) ?
    //   on history: to make it happen we have to introduce packing
    //   SnakePart: `u8` where
    //      - sp & 0b00111000 = x
    //      - sp & 0b00000111 = y
    //      - sp & SP_HIDE    = hidden, SP_HIDE = 0b00000110

    export function gameStep() {
        render()

        basic.pause(100)

        if (gameOn == GameState.Win) {
            let next = nextLevel()
            if (next == 0) {
                gameOn = GameState.Halt
            } else {
                init(next)
            }
        }
        if (gameOn == GameState.Lost) {
            gameOn = GameState.Halt
        }
        if (gameOn == GameState.Running && tick % 2 == 0) {
            egg.show = !egg.show
        }
        if (gameOn == GameState.Running && (tick % speedLevels[speed]) == 0) {
            dir = newDir
            let newHead = nextHead()
            if (snake.length == gameWonAt[speed]) {
                gameOn = GameState.Win
                egg.show = false
            } else if (snake.filter(p => p.x == newHead.x && p.y == newHead.y).length > 0) {
                gameOn = GameState.Lost
                egg.show = false
            } else {
                tail = snake.pop()
                snake.unshift(newHead)
                if (newHead.x == egg.x && newHead.y == egg.y) {
                    // TODO(IDEA) egg collected animation
                    // TODO(IDEA) brighter snake with each egg collected
                    egg.collected = true
                } else if (tail.x == egg.x && tail.y == egg.y) {
                    snake.push(tail)
                    egg = genEgg()
                }
            }
        }
        tick += 1
    }
}
input.onPinPressed(TouchPin.P0, snake.pauseResumeGame)
input.onButtonPressed(Button.A, snake.turnLeft)
input.onButtonPressed(Button.B, snake.turnRight)
input.onPinPressed(TouchPin.P1, snake.moveToNextLevel)
basic.forever(snake.gameStep)
snake.init(0)
