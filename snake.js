namespace snake {
    let dy = 0
    let changeDirection = false
    let speed = 0
    let speedSteps = 0
    let dx = 0
    let gameOn = false
    let snake: number[][] = []
    let head, x, y, tail, sleep, nh
    // init
    gameOn = true
    snake = [[2, 3], [2, 4]]
    dx = 1
    speedSteps = 3
    speed = speedSteps - 1

    export function pause() {
        gameOn = !(gameOn)
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
            led.plot(p[0], p[1])
        }
    }

    function nextHead() {
        head = snake[0]
        x = ((head[0] + dx) % 5 + 5) % 5
        y = ((head[1] + dy) % 5 + 5) % 5
        return [x, y]
    }

    export function mainLoop() {
        sleep = speed * 200 + 100
        show()
        basic.pause(sleep)
        if (gameOn) {
            // move head
            nh = nextHead()
            snake.unshift(nh)
            tail = snake.pop()
            led.unplot(tail[0], tail[1])
            // reinit state
            changeDirection = false
        }
    }
}
input.onPinPressed(TouchPin.P0, snake.pause)
input.onButtonPressed(Button.A, snake.turnLeft)
input.onButtonPressed(Button.B, snake.turnRight)
input.onPinPressed(TouchPin.P1, snake.stepSpeed)
basic.forever(snake.mainLoop)
