namespace snake {

    const enum GameState {
        Paused,
        On,
    }

    interface point {
        readonly x: number;
        readonly y: number;
    }

    let dy = 0
    let changeDirection = false
    let speed = 0
    let speedSteps = 0
    let dx = 0
    let gameOn = GameState.Paused
    let snake: point[] = []
    let head, x, y, tail, sleep, nh
    let egg: point
    // init
    gameOn = GameState.On
    snake = [{x: 2, y: 3}, {x: 2, y: 4}]
    dx = 1
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
        if (!(changeDirection)) {
            if (dx != 0) {
                dy = dx * -1
                dx = 0
            } else if (dy != 0) {
                dx = dy
                dy = 0
            }
            changeDirection = true
        }
    }

    export function turnRight() {
        if (dx != 0) {
            dy = dx
            dx = 0
        } else if (dy != 0) {
            dx = dy * -1
            dy = 0
        }
    }

    function show() {
        for (let p of snake) {
            led.plot(p.x, p.y)
        }
        led.toggle(egg.x, egg.y)
    }

    function nextHead() {
        head = snake[0]
        x = ((head.x + dx) % 5 + 5) % 5
        y = ((head.y + dy) % 5 + 5) % 5
        return {x: x, y: y}
    }

    function genEgg(): point {
        let egg: point, x: number, y: number
        do {
            x = Math.floor(Math.random() * 5)
            y = Math.floor(Math.random() * 5)
            egg = {x: x, y: y}
        } while (snake.indexOf(egg) >= 0)
        return egg
    }

    export function mainLoop() {
        sleep = speed * 200 + 100
        show()
        basic.pause(sleep)
        if (gameOn == GameState.On) {
            // move head
            nh = nextHead()
            snake.unshift(nh)
            tail = snake.pop()
            led.unplot(tail.x, tail.y)
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
