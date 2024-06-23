namespace snake {

    const enum GameState {
        Paused,
        On,
    }

    interface point {
        readonly x: number;
        readonly y: number;
    }

    let dir: point
    let changeDirection = false
    let speed = 0
    let speedSteps = 0
    let gameOn = GameState.Paused
    let snake: point[] = []
    let egg: point
    let eggCollected = false
    // init
    gameOn = GameState.On
    snake = [{ x: 2, y: 3 }, { x: 2, y: 4 }]
    dir = { x: 1, y: 0 }
    speedSteps = 3
    speed = speedSteps - 1
    egg = genEgg()

    export function switchState() {
        gameOn = gameOn == GameState.On ? GameState.Paused : GameState.On
    }

    export function stepSpeed() {
        speed = (speed + 1) % speedSteps
    }

    export function turnLeft() {
        if (!changeDirection) {
            if (dir.x != 0) {
                dir = { x: 0, y: dir.x * -1 }
            } else if (dir.y != 0) {
                dir = { x: dir.y, y: 0 }
            }
            changeDirection = true
        }
    }

    export function turnRight() {
        if (!changeDirection) {
            if (dir.x != 0) {
                dir = { x: 0, y: dir.x }
            } else if (dir.y != 0) {
                dir = { x: dir.y * -1, y: 0 }
            }
            changeDirection = true
        }
    }

    function show() {
        // snake
        for (let p of snake) {
            led.plot(p.x, p.y)
        }
        // egg
        if (eggCollected) {
            led.plot(egg.x, egg.y)
        } else {
            led.toggle(egg.x, egg.y)
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

    export function mainLoop() {
        let sleep = speed * 200 + 100
        show()
        basic.pause(sleep)
        if (gameOn == GameState.On) {
            // move head
            let newHead = nextHead()
            let tail = snake.pop()
            snake.unshift(newHead)
            led.unplot(tail.x, tail.y)
            if (newHead.x == egg.x && newHead.y == egg.y) {
                // TODO egg collected animation
                // IDEA brighter snake with each egg collected
                eggCollected = true
            } else if (tail.x == egg.x && tail.y == egg.y) {
                led.plot(egg.x, egg.y)
                snake.push(egg)
                egg = genEgg()
                eggCollected = false
            }
            // reinit state
            changeDirection = false
        }
    }
}
input.onPinPressed(TouchPin.P0, snake.switchState)
input.onButtonPressed(Button.A, snake.turnLeft)
input.onButtonPressed(Button.B, snake.turnRight)
input.onPinPressed(TouchPin.P1, snake.stepSpeed)
basic.forever(snake.mainLoop)
