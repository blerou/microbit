namespace snake {

    const enum GameState {
        Paused,
        On,
    }

    interface point {
        readonly x: number;
        readonly y: number;
    }

    let dir: point, newDir: point
    let speed = 0
    let speedSteps = 0
    let gameOn = GameState.Paused
    let snake: point[] = []
    let egg: point
    let eggCollected = false

    export function switchState() {
        gameOn = gameOn == GameState.On ? GameState.Paused : GameState.On
    }

    export function stepSpeed() {
        speed = (speed + 1) % speedSteps
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

    function show() {
        // snake
        for (let p of snake) {
            led.plot(p.x, p.y)
        }
        if (tail) {
            led.unplot(tail.x, tail.y)
            tail = null
        }
        // egg
        if (eggCollected || showEgg) {
            led.plot(egg.x, egg.y)
        } else {
            led.unplot(egg.x, egg.y)
        }
    }

    function nextHead() {
        let head = snake[0]
        let x = ((head.x + dir.x) % 5 + 5) % 5
        let y = ((head.y + dir.y) % 5 + 5) % 5
        return { x: x, y: y }
    }

    function genEgg(): point {
        let egg: point, x: number, y: number
        do {
            x = Math.floor(Math.random() * 5)
            y = Math.floor(Math.random() * 5)
            egg = { x: x, y: y }
        } while (snake.indexOf(egg) >= 0)
        return egg
    }

    let tick: number
    let showEgg: boolean
    let tail: point = null

    export function init() {
        gameOn = GameState.On
        snake = [{ x: 2, y: 3 }, { x: 2, y: 4 }]
        dir = { x: 1, y: 0 }
        newDir = dir
        speedSteps = 3
        speed = speedSteps - 1
        egg = genEgg()
        showEgg = true
        tick = 0
    }


    export function gameStep() {
        show()
        basic.pause(100)
        let snakeTicks = 1 + speed * 2
        if (tick % 2 == 0) {
            showEgg = !showEgg
        }
        if (gameOn == GameState.On && (tick % snakeTicks) == 0) {
            dir = newDir
            // move head
            let newHead = nextHead()
            tail = snake.pop()
            snake.unshift(newHead)
            if (newHead.x == egg.x && newHead.y == egg.y) {
                // TODO egg collected animation
                // IDEA brighter snake with each egg collected
                eggCollected = true
            } else if (tail.x == egg.x && tail.y == egg.y) {
                snake.push(tail)
                egg = genEgg()
                eggCollected = false
            }
        }
        tick += 1
    }
}
input.onPinPressed(TouchPin.P0, snake.switchState)
input.onButtonPressed(Button.A, snake.turnLeft)
input.onButtonPressed(Button.B, snake.turnRight)
input.onPinPressed(TouchPin.P1, snake.stepSpeed)
basic.forever(snake.gameStep)
snake.init()
